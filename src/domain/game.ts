import {Contract} from "./contract";

export enum GameType {
    CHOICE = 'CHOICE',
    PRICE = 'PRICE',
}

export class Game {
    constructor(
        public name: string,
        public description: string,
        public contract: Contract,
        public choiceDescriptions: string[],
        public type: GameType,
        public img: string,
        public symbol: string,
        ) {}


    get id(): string {
        return this.contract.address;
    }
}
