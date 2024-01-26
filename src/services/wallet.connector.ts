import {Account as AlephiumAccount, SignerProvider} from "@alephium/web3";
import {ALEPHIUM} from "../config/blockchain";
import {Round} from "../domain/round";
import {Bet, BetStatus} from "../domain/bet";
import {Account} from "../domain/account";
import {AddressBalance} from "@alephium/web3/dist/src/api/api-alephium";

export class WalletConnector implements WalletConnector {
    private account: AlephiumAccount | undefined;
    private window: SignerProvider | undefined;

    async connect(signer: SignerProvider): Promise<Account> {
        this.window = signer
        this.account = await this.window?.getSelectedAccount();

        if (this.account) {
            return this.getAccount();
        } else {
            return Promise.reject("Can't connect to wallet")
        }
        return Promise.reject("Can't connect to wallet")
    }

    async bid(amount: number, choice: number, round: Round): Promise<Bet> {
        if (this.window === undefined) return Promise.reject("not connected")

        // TODO implement bid
        return new Bet(round, BetStatus.PENDING, await this.getAccount(), choice, amount);
    }

    async claim(bet: Bet): Promise<boolean> {
        return Promise.resolve(true);
    }

    async getAccount(): Promise<Account> {
        const balance = await this.window?.explorerProvider?.addresses.getAddressesAddressBalance(this.account?.address ?? '')
        return new Account(this.account?.address ?? '', parseInt(balance?.balance ?? '0') / Math.pow(10, 18), ALEPHIUM);
    }
}
