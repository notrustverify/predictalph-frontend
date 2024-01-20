import React, {createContext, useState} from 'react'
import { AlephiumWalletProvider } from '@alephium/web3-react'
import { tokenFaucetConfig } from './services/utils'
import {WalletConnector} from "./services/wallet.connector";
import {BetService} from "./services/bet.service";
import {BetClient} from "./services/bet.client";
import {Box, createTheme, CssBaseline, ThemeProvider, useTheme} from "@mui/material";
import {DrawerHeader} from "./components/drawerHeader";
import {AlphBetNavbar} from "./components/navbar";
import {AlphBetSidebar} from "./components/sidebar";
import {Theme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";


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

export default function App() {
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
                <Typography>Hello</Typography>
              </Box>
            </Box>
          </ThemeProvider>
        </ServiceContext.Provider>
      </AlephiumWalletProvider>
  )
}
