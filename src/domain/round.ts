import {Game} from "./game";
import {Contract} from "./contract";

export enum RoundStatus {
    CLOSE,
    PENDING,
    FINISHED
}

export class Round {
    game: Game;
    status: RoundStatus;
    contract: Contract;
    end: number;
    pollAmounts: number[];
    winner: number;
    height: number;


    constructor(game: Game, status: RoundStatus, contract: Contract, end: number, pollAmounts: number[], winner: number, height: number) {
        this.game = game;
        this.status = status;
        this.contract = contract;
        this.end = end;
        this.pollAmounts = pollAmounts;
        this.winner = winner;
        this.height = height;
    }
}
