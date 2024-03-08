import React, {createContext, useState} from 'react'
import { AlephiumWalletProvider } from '@alephium/web3-react'
import {WalletConnector} from "./services/wallet.connector";
import {BetService} from "./services/bet.service";
import {BetClient} from "./services/bet.client";
import {Box, createTheme, CssBaseline, ThemeProvider, useTheme} from "@mui/material";
import {DrawerHeader} from "./components/drawerHeader";
import {AlphBetNavbar} from "./components/navbar";
import {AlphBetSidebar} from "./components/sidebar";
import {Theme} from "@mui/material/styles";
import MainContent from "./components/main";
import {BrowserRouter} from "react-router-dom";
import {BlockchainClient} from "./services/blockchain.client";
import {CoinGeckoClient} from "./services/coinGeckoClient";


class Services {


  constructor(public readonly wallet: WalletConnector, public readonly bet: BetService) {}
}

const wallet = new WalletConnector();
const client = new BetClient("https://predictalph-api.testnet.notrustverify.ch");
const coingecko = new CoinGeckoClient();
const blockchain = new BlockchainClient("testnet", '', coingecko);
const bet = new BetService(wallet, client, blockchain);
const services = new Services(wallet, bet);

export const ServiceContext = createContext(services);

export default function App() {
  const theme = useTheme() as Theme;

  const darkTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {main: '#f62485'},
      secondary: {main: '#28F606'},
      warning: {main: '#FF0000'}
    }
  })

  return (
      <AlephiumWalletProvider
          network={'testnet'}
          addressGroup={1} // TODO
      >
        <ServiceContext.Provider value={services}>
          <BrowserRouter>
          <ThemeProvider theme={darkTheme}>
            <Box sx={{display: "flex"}}>
              <CssBaseline/>
              <AlphBetNavbar/>
              <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <DrawerHeader/>
                <MainContent></MainContent>
              </Box>
            </Box>
          </ThemeProvider>
          </BrowserRouter>
        </ServiceContext.Provider>
      </AlephiumWalletProvider>
  )
}
