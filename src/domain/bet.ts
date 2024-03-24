import {Account} from "./account";

export enum BetStatus {
    PENDING= "PENDING", // poll txId
    INPROGRESS = "INPROGRESS", // poll txId
    NOTCLAIMED = 'NOTCLAIMED', // API -> retourne les rounds non claim
    CLAIMED = "CLAIMED" // API comme en haut
}

export enum  WinStatus {
    WIN = "WIN",
    FAILED = "FAILED",
    INPROGRESS = "INPROGRESS",
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
