import {Contract} from "@/domain/contract";
import {Round, RoundStatus} from "@/domain/round";
import {Account} from "@/domain/account";

export enum BetStatus {
    PENDING,
    ACCEPTED,
    CLAIMED
}

export class Bet {
    contract: Contract;
    round: Round;
    status: BetStatus;
    owner: Account;
    choice: number;


    constructor(contract: Contract, round: Round, status: BetStatus, owner: Account, choice: number) {
        this.contract = contract;
        this.round = round;
        this.status = status;
        this.owner = owner;
        this.choice = choice;
    }

    get win(): boolean {
        return this.round.status === RoundStatus.FINISHED && this.round.winner === this.choice;
    }
}
