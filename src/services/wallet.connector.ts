import {Account as AlephiumAccount, DUST_AMOUNT, SignerProvider, subContractId} from "@alephium/web3";
import {ALEPHIUM} from "../config/blockchain";
import {Round} from "../domain/round";
import {Bet, BetStatus} from "../domain/bet";
import {Account} from "../domain/account";
import {BidChoice, BidPrice, WithdrawChoice, WithdrawPrice} from "../artifacts/ts";
import {Game, GameType} from "../domain/game";
import {WalletConnectionError} from "../errors/WalletConnectionError";
import {WalletNotConnectedError} from "../errors/WalletNotConnected";


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

        const amnt = BigInt(amount * (10 ** 18));

            if (round.game.type === GameType.PRICE) {
                 const res = await BidPrice.execute(this.window, {
                    initialFields: {
                        predict: round.game.contract.id,
                        amount: amnt,
                        side: choice === 0,
                    },
                    attoAlphAmount: amnt+ BigInt(2) * DUST_AMOUNT,
                });

                 return new Bet(BetStatus.PENDING, await this.getAccount(), choice, amount, 0, 0, round.epoch);
            } else  {
                const res = await BidChoice.execute(this.window, {
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

    async getAccount(): Promise<Account> {
        const balance = await this.window?.explorerProvider?.addresses.getAddressesAddressBalance(this.account?.address ?? '')
        return new Account(this.account?.address ?? '', parseInt(balance?.balance ?? '0') / Math.pow(10, 18), ALEPHIUM);
    }
}
