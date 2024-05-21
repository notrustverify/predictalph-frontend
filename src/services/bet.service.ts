import {WalletConnector} from "./wallet.connector";
import {BetClient, BetDTO} from "./bet.client";
import {Game, GameType} from "../domain/game";
import {Bet, BetStatus} from "../domain/bet";
import {BlockchainClient} from "./blockchain.client";
import {Round} from "../domain/round";

export class BetService {
    private readonly currentBets = new Map<string, Bet>();

    constructor(
        private readonly wallet: WalletConnector,
        private readonly client: BetClient,
        private readonly blockchain: BlockchainClient,
        private readonly games: Game[]
    ) {
    }

    getGames(): Game[] {
        return this.games;
    }

    async claimMyRound(game: Game): Promise<boolean> {
        const curr = await this.getCurrentRound(game);
        // console.log(curr)
        const bets = (await this.getPlayerBets(game))
            .filter(b => b.epoch < curr.epoch || curr.rewardsComputed)
            .filter(b => b.status === BetStatus.NOTCLAIMED)
        const tx = await this.wallet.claim(bets, game);
        return this.wallet.waitTx(tx);

    }

    async bet(amount: number, choice: number, game: Game): Promise<Bet> {
        const round = await this.blockchain.getCurrentRound(game);
        const bet = await this.wallet.bid(amount + 1, choice, round);
        this.currentBets.set(BetService.key(game, round.epoch), bet);
        return bet;
    }

    async getCurrentRound(game: Game): Promise<Round> {
        return await this.blockchain.getCurrentRound(game);
    }

    static key(game: Game,  epoch: bigint): string {
        return `${game.id}${epoch}`;
    }

    async getCurrentBet(game: Game): Promise<Bet | null> {
        // clean pending bets
        const bets = await this.getPlayerBets(game);
        bets.forEach(bet => this.currentBets.delete(BetService.key(game, bet.epoch)))

        // check current bet present in historic
        const currRound = await this.getCurrentRound(game);
        const currBet: Bet | null = bets.filter(bet => Number(bet.epoch) === Number(currRound.epoch))[0]
        if (currBet !== undefined) {
            return currBet;
        }

        // check current bet not pending
        const bet: Bet | undefined = this.currentBets.get(BetService.key(game, currRound.epoch));
        if (bet !== undefined) {
            return bet;
        }

        return null
    }

    getResult(dto: BetDTO) {
        if (dto.typeBet === "choice")
            return dto.sideWon ? 0 : 1; // if contract is a choice type
        else if(dto.typeBet === "multiplechoice")
            return dto.sideWonMultipleChoice

        return dto.priceEnd > dto.priceStart ? 0 : 1
    }

    async getPlayerBets(game: Game, addPending = false): Promise<Bet[]> {
        const account = await this.wallet.getAccount();
        const dtos: BetDTO[] = await this.client.getAllPlayerBets(game, account);

        const promises: Promise<Bet>[] = dtos.map(async dto =>{
            let choice
            if(game.type === GameType.MULTIPLE_CHOICE)
                choice = dto.sideMultipleChoice
            else
                choice = dto.side ? 0 : 1;

            // const reward: number = await this.computeRewards(choice, dto, game);
            // const status: BetStatus = await this.getStatus(reward, dto)
            let reward: number;
            let status: BetStatus;
            if (dto.claimed) {
                reward = 0
                status = BetStatus.CLAIMED;
            } else {
                reward = await this.computeRewards(choice, dto, game);
                status = await this.getStatus(reward, dto)
            }

            return new Bet(
                status,
                account,
                choice,
                dto.amountBid-1, // remove 1 from lock contract
                reward,
                this.getResult(dto),
                dto.epoch,
                "" // TODO can we get tx id from API ?
            )
        });
        const bets: Bet[] =  await Promise.all(promises)


        // purge previous pending bets
        bets.forEach(bet => this.currentBets.delete(BetService.key(game, bet.epoch)))

        if (addPending) {
            const currRound = await this.blockchain.getCurrentRound(game);
            const pendingBet: Bet | undefined = this.currentBets.get(BetService.key(game, currRound.epoch));
            if (pendingBet !== undefined) {
                bets.push(pendingBet)
            }
        }

        return bets.sort((a, b) => Number(b.epoch) - Number(a.epoch));
    }

    private async getStatus(reward: number, dto: BetDTO): Promise<BetStatus> {
        if (reward === 0) {
            return BetStatus.INPROGRESS;
        }

        return dto.claimed ? BetStatus.CLAIMED : BetStatus.NOTCLAIMED;
    }

    private async computeRewards(choice: number, dto: BetDTO, game: Game): Promise<number> {
        const round: Round = await this.blockchain.getRound(dto.epoch, game);
        const result = this.getResult(dto);
        if (!round.rewardsComputed) {
            return 0;
        }

        if (choice !== result) {
            return 1; // contract close refund
        }
        return (dto.amountBid-1) * round.rewardAmount / round.rewardBaseCalAmount + 1;

    }

    getGame(id: string): Game | null {
        return this.games.filter(g => g.id === id)[0] ?? null;
    }


}
