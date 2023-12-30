import React, { useCallback, useEffect, useMemo } from 'react'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'
import { bid, withdraw } from '@/services/token.service'
import { TxStatus } from './TxStatus'
import { useBalance, useWallet } from '@alephium/web3-react'
import { DUST_AMOUNT, Fields, NetworkId, NodeProvider, ONE_ALPH, addressFromContractId, node, web3 } from '@alephium/web3'
import {
  PredictAlphConfig,
  contractExists,
  getBetInfoContractId,
  getBetInfoContractState,
  getRoundBetInfoStateFromArray,
  getRoundContractId,
  getRoundContractState,
  getRoundStateFromArray
} from '@/services/utils'
import { PredictalphInstance, Predictalph, PredictalphTypes } from 'artifacts/ts/Predictalph'
import { CoinGeckoClient } from 'coingecko-api-v3'
import configuration from 'alephium.config'
import * as fetchRetry from 'fetch-retry'
import { PunterTypes, Round, RoundTypes } from 'artifacts/ts'
import { Timer } from './Countdown'
import { group } from 'console'
import { useRef, memo } from 'react'
import { waitTxConfirmed } from '@alephium/cli'

const cgClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: false
})

const retryFetch = fetchRetry.default(fetch, {
  retries: 10,
  retryDelay: 100000
})

const networkId = (process.env.NEXT_PUBLIC_NETWORK ?? 'devnet') as NetworkId
const nodeProvider = new NodeProvider(configuration.networks[networkId].nodeUrl, undefined, retryFetch)

const currentDate = Date.now()

const intPriceDivision = 10_000

