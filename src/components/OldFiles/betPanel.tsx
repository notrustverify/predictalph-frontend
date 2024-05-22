import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../App";
import {Box, Button, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, } from "@mui/material";
import {Game, GameType} from "../domain/game";
import {Bet} from "../domain/bet";
import {Round, RoundStatus} from "../domain/round";
import Typography from "@mui/material/Typography";
import {PollComponent} from "./poll";

type BetPanelProps = {
    game: Game,
    selection: { choice: number | null, amount: number | null }
}


export function BetPanel({game, selection }: BetPanelProps) {
    const services = useContext(ServiceContext);
    const [bet, setBet] = useState<Bet | null>(null);
    const [round, setRound] = useState<Round | null>(null);
    const [amount, setAmount] = useState(0);
    const [seed, setSeed] = useState(0);

    async function placeBet(choice: number): Promise<Bet | undefined>  {
        if (round === null || amount === 0) return;

        return services.bet.bet(amount, choice, game);
    }

    async function setAccountPct(pct: number): Promise<void> {
        const amount = await services.wallet.getBalance();
        const amnt = parseFloat((amount * pct).toFixed(2))
        setAmount(amnt);
    }

    async function fetch() {
        setSeed(Math.random);
        const currRound: Round = await services.bet.getCurrentRound(game);
        setRound(currRound);
        const currBet: Bet | null = await services.bet.getCurrentBet(game);

        if (currBet === null) return;
        setBet(currBet);
    }

    async function init() {
        if (selection !== null && selection.choice !== null && selection.amount !== null) {
            setAmount(selection.amount);
            await services.bet.bet(selection.amount, selection.choice, game);
        }
    }

    useEffect(() => {
        init().catch(console.log).then();

        const interval = setInterval(fetch, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Box sx={{width: '100%'}}>

                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                >

                    <Grid item style={item} sx={{height: '100%'}} md={4} xs={12}>
                        {bet === null && round?.status === RoundStatus.RUNNING
                            ? <Button
                                fullWidth
                                onClick={() => placeBet(0).catch(console.log).then()}
                                sx={{height: '100%'}}
                                color="secondary"
                                variant="contained"
                                size="large">
                                {game.choiceDescriptions[0]}
                            </Button>
                            : <Button
                                fullWidth
                                sx={{height: '100%'}}
                                color='secondary'
                                variant="contained"
                                disabled={true}
                                size="large">
                                {bet?.choice === 0 ? 'You already bet' : '.'}
                            </Button>}

                    </Grid>
                            
                    <Grid item style={item} md={4} xs={12}>
                        {bet === null && round?.status === RoundStatus.RUNNING
                            ? <Button
                                onClick={() => placeBet(1).catch(console.log).then()}
                                size="large"
                                fullWidth
                                color={ game.type === GameType.MULTIPLE_CHOICE ? "secondary": "warning"}
                                variant="contained">
                                {game.choiceDescriptions[1]}
                            </Button>
                            : <Button
                                fullWidth
                                sx={{height: '100%'}}
                                color= {game.type === GameType.MULTIPLE_CHOICE ? "secondary": "warning" }
                                variant="contained"
                                disabled={true}
                                size="large">
                                {bet?.choice === 1 ? 'You already bet' : '.'}
                            </Button>}

                    </Grid>
                    
                    {
                        game.type === GameType.MULTIPLE_CHOICE ? 
                    <Grid item style={item} sx={{height: '100%'}} md={4} xs={12}>
                        {bet === null && round?.status === RoundStatus.RUNNING
                            ? <Button
                                fullWidth
                                onClick={() => placeBet(2).catch(console.log).then()}
                                sx={{height: '100%'}}
                                color="secondary"
                                variant="contained"
                                size="large">
                                {game.choiceDescriptions[2]}
                            </Button>
                            : <Button
                                fullWidth
                                sx={{height: '100%'}}
                                color='secondary'
                                variant="contained"
                                disabled={true}
                                size="large">
                                {bet?.choice === 0 ? 'You already bet' : '.'}
                            </Button>}

                    </Grid> :''
                        }
                          <Grid item style={item} md={12} xs={12}>
                        <Grid
                            container
                            direction="column"
                            alignItems="stretch">

                            <Grid item>
                                <FormControl fullWidth size="small">
                                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        disabled={bet !== null}
                                        type="number"
                                        value={amount}
                                        onChange={event => setAmount(parseInt(event.target.value))}
                                        startAdornment={<InputAdornment position="start">ALPH</InputAdornment>}
                                        label="Amount"/>
                                </FormControl>
                                <Typography variant='caption' color='gray'>Note: 1 ALPH will be locked until you claim</Typography>
                            </Grid>

                            <Grid item sx={{width: '100%'}}>
                                <Grid
                                    container
                                    sx={{width: '100%'}}
                                    direction="row"
                                    justifyContent="space-between">
                                    <Grid item md={3}>
                                        <Button fullWidth variant="text"
                                                onClick={() => setAccountPct(0.2).then()}>20%</Button>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Button fullWidth variant="text"
                                                onClick={() => setAccountPct(0.5).then()}>50%</Button>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Button fullWidth variant="text"
                                                onClick={() => setAccountPct(0.7).then()}>70%</Button>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Button fullWidth variant="text"
                                                onClick={() => setAccountPct(1).then()}>100%</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {/*            {game.type === GameType.CHOICE ? <></> :

                <Box sx={{margin: '20px 10px 30px 10px', height: '500px'}}>
                    <TradingViewWidget symbol={game.symbol}></TradingViewWidget>
                </Box>
            }*/}
            {round === null ? <div/> : <PollComponent round={round} key={seed}/>}
        </>
    );
}

const item = {
    padding: '10px',
}
