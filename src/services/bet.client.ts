import {Game} from "../domain/game";
import {Account} from "../domain/account";
import {Round} from "../domain/round";
import {Bet} from "../domain/bet";
import axios from "axios";

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
    constructor(private readonly host: string) {}

    async getAllPlayerBets(game: Game, account: Account): Promise<BetDTO[]> {
        const res = await axios.get<BetDTO[]>(`${this.host}/allround/${game.contract.id}/${account.address}`)
            .then(res => res.status == 200 ? res.data : [])
            .catch(res => []);
        return res;
    }
}
