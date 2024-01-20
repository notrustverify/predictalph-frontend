import { DUST_AMOUNT, ExecuteScriptResult, ONE_ALPH, SignerProvider } from '@alephium/web3'
import { arrayEpochToBytes } from './utils';
import {Bid, Withdraw} from "../artifacts/ts";


export const bid = async (
  signer: SignerProvider,
  predictalphId: string,
  amount: string,
  up: boolean
):Promise<ExecuteScriptResult> => {

  // permit float amount
  const amountInt = BigInt(parseFloat(amount)*Number(ONE_ALPH))

  return await Bid.execute(signer, {
    initialFields: {
      predictalph: predictalphId,
      amount: amountInt+ONE_ALPH,
      up: up,
    },
    attoAlphAmount: amountInt + ONE_ALPH + BigInt(2)  * DUST_AMOUNT,
  });
}

export const withdraw = async (
  signer: SignerProvider,
  predictalphId: string,
  epochParticipationArray: number[]
):Promise<ExecuteScriptResult> => {
  let epochParticipation = arrayEpochToBytes(epochParticipationArray)

  if (epochParticipationArray.length > 10) epochParticipation = arrayEpochToBytes(epochParticipationArray.splice(0,10))


  return await Withdraw.execute(signer, {
    initialFields: { predictalph: predictalphId, epochParticipation },
    attoAlphAmount: DUST_AMOUNT,
  });
}
