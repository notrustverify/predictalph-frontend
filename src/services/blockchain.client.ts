import {Game, GameType} from "../domain/game";
import {Round, RoundStatus} from "../domain/round";
import {PredictChoice, PredictPrice} from "../artifacts/ts";
import {web3} from "@alephium/web3";

export class BlockchainClient {
    constructor(private network: 'mainnet' | 'testnet', node: string) {
        web3.setCurrentNodeProvider('https://wallet.testnet.alephium.org')
    }

    async getCurrentRound(game: Game): Promise<Round> {
        const state =  game.type === GameType.PRICE
            ? await PredictPrice.at(game.contract.address).fetchState()
            : await PredictChoice.at(game.contract.address).fetchState()
        console.log('STATE', state.fields);
        return new Round(game, RoundStatus.RUNNING, 0, [100, 120], state.fields.epoch, 1.2);
    }
}
