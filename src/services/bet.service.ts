import {WalletConnector} from "./wallet.connector";
import {BetClient, BetDTO} from "./bet.client";
import {Game, GameType} from "../domain/game";
import {Bet, BetStatus} from "../domain/bet";
import {Contract} from "../domain/contract";
import {BlockchainClient} from "./blockchain.client";
import {Round} from "../domain/round";
import {CoinGeckoClient} from "./coinGeckoClient";

export class BetService {

    private readonly games = [
        new Game(
            "CHOICERHONE",
            "ALPH to $4 before end of Q1?",
            "Bet if Rhone",
            new Contract(
                "538ee843b57883346a621a96e8861418d673b2a045db98c48a81b644229d7801",
                "zK8LeTS97caH7oYk8LUeTRPuzzgyCeVY6x6FHzb5dJYx",
                1),
            ["YES", "NO"],
            GameType.CHOICE,
            '/images/alephium-choice.png'
        ),
        new Game(
            "ALPHPRICE",
            "ALPH Price",
            "Bet if ALPH will go up or down",
            new Contract(
                "6b861470be487607d789714fe91bcc94d974fe76662dca38cf430dd61fe19701",
                "21vgKMVTjSMp6ZU3zxjF5nPb4c1MEndkQtqcRD7MfVPYc",
                1),
            ["BULL", "BEAR"],
            GameType.PRICE,
            '/images/alephium-price.png'
        ),
    ];

    private readonly currentBets = new Map<string, Bet>();


    constructor(
        private readonly wallet: WalletConnector,
        private readonly client: BetClient,
        private readonly blockchain: BlockchainClient,
    ) {
    }

    getGames(): Game[] {
        return this.games;
    }

    async claimMyRound(game: Game) {
        const curr = await this.getCurrentRound(game);
        const bets = await this.getPlayerBets(game)
        return this.wallet.claim(bets.filter(b => b.epoch < curr.epoch), game);
    }

    async claimExpiredRound(): Promise<boolean> {
        return false;
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

        // check current bet prensent in historic
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
        if (dto.priceStart === 0 && dto.priceEnd === 0) {
            return dto.sideWon ? 0 : 1; // if contract is a choice type
        }

        return dto.priceEnd > dto.priceStart ? 0 : 1
    }

    async getPlayerBets(game: Game, addPending = false): Promise<Bet[]> {
        const account = await this.wallet.getAccount();
        const dtos: BetDTO[] = await this.client.getAllPlayerBets(game, account);

        const promises: Promise<Bet>[] = dtos.map(async dto =>{
            const choice = dto.side ? 0 : 1;
            const reward: number = await this.computeRewards(choice, dto, game);
            const status: BetStatus = await this.getStatus(reward, dto)

            return new Bet(
                status,
                account,
                choice,
                (dto.amountBid - 1) / (10**18),
                reward,
                this.getResult(dto),
                dto.epoch,
                )
        });
        const bets: Bet[] =  await Promise.all(promises)

        // purge previous pending bets
        bets.forEach(bet => this.currentBets.delete(BetService.key(game, bet.epoch)))

        if (addPending !== null) {
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

        return (dto.amountBid - 1) * Number(round.rewardAmount ) / Number(round.rewardBaseCalAmount) / (10**18);

    }

    getGame(id: string) {
        return this.games.filter(g => g.id === id)[0];
    }


}
