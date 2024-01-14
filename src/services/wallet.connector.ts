import {
    Account as AlephiumAccount,
    SignerProvider
} from "@alephium/web3";
import {Wallet} from "@alephium/web3-react";
import {Account} from "@/domain/account";
import {Bet} from "@/domain/bet";
import {Round} from "@/domain/round";
import {ALEPHIUM} from "@/config/blockchain";

export class WalletConnector implements WalletConnector {
    private readonly wallet: Wallet;
    private account: AlephiumAccount | undefined;
    private window: SignerProvider | undefined;
    constructor(wallet: Wallet) {
        this.wallet = wallet;
    }

    getWallet(): Wallet {
        return this.wallet;
    }

    async connect(signer: SignerProvider): Promise<Account> {
        this.window = signer
        this.account = await this.window?.getSelectedAccount();

        if (this.account) {
            return Promise.resolve(new Account(this.account.address, ALEPHIUM));
        } else {
            return Promise.reject("Can't connect to wallet")
        }
        return Promise.reject("Can't connect to wallet")
    }

    async bid(amount: number, choice: number, round: Round): Promise<Bet> {
        if (this.window === undefined) return Promise.reject("not connected")

        return Promise.reject("Bid not yet implemetend");
    }

    async claim(bet: Bet): Promise<boolean> {
        return Promise.resolve(true);
    }
}
