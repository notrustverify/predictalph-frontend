import {
    Account as AlephiumAccount,
    SignerProvider
} from "@alephium/web3";
import {Wallet} from "@alephium/web3-react";
import {ALEPHIUM} from "../config/blockchain";
import {Round} from "../domain/round";
import {Bet} from "../domain/bet";
import {Account} from "../domain/account";

export class WalletConnector implements WalletConnector {
    private account: AlephiumAccount | undefined;
    private window: SignerProvider | undefined;

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
