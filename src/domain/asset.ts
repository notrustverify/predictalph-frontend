import {Account} from "./account";

interface Token {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    description: string;
    logoURI: string;
}

interface Network {
    networkId: number;
    tokens: Token[];
}

export class Asset {
    symbol: string;
    amount: number;
    logo: string;
    decimals: number;
    account: Account

    constructor(symbol: string, amount: number, logo: string, decimals: number, account: Account) {
        this.symbol = symbol;
        this.amount = amount * Math.pow(10, decimals);
        this.logo = logo;
        this.decimals = decimals;
        this.account = account;
    }

    static alph(amount: number, account: Account) {
        return new Asset("ALPH", amount, "https://explorer.alephium.org/logo192.png", 18, account);
    }
}
