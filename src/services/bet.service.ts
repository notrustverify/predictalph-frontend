import {WalletConnector} from "./wallet.connector";
import {BetClient} from "./bet.client";
import {Game} from "../domain/game";
import {Round, RoundStatus} from "../domain/round";
import {Bet} from "../domain/bet";
import {Contract} from "../domain/contract";
import {RoundService} from "./round.service";

export class BetService {

    private readonly games = [
        new Game("ALPHPRICE", "ALPH Price", new Contract("", "", 0, "", 0, 0, 0), ["BULL", "BEAR"])
    ];

    private readonly tmpBets = new Map<number, Bet>();


    constructor(private readonly wallet: WalletConnector, private readonly client: BetClient, private readonly roundService: RoundService) {
    }

    getGames(): Game[] {
        return this.games;
    }

    async getBets(game: Game): Promise<Bet[]> {
        return [];
    }

    async claimMyRound(bet: Bet) {
        return this.wallet.claim(bet);
    }

    async claimExpiredRound(): Promise<boolean> {
        return false;
    }

    async bet(bet: Bet): Promise<Bet> {
        this.tmpBets.set(bet.round.height, bet);
        (await this.roundService.getCurrent(bet.round.game)).pollAmounts[bet.choice] += bet.amount;
        return this.wallet.bid(bet.amount, bet.choice, bet.round);
    }

    async getPlayerBet(round: Round): Promise<Bet | null> {
        console.log("TMPBET", this.tmpBets, round);
        return this.tmpBets.get(round.height) ?? null;
    }

    getGame(id: string) {
        return this.games.filter(g => g.id === id)[0];
    }


}
