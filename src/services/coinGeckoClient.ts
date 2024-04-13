import axios from "axios";

export class CoinGeckoClient {
    private static readonly ONE_MINUTE = 60*1000;
    private lastValues: Map<string, number> = new Map();
    private lastDates: Map<string, number> = new Map();

    constructor() {
    }

    async getPriceAlph(symbol: string): Promise<number> {
        if ((Date.now() - (this.lastDates.get(symbol) ?? 0)) > CoinGeckoClient.ONE_MINUTE) {
            try {
                const res = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`,
                    {validateStatus: (status) => true},
                );
                if (res.status === 200) {
                    this.lastValues.set(symbol, res.data[symbol].usd);
                }
            } catch (e) {} finally {
                this.lastDates.set(symbol, Date.now());
            }
        }

        return this.lastValues.get(symbol) ?? 0;
    }
}
