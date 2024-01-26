import {Blockchain} from "./blockchain";

export class Account {
    address: string;
    amount: number
    blockchain: Blockchain;

    constructor(address: string, amount: number, blockchain: Blockchain) {
        this.address = address;
        this.amount = amount;
        this.blockchain = blockchain;
    }
}
