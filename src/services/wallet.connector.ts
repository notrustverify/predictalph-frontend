import {Account as AlephiumAccount, DUST_AMOUNT, SignerProvider} from "@alephium/web3";
import {Round} from "../domain/round";
import {Bet, BetStatus} from "../domain/bet";
import {Account} from "../domain/account";
import {BidChoice, BidPrice, WithdrawChoice, WithdrawPrice} from "../artifacts/ts";
import {Game, GameType} from "../domain/game";
import {WalletConnectionError} from "../errors/WalletConnectionError";
import {WalletNotConnectedError} from "../errors/WalletNotConnected";
import {toBigInt, toDecimal} from "./utils";


function arrayEpochToBytes(arrayEpoch: number[]) {
    const buffer = Buffer.alloc(arrayEpoch.length * 4);
    arrayEpoch.forEach((value, index) => buffer.writeUInt32BE(value, index * 4));
    return buffer.toString("hex");
}

export class WalletConnector implements WalletConnector {
    private account: AlephiumAccount | undefined;
    private window: SignerProvider | undefined;
    private errorCallbacks: Map<string, (e: Error) => void> = new  Map();

    async connect(signer: SignerProvider): Promise<Account> {
        this.window = signer
        this.account = await this.window?.getSelectedAccount();

        if (this.account) {
            return this.getAccount();
        } else {
            this.broadcastError(new WalletConnectionError());
            return Promise.reject("Can't connect to wallet")
        }
    }

    private broadcastError(e: Error): void {
        this.errorCallbacks.forEach(c => c(e));
    }

    onError(id: string, callback: (e: Error) => void): void {
        this.errorCallbacks.set(id, callback);
    }

    removeOnError(id: string): void {
        this.errorCallbacks.delete(id);
    }

    async bid(amount: number, choice: number, round: Round): Promise<Bet> {
        if (this.window === undefined) {
            this.broadcastError(new WalletNotConnectedError());
            return Promise.reject("not connected")
        }

        const amnt = toBigInt(amount);

            if (round.game.type === GameType.PRICE) {
                 await BidPrice.execute(this.window, {
                    initialFields: {
                        predict: round.game.contract.id,
                        amount: amnt,
                        side: choice === 0,
                    },
                    attoAlphAmount: amnt+ BigInt(2) * DUST_AMOUNT,
                });

                 return new Bet(BetStatus.PENDING, await this.getAccount(), choice, amount, 0, 0, round.epoch);
            } else  {
                await BidChoice.execute(this.window, {
                    initialFields: {
                        predict: round.game.contract.id,
                        amount: amnt,
                        side: choice === 0,
                    },
                    attoAlphAmount: amnt + BigInt(2) * DUST_AMOUNT,
                });

                return new Bet(BetStatus.PENDING, await this.getAccount(), choice, amount, 0, 0, round.epoch);

            }
    }

    async claim(bets: Bet[], game: Game): Promise<string> {
        if (this.window === undefined) {
            this.broadcastError(new WalletNotConnectedError());
            return Promise.reject("not connected")
        }

        if (game.type === GameType.PRICE) {
            const res = await WithdrawPrice.execute(this.window, {
                initialFields: {
                    predict: game.contract.id,
                    epochParticipation: arrayEpochToBytes(bets.map(b => Number(b.epoch))),
                    addressToClaim: (await this.getAccount()).address
                },
                attoAlphAmount:  BigInt(2) * DUST_AMOUNT,
            });
            return res.txId;
        } else {
            const res = await WithdrawChoice.execute(this.window, {
                initialFields: {
                    predict: game.contract.id,
                    epochParticipation: arrayEpochToBytes(bets.map(b => Number(b.epoch))),
                    addressToClaim: (await this.getAccount()).address
                },
                attoAlphAmount:  BigInt(2) * DUST_AMOUNT,
            });
            return res.txId
        }
    }

    async waitTx(id: string): Promise<boolean> {
        while (true) {
            try {
                const tx = await this.window?.explorerProvider?.transactions.getTransactionsTransactionHash(id);
                if (tx?.type === "Accepted") {
                    return true;
                }
            } catch (e) {
                // catch 404 not found
            }
            await new Promise(f => setTimeout(f, 1000));
        }
    }

    async getBalance(): Promise<number> {
        const balance = await this.window?.explorerProvider?.addresses.getAddressesAddressBalance(this.account?.address ?? '')

        return toDecimal(BigInt(balance?.balance ?? '0'))
    }

    async getAccount(): Promise<Account> {
        return new Account(this.account?.address ?? '');
    }
}
