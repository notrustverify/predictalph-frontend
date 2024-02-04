import {Game} from "../domain/game";
import {Round, RoundStatus} from "../domain/round";
import {Contract} from "../domain/contract";

export class RoundService {
    private readonly games = [
        new Game("ALPHPRICE", "ALPH Price", new Contract("", "", 0, "", 0, 0, 0), ["Bet BULL", "Bet Bear"])
    ];

    private readonly current = new Round(this.games[0], RoundStatus.PENDING, Date.now() + 1000 * 60 * 3, [500, 500], 0, 123, 4.4, 122);
    private readonly previous = new Round(this.games[0], RoundStatus.PENDING, Date.now() - 1000 * 60 * 3, [500, 500], 0, 122, 3.4, 121);

    async getAll(game: Game): Promise<Round[]> {
        return [this.current, this.previous];
    }

    async get(height: number): Promise<Round> {
        return this.previous;
    }

    async getCurrent(game: Game): Promise<Round> {
        return this.current;
    }
}
