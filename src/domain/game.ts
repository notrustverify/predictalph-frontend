import {Contract} from "./contract";

export enum GameType {
    CHOICE = 'CHOICE',
    PRICE = 'PRICE',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
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

    static fromDict(data: any): Game {
        return new Game(
            data.name,
            data.description,
            Contract.fromDict(data.contract),
            data.choiceDescriptions,
            data.type,
            data.img,
            data.symbol,
        )
    }
}
