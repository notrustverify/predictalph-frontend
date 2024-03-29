import axios from "axios";

export class CoinGeckoClient {
    private static readonly ONE_MINUTE = 60*1000;
    private lastValue: number = 0;
    private lastDate: number = 0;

    constructor() {
    }

    async getPriceAlph(): Promise<number> {
        if ((Date.now() - this.lastDate) > CoinGeckoClient.ONE_MINUTE) {
            try {
                const res = await axios.get(
                    'https://api.coingecko.com/api/v3/simple/price?ids=alephium&vs_currencies=usd&precision=3',
                    {validateStatus: (status) => true},
                );
                this.lastValue = res.status === 200 ? res.data.alephium.usd : this.lastValue;
            } catch (e) {} finally {
                this.lastDate = Date.now();
            }
        }

        return this.lastValue ?? 0;
    }
}