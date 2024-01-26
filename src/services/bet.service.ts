import {WalletConnector} from "./wallet.connector";
import {BetClient} from "./bet.client";
import {Game} from "../domain/game";
import {Round, RoundStatus} from "../domain/round";
import {Bet} from "../domain/bet";
import {Contract} from "../domain/contract";

export class BetService {
    private readonly wallet: WalletConnector;
    private readonly client: BetClient;

    private readonly games = [
        new Game("ALPHPRICE", "ALPH Price", new Contract("", "", 0, "", 0, 0, 0), ["Bet BULL", "Bet Bear"])
    ];

    private readonly tmpBets = new Map<number, Bet>();
    private readonly current = new Round(this.games[0], RoundStatus.PENDING, Date.now() + 1000 * 60 * 3, [500, 500], 0, 123);

    constructor(wallet: WalletConnector, client: BetClient) {
        this.wallet = wallet;
        this.client = client;
    }

    getGames(): Game[] {
        return this.games;
    }

    async getRounds(game: Game): Promise<Round[]> {
        return [];
    }

    async getBets(game: Game): Promise<Bet[]> {
        return [];
    }

    async bid(amount: number, choice: number, round: Round): Promise<Bet> {
        return this.wallet.bid(amount, choice, round);
    }

    async claimMyRound(bet: Bet) {
        return this.wallet.claim(bet);
    }

    async claimExpiredRound(): Promise<boolean> {
        return false;
    }

    async bet(bet: Bet): Promise<Bet> {
        this.tmpBets.set(bet.round.height, bet);
        this.current.pollAmounts[bet.choice] += bet.amount;
        return this.wallet.bid(bet.amount, bet.choice, bet.round);
    }

    async getPlayerBet(round: Round): Promise<Bet | null> {
        return this.tmpBets.get(round.height) ?? null;
    }

    getGame(id: string) {
        return this.games.filter(g => g.id === id)[0];
    }

    async getCurrentRound(game: Game): Promise<Round> {
        return this.current;
    }
}
