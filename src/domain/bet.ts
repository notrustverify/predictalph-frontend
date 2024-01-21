import {Contract} from "./contract";
import {Round, RoundStatus} from "./round";
import {Account} from "./account";

export enum BetStatus {
    PENDING,
    ACCEPTED,
    CLAIMED
}

export class Bet {
    round: Round;
    status: BetStatus;
    owner: Account;
    choice: number;
    amount: number;


    constructor(round: Round, status: BetStatus, owner: Account, choice: number, amount: number) {
        this.round = round;
        this.status = status;
        this.owner = owner;
        this.choice = choice;
        this.amount = amount;
    }

    get win(): boolean {
        return this.round.status === RoundStatus.FINISHED && this.round.winner === this.choice;
    }
}
