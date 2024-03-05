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
            "ALPHCHOICE",
            "ALPH Choice",
            new Contract(
                "538ee843b57883346a621a96e8861418d673b2a045db98c48a81b644229d7801",
                "zK8LeTS97caH7oYk8LUeTRPuzzgyCeVY6x6FHzb5dJYx",
                1),
            ["BULL", "BEAR"],
            GameType.CHOICE,
            '/images/alephium-choice.png'
        ),
        new Game(
            "ALPHPRICE",
            "ALPH Price",
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
        this.currentBets.set(game.id, bet);
        return bet;
    }

    async getCurrentRound(game: Game): Promise<Round> {
        const r = await this.blockchain.getCurrentRound(game);
        return r;
    }

    async getCurrentBet(game: Game): Promise<Bet | null> {
        const bet: Bet | undefined = this.currentBets.get(game.id);
        return bet === undefined ? null : bet;
    }

    async getPlayerBets(game: Game): Promise<Bet[]> {
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
                dto.priceEnd > dto.priceStart ? 0 : 1,
                dto.epoch,
                )
        });

        return (await Promise.all(promises)).sort((a, b) => Number( b.epoch - a.epoch));
    }

    private async getStatus(reward: number, dto: BetDTO): Promise<BetStatus> {
        if (reward === 0) {
            return BetStatus.ACCEPTED;
        }

        return dto.claimed ? BetStatus.CLAIMED : BetStatus.NOTCLAIMED;
    }

    private async computeRewards(choice: number, dto: BetDTO, game: Game): Promise<number> {
        const round: Round = await this.blockchain.getRound(dto.epoch, game);

        if (!round.rewardsComputed) {
            return 0;
        }

        if (choice !== round.result) {
            return 1; // contract close refund
        }

        return (dto.amountBid - 1) * Number(round.rewardAmount ) / Number(round.rewardBaseCalAmount) / (10**18);

    }

    getGame(id: string) {
        return this.games.filter(g => g.id === id)[0];
    }


}
