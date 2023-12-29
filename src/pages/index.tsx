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
        <div className={styles.section}>
          <br />
          <AlephiumConnectButton />
        </div>

        <Head>
          <title>ALPH.bet</title>
          <meta name="description" content="Are you up for the challenge of outperforming the market? Test your skills by making predictions on the future price of ALPH." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <details open={connectionStatus !== 'connected'} >
  <summary>Help</summary>
  <div className={styles.section}>
              <h3>ALPH.bet, bet on ALPH price</h3>
              <p>
                The goal is very simple, connect your wallet and choose a side, <b>Up</b> or <b>Down</b>.
              </p>
              <p>
                If you choose <b>Up</b> it means at the end of the round, the price of ALPH will be higher than the{' '}
                <b>locked price</b>.
              </p>
              <p>
                And if you choose <b>Down</b>, you will be considered as a bull and think the price at the end of the
                counter will be lower than it was
              </p>
              <br />

              <h4>Why 1 ALPH is needed</h4>
              <p>
                1 ALPH is needed in addition of the bet to create your bet. You will be able to get this ALPH back by
                clicking on <b>Claiming rewards</b> which will get you all the rewards on the round you bet correctly
              </p>

              <h4>How many times I can participate ?</h4>
              <p>You can only bet once per round. You have to wait the new round to be able to play again</p>
            </div>
            <h4>What is Price locked</h4>
            <p>
              It's price set at the begining of the round. It will be used to compute if it's Up or down side who won at
              the end of the epoch
            </p>
            <p>Enjoy the game</p>
</details>

      

        {connectionStatus === 'connected' && <TokenDapp config={tokenFaucetConfig} />}
      </div>
    </>
  )
}
