import axios from "axios";

export class CoinGeckoClient {

    constructor() {
    }

    async getPriceAlph(): Promise<number> {
        const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=alephium&vs_currencies=usd&precision=3')
        return res.data.alephium.usd;
    }
}
