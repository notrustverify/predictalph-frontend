import React, { useCallback, useEffect } from 'react'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'
import { bid, withdraw } from '@/services/token.service'
import { TxStatus } from './TxStatus'
import { useWallet } from '@alephium/web3-react'
import { NetworkId, NodeProvider, ONE_ALPH, addressFromContractId, node, web3 } from '@alephium/web3'
import { PredictAlphConfig, contractExists, getRoundContractId, getRoundContractState, getRoundStateFromArray } from '@/services/utils'
import { PredictalphInstance, Predictalph, PredictalphTypes } from 'artifacts/ts/Predictalph'
import { CoinGeckoClient } from 'coingecko-api-v3'
import configuration from 'alephium.config'
import * as fetchRetry from 'fetch-retry'
import { Round, RoundTypes } from 'artifacts/ts'
import { Timer } from './Countdown'
import { getNetwork } from '@alephium/cli/dist/utils'

const cgClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: false
})

const retryFetch = fetchRetry.default(fetch, {
  retries: 10,
  retryDelay: 1000
})

const networkId = (process.env.NEXT_PUBLIC_NETWORK ?? 'devnet') as NetworkId
const nodeProvider = new NodeProvider(configuration.networks[networkId].nodeUrl, undefined, retryFetch)

const currentDate = Date.now()

const intPriceDivision = 10_000

