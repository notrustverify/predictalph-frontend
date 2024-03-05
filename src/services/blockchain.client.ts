import {Game, GameType} from "../domain/game";
import {Round, RoundPrice, RoundStatus} from "../domain/round";
import {PredictChoice, PredictPrice, Round as RoundPriceContract, RoundChoice} from "../artifacts/ts";
import {addressFromContractId, subContractId, web3} from "@alephium/web3";
import {CoinGeckoClient} from "./coinGeckoClient";

export function getRoundContractId(predictAlphContractId: string, epoch: bigint, groupIndex: number) {
    return subContractId(predictAlphContractId, getEpochPath(epoch), groupIndex)
}

function getEpochPath(epoch: bigint) {
    return '00' + epoch.toString(16).padStart(8, '0')
}

export class BlockchainClient {
    constructor(
        private readonly network: 'mainnet' | 'testnet',
        private readonly node: string,
        private readonly coinGecko: CoinGeckoClient,

    ) {
        web3.setCurrentNodeProvider(`https://wallet.${network}.alephium.org`)
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
            const roundState = await RoundPriceContract.at(subAddress).fetchState();

            console.log(roundState.fields);

            return new RoundPrice(
                game,
                RoundStatus.RUNNING,
                Number(roundState.fields.bidEndTimestamp),
                [Number(roundState.fields.amountUp / BigInt(10**18)), Number(roundState.fields.amountDown / BigInt(10**18))],
                epoch,
                roundState.fields.priceStart < roundState.fields.priceEnd ? 0 : 1,
                roundState.fields.rewardAmount,
                roundState.fields.rewardBaseCalAmount,
                roundState.fields.rewardsComputed,
                await this.convertPrice(roundState.fields.priceStart),
                await this.convertPrice(roundState.fields.priceEnd),
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

    private async convertPrice(price: bigint): Promise<number> {
        if (price === BigInt(0)) {
            return this.coinGecko.getPriceAlph();
        } else {
            return Number(price) / 10_000;
        }
    }
}
