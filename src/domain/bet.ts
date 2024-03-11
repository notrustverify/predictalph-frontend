import {Account} from "./account";

export enum BetStatus {
    PENDING= "PENDING", // poll txId
    ACCEPTED = "ACCEPTED", // poll txId
    NOTCLAIMED = 'NOTCLAIMED', // API -> retourne les rounds non claim
    CLAIMED = "CLAIMED" // API comme en haut
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

    win(): boolean {
        const a= (this.winner === this.choice);
        return a;
    }
}
