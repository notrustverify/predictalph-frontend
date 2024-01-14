import {Bet} from "@/domain/bet";

export class Claim {
    bet: Bet;


    constructor(bet: Bet) {
        this.bet = bet;
    }
}
