import React, { useCallback } from 'react'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'
import { bid, withdraw } from '@/services/token.service'
import { TxStatus } from './TxStatus'
import { useWallet } from '@alephium/web3-react'
import { NetworkId, NodeProvider, ONE_ALPH, addressFromContractId, node, web3 } from '@alephium/web3'
import { PredictAlphConfig, contractExists, getRoundContractId, getRoundContractState } from '@/services/utils'
import { PredictalphInstance, Predictalph, PredictalphTypes } from 'artifacts/ts/Predictalph'
import { CoinGeckoClient } from 'coingecko-api-v3';
import configuration from 'alephium.config'
import * as fetchRetry from 'fetch-retry'
import { Round, RoundTypes } from 'artifacts/ts'
import { Timer } from './Countdown'
import { getNetwork } from '@alephium/cli/dist/utils'


const cgClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: false,
});


const retryFetch = fetchRetry.default(fetch, {
  retries: 10,
  retryDelay: 1000
})

const networkId = (process.env.NEXT_PUBLIC_NETWORK ?? 'devnet') as NetworkId;
const nodeProvider = new NodeProvider(
  configuration.networks[networkId].nodeUrl,
  undefined,
  retryFetch
)

const currentDate = Date.now();


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
  const [userRound, setUserRound] = useState([])

  const [ongoingTxId, setOngoingTxId] = useState<string>()

  let clickedClaimed = false
 

  const bidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (signer) {
      const result = await bid(signer,config.predictAlphId ,BigInt(bidAmount), bidUser)
      setOngoingTxId(result.txId)
    }
  }

  const claimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clickedClaimed = true
    const res = await fetch(`https://NEXT_PUBLIC_API_HOST/round/${account?.address}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if( !res.ok ) return 
  const data = await res.json()
  if(data.length <= 0)
    return

  const intEpoch = data.map((el: string)  => { 
    const intElement = parseInt(el)
    console.log(intElement)

    if(intElement != Number(predictStates?.epoch)) {
      return intElement
    }
    })

    setUserRound(intEpoch)

    if (signer) {
      const result = await withdraw(signer,config.predictAlphId ,intEpoch)
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


  const getStatesPrediction = useCallback(async () => {
    if (config !== undefined && connectionStatus == 'connected') {
      web3.setCurrentNodeProvider(nodeProvider)
      const PredictionStates = Predictalph.at(config.predictAlphAddress)

      const initialState = await PredictionStates.fetchState()
      setPredictStates(initialState.fields)

      const roundContractExist = await contractExists(addressFromContractId(getRoundContractId(config.predictAlphId,initialState.fields.epoch, account.group)))
      
      if(roundContractExist){
        const roundStates = await getRoundContractState(config.predictAlphId,initialState.fields.epoch, account.group)
        setRoundStates(roundStates.fields)

      }else{
        //using old epoch to get the last contract because it means the next round didnt start yet
        const roundStates = await getRoundContractState(config.predictAlphId,initialState.fields.epoch-1n, account.group)
        setRoundStates(roundStates.fields)

      }
      

    }
  }, [account?.group, config, connectionStatus])




  const priceCallback = async() => { 
    const priceCall = await cgClient.simplePrice({ vs_currencies: "usd",ids: "alephium" })
      setPrice(priceCall.alephium.usd.toFixed(3))
      console.log("call")
  }

  
  if(price === ""){
    priceCallback()
    //setInterval(priceCallback,60*1000)
  }

  getStatesPrediction()

  return (
    <>

   
      <div className="columns">
      <form onSubmit={claimSubmit}>
      <input type="submit" disabled={!!ongoingTxId} value="Claim rewards"/>
      <p>Number of round participated: {userRound.length > 0 && !clickedClaimed ? userRound.length : "0"}</p>
      </form>

        <form onSubmit={bidSubmit}>
          <>
            <h2 className={styles.title}>Predict price of ALPH on {config.network}</h2>
            <p>Actual ALPH price: ${price}</p>
            <p>Price locked: ${roundStates?.priceStart.toString()}</p>
            <p>Round end at: { roundStates?.bidEndTimestamp ? (
                    <Timer drawTimestamp={Number(roundStates?.bidEndTimestamp)} /> 
                  ) : (
                    ''
                  )  } - epoch ({Number(roundStates?.epoch)})</p>

            <p>Bear pool: {Number(roundStates?.amountDown)/Number(ONE_ALPH)} ALPH / Bull pool: {Number(roundStates?.amountUp)/Number(ONE_ALPH)} ALPH</p>
            <label htmlFor="withdraw-amount">Amount  (+ 1 ALPH for contract creation)</label>
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
            <p>Fees: {Number(predictStates?.feesBasisPts)/10000}%</p>
            {ongoingTxId && <TxStatus txId={ongoingTxId} txStatusCallback={txStatusCallback} />}

            <br />
            <div style={{ display: 'inline' }}>
            <input  style={{ display: 'inline' }} type="submit" disabled={!!ongoingTxId || currentDate >= Number(roundStates?.bidEndTimestamp) } value="Up" onClick={  (e) => setBid(true)}/> <input style={{ display: 'inline' }} type="submit" disabled={!!ongoingTxId || currentDate >= Number(roundStates?.bidEndTimestamp)} value="Down" onClick={  (e) => setBid(false)} />
            </div>

          
          </>
        </form>
      
      </div>
    </>
  )
}
