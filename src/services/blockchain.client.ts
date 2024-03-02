import {Game, GameType} from "../domain/game";
import {Round, RoundStatus} from "../domain/round";
import {PredictChoice, PredictPrice, Round as RoundPrice, RoundChoice} from "../artifacts/ts";
import {addressFromContractId, subContractId, web3} from "@alephium/web3";

export function getRoundContractId(predictAlphContractId: string, epoch: bigint, groupIndex: number) {
    return subContractId(predictAlphContractId, getEpochPath(epoch), groupIndex)
}

function getEpochPath(epoch: bigint) {
    return '00' + epoch.toString(16).padStart(8, '0')
}

export class BlockchainClient {
    constructor(private network: 'mainnet' | 'testnet', node: string) {
        web3.setCurrentNodeProvider('https://wallet.testnet.alephium.org')
    }

    async getCurrentRound(game: Game): Promise<Round> {
        if (game.type == GameType.PRICE) {
            const gameState = await PredictPrice.at(game.contract.address).fetchState();
            return this.getRound(gameState.fields.epoch, game);
        } else {
            const gameState = await PredictChoice.at(game.contract.address).fetchState();
            console.log('STATE PREDICT PRICE', gameState.fields);
            return this.getRound(gameState.fields.epoch, game);
        }
    }

    async getRound(epoch: bigint, game: Game): Promise<Round> {
        const subAddress = addressFromContractId(getRoundContractId(game.contract.id, epoch, game.contract.index))
        if (game.type === GameType.PRICE) {
            const roundState = await RoundPrice.at(subAddress).fetchState();

            return new Round(
                game,
                RoundStatus.RUNNING,
                Number(roundState.fields.bidEndTimestamp),
                [Number(roundState.fields.amountUp / BigInt(10**18)), Number(roundState.fields.amountDown / BigInt(10**18))],
                epoch,
                roundState.fields.priceStart > roundState.fields.priceEnd ? 0 : 1,
                roundState.fields.rewardAmount,
                roundState.fields.rewardBaseCalAmount,
                roundState.fields.rewardsComputed,
            );
        } else {
            const roundState = await RoundChoice.at(subAddress).fetchState();
            console.log('STATE ROUND STATE', roundState.fields);

            return new Round(
                game,
                RoundStatus.RUNNING,
                Number(roundState.fields.bidEndTimestamp),
                [Number(roundState.fields.amountTrue / BigInt(10**18)), Number(roundState.fields.amountFalse / BigInt(10**18))],
                epoch,
                roundState.fields.sideWon ? 0 : 1,
                roundState.fields.rewardAmount,
                roundState.fields.rewardBaseCalAmount,
                roundState.fields.rewardsComputed,
            );
        }
    }
}
