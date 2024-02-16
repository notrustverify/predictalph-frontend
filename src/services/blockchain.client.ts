import {Game} from "../domain/game";
import {Round, RoundStatus} from "../domain/round";

export class BlockchainClient {
    constructor(private network: 'mainnet' | 'testnet', node: string) {}

    async getCurrentRound(game: Game): Promise<Round> {
        return new Round(game, RoundStatus.RUNNING, 0, [100, 120], 42, 1.2);
    }
}
