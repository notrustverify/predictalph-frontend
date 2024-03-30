import {Game} from "../domain/game";
import {Account} from "../domain/account";
import {Round} from "../domain/round";
import {Bet} from "../domain/bet";
import axios from "axios";
import AsyncLock from "async-lock";

/*
[{"address":"1JDi2dx4gYVde7K9YFsvSva8Md2tt4BeRBHvpueJ5FsjX",
"side":true,
"amountBid":3000000000000000000,
"claimed":false,
"claimedByAnyoneTimestamp":1708706933376,
"epoch":1,
"priceStart":0,
"priceEnd":0}]
 */

export type BetDTO = {
    side: boolean,
    amountBid: number,
    claimed: boolean,
    claimedByAnyoneTimestamp: number
    epoch: bigint,
    priceStart: number,
    priceEnd: number,
    sideWon: number,
}

export class BetClient {
    private static CACHE_MS = 1000;
    private lastFetch = new Map<string, number>;
    private caches = new Map<string, BetDTO[]>();
    private lock = new AsyncLock();

    constructor(private readonly host: string) {}

    async getAllPlayerBets(game: Game, account: Account): Promise<BetDTO[]> {
        return this.lock.acquire('GETBETS', async () => {
            const now = Date.now();

            // use cache
            if (now < (this.lastFetch.get(game.id) ?? 0) + BetClient.CACHE_MS) {
                return this.caches.get(game.id)!;
            }

            // fetch
            const bets: BetDTO[] = await this.fetch(game, account).catch(() => []);

            this.lastFetch.set(game.id, now);
            this.caches.set(game.id, bets);
            return bets;
        });
    }

    private async fetch(game: Game, account: Account): Promise<BetDTO[]> {
        return  axios.get<BetDTO[]>(`${this.host}/allround/${game.contract.id}/${account.address}`)
            .then(res => res.status == 200 ? res.data : []);
    }
}
