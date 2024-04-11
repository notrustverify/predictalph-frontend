import {Game} from "./game";

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
        public rewardAmount: number,
        public rewardBaseCalAmount: number,
        public rewardsComputed: boolean,
        public rewardBoost: number,
) {}
}

export class RoundPrice extends Round {
    constructor(

        public game: Game,
        public status: RoundStatus,// en function de end
        public end: number, // artifacts value
        public pollAmounts: number[],// artifact value
        public epoch: bigint, // artifacts value,
        public result: number,
        public rewardAmount: number,
        public rewardBaseCalAmount: number,
        public rewardsComputed: boolean,
        public priceStart: number,
        public priceEnd: number,
        public rewardBoost: number,
    ) {
        super(game, status, end, pollAmounts, epoch, result, rewardAmount, rewardBaseCalAmount, rewardsComputed, rewardBoost);
    }
}