export const TokenDapp: FC<{
  config: PredictAlphConfig
}> = ({ config }) => {
  const { signer, account, connectionStatus } = useWallet()
  const addressGroup = config.groupIndex
  const [bidAmount, setBidAmount] = useState('')
  const [bidUser, setBid] = useState(false)
  const [price, setPrice] = useState('')
  const [predictStates, setPredictStates] = useState<PredictalphTypes.Fields>()
  const [roundStates, setRoundStates] = useState<RoundTypes.Fields>()
  const [userRound, setUserRound] = useState<number[]>([])
  const [userAlreadyPlayed, setUserPlayed] = useState(false)
  const [userRoundState, setUserRoundState] = useState<RoundTypes.Fields[]>([])

  const [ongoingTxId, setOngoingTxId] = useState<string>()

  const bidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (signer) {
      const result = await bid(signer, config.predictAlphId, BigInt(bidAmount), bidUser)
      setOngoingTxId(result.txId)
    }
  }

  const claimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (signer) {
      const result = await withdraw(signer, config.predictAlphId, userRound)
      setOngoingTxId(result.txId)
    }
  }

  const txStatusCallback = useCallback(
    async (status: node.TxStatus, numberOfChecks: number): Promise<any> => {
      if ((status.type === 'Confirmed' && numberOfChecks > 1) || (status.type === 'TxNotFound' && numberOfChecks > 2)) {
        setOngoingTxId(undefined)
      }

      return Promise.resolve()
    },
    [setOngoingTxId]
  )

  useEffect(() => {
    const roundToClaim = async (): Promise<any> => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/round/${account?.address}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        setUserRound([])
        return
      }

      const data = await res.json()

      if(data.length <= 0) {
        
          setUserRound([])
          return
        
      }

      const intEpoch = data.map(Number)

      setUserRoundState(getRoundStateFromArray(intEpoch, config.predictAlphId,addressGroup))

      setUserRound(intEpoch)
    }
    roundToClaim()
  }, [account?.address, addressGroup, config.predictAlphId])

  const getStatesPrediction = useCallback(async () => {
    if (config !== undefined && connectionStatus == 'connected') {
      web3.setCurrentNodeProvider(nodeProvider)
      const PredictionStates = Predictalph.at(config.predictAlphAddress)

      const initialState = await PredictionStates.fetchState()
      setPredictStates(initialState.fields)

      const roundContractExist = await contractExists(
        addressFromContractId(getRoundContractId(config.predictAlphId, initialState.fields.epoch, account.group))
      )

      if (roundContractExist) {
        const roundStates = await getRoundContractState(config.predictAlphId, initialState.fields.epoch, account.group)
        setRoundStates(roundStates.fields)
      } else {
        //using old epoch to get the last contract because it means the next round didnt start yet
        const roundStates = await getRoundContractState(
          config.predictAlphId,
          initialState.fields.epoch - 1n,
          account.group
        )
        setRoundStates(roundStates.fields)
      }
    }
  }, [account?.group, config, connectionStatus])

  const priceCallback = async () => {
    const priceCall = await cgClient.simplePrice({ vs_currencies: 'usd', ids: 'alephium' })
    setPrice(priceCall.alephium.usd.toFixed(3))
  }

  useEffect(() => {
    if (userRound?.includes(Number(predictStates?.epoch))) {
      console.log(true)
      setUserPlayed(true)
    }
  }, [predictStates?.epoch, userRound])

  if (price === '') {
    priceCallback()
    //setInterval(priceCallback,60*1000)
  }

  getStatesPrediction()

  return (
    <>
      <div className={styles.grid}>

        <form onSubmit={bidSubmit}>
          <>
            <h2 className={styles.title}>Predict price of ALPH on {config.network}</h2>
            <p>
              <a href="https://www.coingecko.com/en/coins/alephium">Actual ALPH price: </a> ${price}
            </p>
            <p>Price locked: ${(Number(roundStates?.priceStart) / intPriceDivision).toString()}</p>
            <p>
              Round end at:{' '}
              {roundStates?.bidEndTimestamp ? <Timer drawTimestamp={Number(roundStates?.bidEndTimestamp)} /> : ''} -
              epoch ({Number(roundStates?.epoch)})
            </p>

            <p>
              Bear pool: {Number(roundStates?.amountDown) / Number(ONE_ALPH)} ALPH / Bull pool:{' '}
              {Number(roundStates?.amountUp) / Number(ONE_ALPH)} ALPH
            </p>
            <label htmlFor="withdraw-amount">Amount (+ 1 ALPH for contract creation)</label>
            <input
              type="number"
              id="transfer-amount"
              name="amount"
              min="2"
              defaultValue="2"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              autoFocus
            />
            <p>Fees: {Number(predictStates?.feesBasisPts) * 0.0001*100}%</p>
            {ongoingTxId && <TxStatus txId={ongoingTxId} txStatusCallback={txStatusCallback} />}

            <br />
            <p>{userAlreadyPlayed ? 'You already played in this round, wait the round to end' : ''}</p>
            <div style={{ display: 'inline' }}>
              <input
                style={{ display: 'inline' }}
                type="submit"
                disabled={!!ongoingTxId || currentDate >= Number(roundStates?.bidEndTimestamp) || userAlreadyPlayed}
                value="Up"
                onClick={(e) => setBid(true)}
              />{' '}
              <input
                style={{ display: 'inline' }}
                type="submit"
                disabled={!!ongoingTxId || currentDate >= Number(roundStates?.bidEndTimestamp) || userAlreadyPlayed}
                value="Down"
                onClick={(e) => setBid(false)}
              />
            </div>
          </>
        </form>


        <form onSubmit={claimSubmit}>
          <input type="submit" disabled={!!ongoingTxId || userRound.length <= 0 || userAlreadyPlayed} value="Claim rewards" />
          <p>Round participation: {userRound.length}</p>

          <h5>Your round information:</h5>
          {userRoundState.map((state, index) => {
            
            return (
              <div key={index}>
                <p><b>Round: {Number(state.epoch)}</b> -  { state.epoch != predictStates?.epoch ? state.priceEnd == state.priceStart ? "House Won" :state.priceEnd > state.priceStart ? "Bull won": "Bear won" : "In progress"}</p>
                <p>Total amount in pool: {Number(state.rewardBaseCalAmount/ONE_ALPH)} ALPH</p>
              </div>
            )
          })}
        </form>
      </div>
    </>
  )
}
