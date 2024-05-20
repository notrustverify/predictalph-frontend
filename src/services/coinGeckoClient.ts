import axios from "axios";
import {CacheRepository} from "./cache.repository";

export class CoinGeckoClient {
    private cacheRepository = new CacheRepository<number>(60 * 1000);

    constructor() {
    }

    async getPriceAlph(symbol: string): Promise<number> {
        const cached: number | null = this.cacheRepository.get(symbol);
        if (cached !== null) {
            return cached;
        }

        try {
            const res = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`,
                {validateStatus: (status) => true},
            );
            if (res.status === 200) {
                this.cacheRepository.set(symbol, res.data[symbol].usd);
            } else {
                this.cacheRepository.set(symbol, 0);
            }
        } catch (e) {
            this.cacheRepository.set(symbol, 0);
        }

        return this.cacheRepository.get(symbol) ?? 0;
    }
}