export const TokenDapp: FC<{
  config: PredictAlphConfig
}> = ({ config }) => {
  const { signer, account, connectionStatus } = useWallet()

  const { balance, updateBalanceForTx } = useBalance()
  const addressGroup = config.groupIndex
  const [bidAmount, setBidAmount] = useState('0')
  const [bidUser, setBid] = useState(false)
  const [price, setPrice] = useState('')
  const [predictStates, setPredictStates] = useState<PredictalphTypes.Fields>()
  const [roundStates, setRoundStates] = useState<RoundTypes.Fields>()
  const [userRound, setUserRound] = useState<number[]>([])
  const [betsInfo, setBetsInfo] = useState<Fields[]>([])

  const [userAlreadyPlayed, setUserPlayed] = useState(false)

  const [ongoingTxId, setOngoingTxId] = useState<string>()

  const bidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (signer) {
      const result = await bid(signer, config.predictAlphId, bidAmount, bidUser)
      setOngoingTxId(result.txId)
      setUserPlayed(true)
    }
  }

  const claimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (signer) {
      //remove on going epoch
      const roundClaim = userRound.filter((round) => round != Number(predictStates?.epoch))
      const result = await withdraw(signer, config.predictAlphId, roundClaim)
      setOngoingTxId(result.txId)
    }
  }

  const txStatusCallback = useCallback(async (status: node.TxStatus, numberOfChecks: number): Promise<any> => {
    if ((status.type === 'Confirmed' && numberOfChecks > 1) || (status.type === 'TxNotFound' && numberOfChecks > 2)) {
      setOngoingTxId(undefined)
    }
    return Promise.resolve()
  }, [])

  useEffect(() => {
    const roundToClaim = async (): Promise<any> => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/round/${account?.address}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('get new round')
      if (ongoingTxId != undefined) {
        await waitTxConfirmed(web3.getCurrentNodeProvider(), ongoingTxId, 1, 2000)
        updateBalanceForTx(ongoingTxId, 1)
      }
      try {
        if (res.ok) {
          const data = await res.json()
          console.log(data)
          const intEpoch = data.map(Number)
          const newEpoch: number[] = []
          intEpoch.forEach((element: number) => {
            if (!userRound.includes(element)) newEpoch.push(element)
          })

          if (intEpoch.length > userRound.length) setUserRound([...userRound, ...newEpoch])
          if (intEpoch.length < userRound.length) setUserRound(newEpoch)
        } if (res.status == 404){
          if (userRound.length  > 0) setUserRound([])

        }
    
      } catch (error) {
        setUserRound([])
        console.error(`Error get user round: ${error}, Error text${res.statusText}, ${res.status}`)
      }
    }
    roundToClaim()
    const interval = setInterval(() => {
      roundToClaim()
    }, 5000)
    return () => clearInterval(interval)
  }, [account?.address, addressGroup, config.predictAlphId, ongoingTxId, updateBalanceForTx, userAlreadyPlayed, userRound, userRound.length])

  useEffect(() => {
    console.log(userRound)
    const getRoundData = async () => {
      if (account != undefined) {
        const allInfo = await getRoundBetInfoStateFromArray(
          userRound,
          account?.address,
          config.predictAlphId,
          addressGroup
        )
        console.log(allInfo)
        console.log(userRound.length, allInfo.length)
        if(userRound.length <= 0) setBetsInfo([])
        if (allInfo.length > 0) setBetsInfo(allInfo)
      }
    }
    getRoundData()
  }, [account, addressGroup, config.predictAlphId, userRound])

  useEffect(() => {
    const getStatesPrediction = async () => {
      if (config !== undefined && connectionStatus == 'connected') {
        web3.setCurrentNodeProvider(nodeProvider)
        const PredictionStates = Predictalph.at(config.predictAlphAddress)

        console.log('shit ton of requets')
        const initialState = await PredictionStates.fetchState()
        if (initialState.fields.epoch != predictStates?.epoch) {
          setPredictStates(initialState.fields)
          setUserPlayed(false)
        }
      }
    }
    getStatesPrediction()
    const interval = setInterval(() => {
      getStatesPrediction()
    }, 10000)
    return () => clearInterval(interval)
  }, [config, connectionStatus, predictStates?.epoch])

  useEffect(() => {
    const getRoundStates = async () => {
      if (predictStates != undefined) {
        const roundContractExist = await contractExists(
          addressFromContractId(getRoundContractId(config.predictAlphId, predictStates?.epoch, addressGroup))
        )
        //console.log(getBetInfoExist)
        if (roundContractExist) {
          const roundStates = await getRoundContractState(config.predictAlphId, predictStates?.epoch, addressGroup)
          setRoundStates(roundStates.fields)
        } else {
          //using old epoch to get the last contract because it means the next round didnt start yet
          const roundStates = await getRoundContractState(config.predictAlphId, predictStates?.epoch - 1n, addressGroup)

          setRoundStates(roundStates.fields)
        }
      }
    }
    getRoundStates()

    const interval = setInterval(() => {
      getRoundStates()
    }, 10000)
    return () => clearInterval(interval)
  }, [addressGroup, config.predictAlphId, predictStates])

  useEffect(() => {
    const getPrice = async () => {
      const priceCall = await cgClient.simplePrice({ vs_currencies: 'usd', ids: 'alephium' })
      setPrice(priceCall.alephium.usd.toFixed(3))
    }

    if (price == '') getPrice()
  }, [price])

  useEffect(() => {
    if (userRound?.includes(Number(predictStates?.epoch))) {
      setUserPlayed(true)
    }
  }, [predictStates?.epoch, userRound])

  useEffect(() => {
    web3.setCurrentNodeProvider(nodeProvider)
    // getStatesPrediction()
    //getRoundStates()
  })

  return (
    <>
      <div className={styles.grid}>
        <form onSubmit={bidSubmit}>
          <>
            <h2 className={styles.title}>Predict price of ALPH on {config.network}</h2>
            <p>
              <a href="https://www.coingecko.com/en/coins/alephium">Actual ALPH price: </a> ${price}
            </p>
            <p>
              Price locked: ${(Number(roundStates?.priceStart) / intPriceDivision).toString()} (
              {(
                ((Number(price) - Number(roundStates?.priceStart) / intPriceDivision) /
                  (Number(roundStates?.priceStart) / intPriceDivision)) *
                100
              ).toFixed(2)}
              %)
            </p>
            <p>
              Round end at:{' '}
              {roundStates?.bidEndTimestamp ? (
                <Timer drawTimestamp={Number(roundStates?.bidEndTimestamp)} resetCounterId={Math.random()} />
              ) : (
                ''
              )}{' '}
              &nbsp; round {Number(roundStates?.epoch)}
            </p>
            <p>Pool size: {Number(roundStates?.totalAmount) / Number(ONE_ALPH)} ALPH </p>
            <small>
              Bear pool: {Number(roundStates?.amountDown) / Number(ONE_ALPH)} ALPH / Bull pool:{' '}
              {Number(roundStates?.amountUp) / Number(ONE_ALPH)} ALPH
              <br />
              <br />
            </small>

            <label htmlFor="withdraw-amount">Amount (+ 1 ALPH for contract creation)</label>
            <input
              type="number"
              id="transfer-amount"
              name="amount"
              value={bidAmount}
              min={Number(DUST_AMOUNT/ONE_ALPH)}
              step="any"
              onChange={(e) => setBidAmount(e.target.value)}
              autoFocus
            />
            <small>Total: {parseFloat(bidAmount) + 1} ALPH</small>
            <br />
            {[1, 5, 10, 25, 50].map((percent, index) => {
              return (
                <div key={index} style={{ display: 'inline' }}>
                  <button
                    className={styles.buttonAmount}
                    type="button"
                    onClick={() =>
                      setBidAmount(
                        ((Number(balance?.balance) / Number(ONE_ALPH)) * (percent / 100)).toFixed(3).toString()
                      )
                    }
                  >
                    {percent}%
                  </button>
                </div>
              )
            })}

            <p>Fees: {Number(predictStates?.feesBasisPts) * 0.0001 * 100}%</p>
            {ongoingTxId && <TxStatus txId={ongoingTxId} txStatusCallback={txStatusCallback} />}
            <p>{userAlreadyPlayed ? 'You already played in this round, wait the round to end' : ''}</p>
            {userRound.length > 9 && (
              <p>
                <b>Claim your rewards before continuing</b>
              </p>
            )}
            <div style={{ display: 'inline' }}>
              <input
                style={{ display: 'inline' }}
                type="submit"
                disabled={
                  !!ongoingTxId ||
                  currentDate >= Number(roundStates?.bidEndTimestamp) ||
                  userAlreadyPlayed ||
                  userRound.length > 9
                }
                value="Up"
                onClick={(e) => setBid(true)}
              />{' '}
              <input
                style={{ display: 'inline' }}
                type="submit"
                disabled={
                  !!ongoingTxId ||
                  currentDate >= Number(roundStates?.bidEndTimestamp) ||
                  userAlreadyPlayed ||
                  userRound.length > 9
                }
                value="Down"
                onClick={(e) => setBid(false)}
              />
            </div>
          </>
        </form>

        <form onSubmit={claimSubmit}>
          <input type="submit" disabled={!!ongoingTxId || userRound.length <= 0} value="Claim rewards" />
          <p>Round participation: {userRound.length}</p>

          <h5>Your round information:</h5>
          {betsInfo.length ?  betsInfo?.map((state, index) => {
            return (
        
              <div key={index}>
                <p>
                  
                  <b>Round: {Number(state.epoch)}</b> -{' '}
                  {state.epoch != predictStates?.epoch
                    ? state.priceEnd == state.priceStart
                      ? 'House Won'
                      : state.priceEnd > state.priceStart
                      ? 'Bull won'
                      : 'Bear won'
                    : 'In progress'}{' '}
                  {state.epoch != predictStates?.epoch &&
                  ((state.upBid && state.priceEnd > state.priceStart) ||
                    (!state.upBid && state.priceEnd < state.priceStart))
                    ? ` - ✅ your rewards: ` +
                      (
                        (Number(state.amountBid) * Number(state.rewardAmount)) /
                        Number(state.rewardBaseCalAmount) /
                        Number(ONE_ALPH)
                      ).toFixed(2) +
                      'ℵ (+1 ALPH)'
                    : ` - your bet: ${state.upBid ? 'Bull' : 'Bear'}`}
                </p>
              </div>
            )
      }) : ''}
        </form>
      </div>
    </>
  )
}
