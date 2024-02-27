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
import {RoundService} from "./services/round.service";
import {BlockchainClient} from "./services/blockchain.client";


class Services {


  constructor(public readonly wallet: WalletConnector, public readonly bet: BetService, public readonly round: RoundService) {}
}

const wallet = new WalletConnector();
const client = new BetClient("https://predictalph-api.testnet.notrustverify.ch");
const blockchain = new BlockchainClient("testnet", '');
const round = new RoundService();
const bet = new BetService(wallet, client, blockchain, round);
const services = new Services(wallet, bet, round);

export const ServiceContext = createContext(services);

export default function App() {
  const theme = useTheme() as Theme;
  const [open, setOpen] = useState(true);

  const darkTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {main: '#F72585'},
      secondary: {main: '#28F606'},
      warning: {main: '#FF0000'}
    }
  })

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
              <AlphBetNavbar open={open} handleDrawerOpen={handleDrawerOpen}/>
              <AlphBetSidebar
                  open={open}
                  handleDrawerClose={handleDrawerClose}
                  theme={theme}
              />
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
