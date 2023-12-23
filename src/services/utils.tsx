import { NetworkId, addressFromContractId, groupOfAddress, subContractId, web3 } from '@alephium/web3'
import { loadDeployments } from '../../artifacts/ts/deployments'
import { Round } from 'artifacts/ts'

export interface PredictAlphConfig {
  network: NetworkId
  groupIndex: number
  predictAlphAddress: string
  predictAlphId: string
}

function getNetwork(): NetworkId {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'devnet') as NetworkId
  return network
}

function getPredictAlphConfig(): PredictAlphConfig {
  const network = getNetwork()
  const predictAlph = loadDeployments(network).contracts.Predictalph.contractInstance
  const groupIndex = predictAlph.groupIndex
  const predictAlphAddress = predictAlph.address
  const predictAlphId = predictAlph.contractId
  return { network, groupIndex, predictAlphAddress, predictAlphId }
}

export const tokenFaucetConfig = getPredictAlphConfig()


export async function getRoundContractState(predictAlphContractId: string, epoch: bigint, groupIndex: number) {

  const roundContractId = getRoundContractId(predictAlphContractId,epoch, groupIndex)

  const roundContract = Round.at(addressFromContractId(roundContractId));
  const state = await roundContract.fetchState();
  return state;
}

export function getRoundContractId(predictAlphContractId: string, epoch: bigint, groupIndex: number){
  return subContractId(predictAlphContractId,getEpochPath(epoch), groupIndex)
}

function getEpochPath(epoch: bigint) {
  return "00" + epoch.toString(16).padStart(8, "0");
}


export function arrayEpochToBytes(arrayEpoch: number[]){
  const buffer = Buffer.alloc(arrayEpoch.length * 4)
  arrayEpoch.forEach((value, index) => buffer.writeUInt32BE(value, index * 4))
  return buffer.toString('hex')

}

export async function contractExists(address: string): Promise<boolean> {
  try {
    const nodeProvider = web3.getCurrentNodeProvider();
    await nodeProvider.contracts.getContractsAddressState(address, {
      group: groupOfAddress(address),
    });
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes("KeyNotFound")) {
      return false;
    }
    throw error;
  }
}


export function getExplorerUrl(): string {
  return getNetwork() == 'mainnet' ? "https://explorer.alephium.org" : "https://testnet.alephium.org" 
}