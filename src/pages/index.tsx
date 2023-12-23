import React from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { TokenDapp } from '@/components/TokenDapp'
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react'
import { tokenFaucetConfig } from '@/services/utils'

export default function Home() {
  const { connectionStatus } = useWallet()

  return (
    <>
      <div className={styles.container}>
        <div className={styles.center}>
        <AlephiumConnectButton />

        </div>
        <Head>
          <title>PredictALPH</title>
          <meta name="description" content="Bet on the price" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {connectionStatus === 'connected' && <TokenDapp config={tokenFaucetConfig} />}
      </div>
    </>
  )
}
