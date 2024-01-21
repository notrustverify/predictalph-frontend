import {Contract} from "./contract";

export class Game {
    id: string;
    name: string;
    contract: Contract;
    choiceDescriptions: string[];


    constructor(id: string, name: string, contract: Contract, choiceDescriptions: string[]) {
        this.id = id;
        this.name = name;
        this.contract = contract;
        this.choiceDescriptions = choiceDescriptions;
    }
}
