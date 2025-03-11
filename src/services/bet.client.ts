import {Game} from "../domain/game";
import {Account} from "../domain/account";
import axios from "axios";
import AsyncLock from "async-lock";
import {toDecimal} from "./utils";
import {CacheRepository} from "./cache.repository";

export class BetDTO {
    constructor(
        public side: boolean,
        public sideMultipleChoice: number,
        public amountBid: number,
        public claimed: boolean,
        public claimedByAnyoneTimestamp: number,
        public epoch: bigint,
        public priceStart: number,
        public priceEnd: number,
        public sideWon: number,
        public sideWonMultipleChoice: number,
        public typeBet: string
        ) {
    }
}

export class BetClient {
    private lock = new AsyncLock();
    private cacheRepository = new CacheRepository<BetDTO[]>(1000);

    constructor(private readonly host: string) {
    }

    async getAllPlayerBets(game: Game, account: Account): Promise<BetDTO[]> {
        return this.lock.acquire('GETBETS', async () => {
            const now = Date.now();

            // use cache
            const cached: BetDTO[] | null = this.cacheRepository.get(game.id);
            if (cached !== null) {
                return cached
            }

            // fetch
            const bets: BetDTO[] = await this.fetch(game, account)
                .catch((e) => {
                    console.log(e);
                    return[]
                });

            this.cacheRepository.set(game.id, bets);
            return bets;
        });
    }

    private async fetch(game: Game, account: Account): Promise<BetDTO[]> {
        const res = await axios.get(`${this.host}/allround/${game.contract.id}/${account.address}`)
            .then(res => res.status == 200 ? res.data : []);

        return res.map((bet: any) => new BetDTO(
            bet.side,
            bet.sideMultipleChoice,
            toDecimal(BigInt(bet.amountBid)),
            bet.claimed,
            bet.claimedByAnyoneTimestamp,
            bet.epoch,
            bet.priceStart,
            bet.priceEnd,
            bet.sideWon,
            bet.sideWonMultipleChoice,
            bet.type

        ));
    }
}
