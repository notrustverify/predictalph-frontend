import {Round} from "@/domain/round";
import {Bet} from "@/domain/bet";
import {Game} from "@/domain/game";
import {WalletConnector} from "@/services/wallet.connector";
import {BetClient} from "@/services/bet.client";

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

    async claim(bet: Bet) {
        return this.wallet.claim(bet);
    }
}
