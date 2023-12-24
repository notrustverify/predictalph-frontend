import { DUST_AMOUNT, ExecuteScriptResult, ONE_ALPH, SignerProvider } from '@alephium/web3'
import { Withdraw, Bid } from '../../artifacts/ts/scripts'
import { PredictalphInstance } from 'artifacts/ts/Predictalph'
import { arrayEpochToBytes } from './utils';


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
    attoAlphAmount: amountInt +ONE_ALPH + 2n * DUST_AMOUNT,
  });
}

export const withdraw = async (
  signer: SignerProvider,
  predictalphId: string,
  epochParticipationArray: number[]
):Promise<ExecuteScriptResult> => {
  const epochParticipation = arrayEpochToBytes(epochParticipationArray)
  console.log(epochParticipation)
  return await Withdraw.execute(signer, {
    initialFields: { predictalph: predictalphId, epochParticipation },
    attoAlphAmount: DUST_AMOUNT,
  });
}
