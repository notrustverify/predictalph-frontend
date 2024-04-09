import {Account} from "./account";

export enum BetStatus {
    PENDING= "Pending", // poll txId
    INPROGRESS = "In progress", // poll txId
    NOTCLAIMED = 'Not claimed', // API -> retourne les rounds non claim
    CLAIMED = "Claimed" // API comme en haut
}

export enum  WinStatus {
    WIN = "Win",
    FAILED = "Failed",
    INPROGRESS = "In progress",
}

export class Bet {

    constructor(
        public status: BetStatus,
        public owner: Account,
        public choice: number, // contract
        public amount: number, // contract
        public reward: number, // cf calcul dans le contract
        public winner: number,
        public epoch: bigint,
    ) {}

    win(): WinStatus {
        if (this.status === BetStatus.INPROGRESS) {
            return WinStatus.INPROGRESS
        }
        const win= (this.winner === this.choice);
        return win ? WinStatus.WIN : WinStatus.FAILED;
    }
}
