import {Game} from "./game";
import {Contract} from "./contract";

export enum RoundStatus {
    CLOSE,
    RUNNING,
    FINISHED
}

export class Round {
    constructor(

        public game: Game,
        public status: RoundStatus,// en function de end
        public end: number, // artifacts value
        public pollAmounts: number[],// artifact value
        public epoch: bigint, // artifacts value,
        public result: number,
        public rewardAmount: bigint,
        public rewardBaseCalAmount: bigint,
        public rewardsComputed: boolean,
) {}
}
