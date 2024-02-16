import {Contract} from "./contract";

export enum GameType {
    CHOICE = 'CHOICE',
    PRICE = 'PRICE',
}

export class Game {
    constructor(
        public id: string,
        public name: string,
        public contract: Contract,
        public choiceDescriptions: string[],
        public type: GameType
        ) {}
}
