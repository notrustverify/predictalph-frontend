import React, {createContext, useContext, useEffect, useState} from 'react'
import {AlephiumWalletProvider} from '@alephium/web3-react'
import {WalletConnector} from "./services/wallet.connector";
import {BetService} from "./services/bet.service";
import {BetClient} from "./services/bet.client";
import {BrowserRouter} from "react-router-dom";
import {BlockchainClient} from "./services/blockchain.client";
import {CoinGeckoClient} from "./services/coinGeckoClient";
import config from "./config.json"
import {Game} from "./domain/game";
import Menu from "./components/Navigation/menu";
import i18n from './translation';
import {I18nextProvider} from "react-i18next";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import LayoutBet from "./components/Layout/LayoutBet";
import LayoutCard from "./components/Layout/LayoutCard";
import TradingView from "./components/Trading/TradingView";

class Services {
  constructor(
      public readonly wallet: WalletConnector,
      public readonly bet: BetService) {}
}

const network = config.network as "testnet" | "mainnet" | "devnet";
const games = config.games.map(g => Game.fromDict(g));

const wallet = new WalletConnector();
const client = new BetClient(config.ntvApi);
const coingecko = new CoinGeckoClient();
const blockchain = new BlockchainClient(network, coingecko);
const bet = new BetService(wallet, client, blockchain, games);
const services = new Services(wallet, bet);

export const ServiceContext = createContext(services);

export default function App() {

    const [choice, setChoice] = useState(0);
    const [language, setLanguage] = useState("en");
    const ThisServices = useContext(ServiceContext);

    useEffect( () => {
        i18n.changeLanguage(language);
    }, [language])

  return (
    <AlephiumWalletProvider
        network={network}
        addressGroup={config.games[0].contract.index}
    >
      <ServiceContext.Provider value={services}>
        <I18nextProvider i18n={i18n} >
          <BrowserRouter>
            {/*<TradingView />*/}
            <Menu
                language={language}
                setLanguage={setLanguage}
            />
            <Leaderboard/>
            <LayoutBet setChoice={setChoice} choice={choice}/>
            <LayoutCard choice={choice} ThisServices={ThisServices} language={language} />
          </BrowserRouter>
        </I18nextProvider>
      </ServiceContext.Provider>
    </AlephiumWalletProvider>
  )
}


/*
//ANCIENNE VERSION
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


 */
