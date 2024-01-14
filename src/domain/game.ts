import {Contract} from "@/domain/contract";

export class Game {
    name: string;
    contract: Contract;
    choiceDescriptions: string[];


    constructor(name: string, contract: Contract, choiceDescriptions: string[]) {
        this.name = name;
        this.contract = contract;
        this.choiceDescriptions = choiceDescriptions;
    }
}
