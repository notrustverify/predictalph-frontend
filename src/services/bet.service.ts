
import {WalletConnector} from "./wallet.connector";
import {BetClient} from "./bet.client";
import {Game} from "../domain/game";
import {Round} from "../domain/round";
import {Bet} from "../domain/bet";

export class BetService {
    private readonly wallet: WalletConnector;
    private readonly client: BetClient;

    constructor(wallet: WalletConnector, client: BetClient) {
        this.wallet = wallet;
        this.client = client;
    }

    async getGames(): Promise<Game[]> {
        return []
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
}
