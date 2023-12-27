import {
  Fields,
  NetworkId,
  addressFromContractId,
  encodeContractField,
  groupOfAddress,
  sleep,
  subContractId,
  web3
} from '@alephium/web3'
import { loadDeployments } from '../../artifacts/ts/deployments'
import { Punter, PunterTypes, Round, RoundTypes } from 'artifacts/ts'
import * as base58 from 'bs58'

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
  const roundContractId = getRoundContractId(predictAlphContractId, epoch, groupIndex)

  const roundContract = Round.at(addressFromContractId(roundContractId))
  const state = await roundContract.fetchState()
  return state
}

export function getRoundContractId(predictAlphContractId: string, epoch: bigint, groupIndex: number) {
  return subContractId(predictAlphContractId, getEpochPath(epoch), groupIndex)
}

function getEpochPath(epoch: bigint) {
  return '00' + epoch.toString(16).padStart(8, '0')
}

export function arrayEpochToBytes(arrayEpoch: number[]) {
  const buffer = Buffer.alloc(arrayEpoch.length * 4)
  arrayEpoch.forEach((value, index) => buffer.writeUInt32BE(value, index * 4))
  return buffer.toString('hex')
}

export async function contractExists(address: string): Promise<boolean> {
  try {
    const nodeProvider = web3.getCurrentNodeProvider()
    await nodeProvider.contracts.getContractsAddressState(address, {
      group: groupOfAddress(address)
    })
    return true
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('KeyNotFound')) {
      return false
    }
    throw error
  }
}

export function getRoundStateFromArray(
  arrayEpoch: [],
  predictAlphContractId: string,
  groupIndex: number
): RoundTypes.Fields[] {
  const roundsState: RoundTypes.Fields[] = []
  arrayEpoch.forEach(async (element) => {
    const state = (await getRoundContractState(predictAlphContractId, element, groupIndex)).fields
    roundsState.push(state)
  })

  return roundsState
}

export async function getRoundBetInfoStateFromArray(
  arrayEpoch: number[],
  address: string,
  predictAlphContractId: string,
  groupIndex: number
): Promise<Fields[]> {
  const states: Fields[] = []

  // old school but works

  for (let i = 0, len = arrayEpoch.length; i < len; i++) { 
    const castElement = BigInt(arrayEpoch[i])

    const betInfoExists = await contractExists(
      addressFromContractId(getBetInfoContractId(predictAlphContractId, address, castElement, groupIndex))
    )
 
    if (betInfoExists) {
      process.env.NEXT_PUBLIC_NETWORK == 'testnet' && (await sleep(4 * 1000))
      const stateBetInfo = await getBetInfoContractState(predictAlphContractId, address, castElement, groupIndex)
      

      process.env.NEXT_PUBLIC_NETWORK == 'testnet' && (await sleep(4 * 1000))
      const roundState = await getRoundContractState(predictAlphContractId, castElement, groupIndex)

      states.push({ ...stateBetInfo.fields, ...roundState.fields })
    }
  }

  return states
}

export function getExplorerUrl(): string {
  return getNetwork() == 'mainnet' ? 'https://explorer.alephium.org' : 'https://testnet.alephium.org'
}

export function getBetInfoPath(address: string, epoch: bigint) {
  const buff = Buffer.from(base58.decode(address))

  const path = '01' + buff.toString('hex') + epoch.toString(16).padStart(8, '0')
  //console.log(path)
  return path
}

export function getBetInfoContractId(
  predictAlphContractId: string,
  address: string,
  epoch: bigint,
  groupIndex: number
) {
  return subContractId(predictAlphContractId, getBetInfoPath(address, epoch), groupIndex)
}

export async function getBetInfoContractState(
  predictAlphContractId: string,
  address: string,
  epoch: bigint,
  groupIndex: number
) {
  const betInfoContractId = getBetInfoContractId(predictAlphContractId, address, epoch, groupIndex)

  const roundContract = Punter.at(addressFromContractId(betInfoContractId))
  const state = await roundContract.fetchState()
  return state
}


