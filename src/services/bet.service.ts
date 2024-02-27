import {WalletConnector} from "./wallet.connector";
import {BetClient, BetDTO} from "./bet.client";
import {Game, GameType} from "../domain/game";
import {Bet, BetStatus} from "../domain/bet";
import {Contract} from "../domain/contract";
import {RoundService} from "./round.service";
import {BlockchainClient} from "./blockchain.client";
import {Round} from "../domain/round";

export class BetService {

    private readonly games = [
        new Game(
            "ALPHPRICE",
            "ALPH Price",
            new Contract(
                "8e4501267810166ab78f55b2cd87dac57fa2b7ab01b804e519bd7a0011c85301",
                "24GK2udXSwkjkD78xpBgZZNJpLbEaDEKrgsEeRNqwjVDi",
                1),
            ["BULL", "BEAR"],
            GameType.CHOICE
        )
    ];

    private readonly currentBets = new Map<string, Bet>();


    constructor(
        private readonly wallet: WalletConnector,
        private readonly client: BetClient,
        private readonly blockchain: BlockchainClient,
        private readonly roundService: RoundService) {
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
        return this.blockchain.getCurrentRound(game);
    }

    async getCurrentBet(game: Game): Promise<Bet | null> {
        const bet: Bet | undefined = this.currentBets.get(game.id);
        return bet === undefined ? null : bet;
    }

    async getPlayerBets(game: Game): Promise<Bet[]> {
        const account = await this.wallet.getAccount();
        const dtos: BetDTO[] = await this.client.getAllPlayerBets(game, account);

        return dtos.map(dto => {
            return new Bet(
                dto.claimed ? BetStatus.CLAIMED : BetStatus.NOTCLAIMED,
                account,
                dto.side ? 0 : 1,
                dto.amountBid / (10**18),
                42,
                        dto.priceEnd > dto.priceStart ? 0 : 1,
                dto.epoch,
                )
        })
    }

    getGame(id: string) {
        return this.games.filter(g => g.id === id)[0];
    }


}
