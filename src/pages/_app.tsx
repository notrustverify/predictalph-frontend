import React, {createContext, useState} from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AlephiumWalletProvider } from '@alephium/web3-react'
import { tokenFaucetConfig } from '@/services/utils'
import {WalletConnector} from "@/services/wallet.connector";
import {BetService} from "@/services/bet.service";
import {BetClient} from "@/services/bet.client";
import {useTheme} from "styled-components";
import {Box, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {DrawerHeader} from "@/components/drawerHeader";
import {AlphBetNavbar} from "@/components/navbar";
import {AlphBetSidebar} from "@/components/sidebar";
import {Theme} from "@mui/material/styles";


class Services {
  wallet: WalletConnector;
  bet: BetService;


  constructor(wallet: WalletConnector, bet: BetService) {
    this.wallet = wallet;
    this.bet = bet;
  }
}

const wallet = new WalletConnector();
const client = new BetClient();
const bet = new BetService(wallet, client);
const services = new Services(wallet, bet);

export const ServiceContext = createContext(services);

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme() as Theme;
  const [open, setOpen] = useState(true);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {main: '#7E3FF2'},
      secondary: {main: '#36962f'}
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
      network={tokenFaucetConfig.network}
      addressGroup={tokenFaucetConfig.groupIndex}
    >
      <ServiceContext.Provider value={services}>
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
              <Component {...pageProps} />
            </Box>
          </Box>
        </ThemeProvider>
      </ServiceContext.Provider>
    </AlephiumWalletProvider>
  )
}
