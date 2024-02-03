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
    end: number;
    pollAmounts: number[];
    winner: number;
    height: number;
    result: number;
    previous: number;


    constructor(game: Game, status: RoundStatus, end: number, pollAmounts: number[], winner: number, height: number, result: number, previous: number) {
        this.game = game;
        this.status = status;
        this.end = end;
        this.pollAmounts = pollAmounts;
        this.winner = winner;
        this.height = height;
        this.result = result;
        this.previous = previous;
    }
}
