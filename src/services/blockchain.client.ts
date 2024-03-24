import {Game, GameType} from "../domain/game";
import {Round, RoundPrice, RoundStatus} from "../domain/round";
import {
    PredictChoice,
    PredictPrice,
    PredictPriceTypes,
    Round as RoundPriceContract,
    RoundChoice
} from "../artifacts/ts";
import {addressFromContractId, binToHex, hexToBinUnsafe, hexToString, subContractId, web3} from "@alephium/web3";
import {CoinGeckoClient} from "./coinGeckoClient";
import AsyncLock from "async-lock";


export function getRoundContractId(predictAlphContractId: string, epoch: bigint, groupIndex: number) {
    return subContractId(predictAlphContractId, getEpochPath(epoch), groupIndex)
}

function getEpochPath(epoch: bigint) {
    return '00' + epoch.toString(16).padStart(8, '0')
}

export class BlockchainClient {
    private static CACHE_EXP_ROUND_MS = 2000;
    private static  CACHE_EXP_EPOCH_MS = 2000;
    private lastFetchCurrentRound: number = 0;
    private lastFetchCurrentEpoch: number = 0
    private cachedRounds: Map<string, Round> = new Map();
    private cachedCurrentEpoch: Map<string, bigint> = new Map();
    private lock = new AsyncLock()

    constructor(
        private readonly network: 'mainnet' | 'testnet',
        private readonly node: string,
        private readonly coinGecko: CoinGeckoClient,
    ) {
        web3.setCurrentNodeProvider(`https://wallet.${network}.alephium.org`)
    }

    async getCurrentRound(game: Game): Promise<Round> {
        const cached = this.cachedCurrentEpoch.get(game.id);
        const now = Date.now();
        let epoch: bigint = BigInt('0');

        if (cached !== undefined && (now - this.lastFetchCurrentEpoch) < BlockchainClient.CACHE_EXP_EPOCH_MS) {
            epoch = cached;
            return this.getRound(epoch, game);
        }

        let gameState: PredictPriceTypes.State;
        if (game.type === GameType.PRICE) {
            gameState = await PredictPrice.at(game.contract.address).fetchState();
        } else {
            gameState = await PredictChoice.at(game.contract.address).fetchState();
            console.log('TITLE', hexToString(gameState.fields.title));
        }

        epoch = gameState.fields.epoch;
        this.cachedCurrentEpoch.set(game.id, epoch);
        this.lastFetchCurrentEpoch = now;
        return this.getRound(epoch, game);
    }

    private static key(epoch: bigint, game: Game): string {
        return `${epoch}${game.id}`
    }

    async getRound(epoch: bigint, game: Game): Promise<Round> {
        return this.lock.acquire('GETROUND', async () => {
            const cache = this.cachedRounds.get(BlockchainClient.key(epoch, game));
            const now = Date.now()

            // if round finished and cached return it
            if (cache !== undefined && cache.status !== RoundStatus.RUNNING) {
                return cache;
            }

            // if running round but cache not expire return it
            if (cache !== undefined && (now - this.lastFetchCurrentRound) < BlockchainClient.CACHE_EXP_ROUND_MS) {
                return cache;
            }

            const round = await this.fetchRound(epoch, game);
            if (round.status === RoundStatus.RUNNING) {
                this.lastFetchCurrentRound = now;
            }
            this.cachedRounds.set(BlockchainClient.key(epoch, game), round);

            return round;
        });
    }

    private async fetchRound(epoch: bigint, game: Game): Promise<Round> {
        const subAddress = addressFromContractId(getRoundContractId(game.contract.id, epoch, game.contract.index))
        if (game.type === GameType.PRICE) {
            const roundState = await RoundPriceContract.at(subAddress).fetchState();

            return new RoundPrice(
                game,
                RoundStatus.RUNNING,
                Number(roundState.fields.bidEndTimestamp),
                [Number(roundState.fields.amountUp / BigInt(10 ** 18)), Number(roundState.fields.amountDown / BigInt(10 ** 18))],
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

            return new Round(
                game,
                RoundStatus.RUNNING,
                Number(roundState.fields.bidEndTimestamp),
                [Number(roundState.fields.amountTrue / BigInt(10 ** 18)), Number(roundState.fields.amountFalse / BigInt(10 ** 18))],
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
