import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../App";
import {Box, Button, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import {Game} from "../domain/game";
import {Bet, BetStatus} from "../domain/bet";
import {Round} from "../domain/round";
import Typography from "@mui/material/Typography";
import {Account} from "../domain/account";
import {PollComponent} from "./poll";

type BetPanelProps = {
    game: Game,
}

export function BetPanel({game}: BetPanelProps) {
    const services = useContext(ServiceContext);
    const [bet, setBet] = useState<Bet | null>(null);
    const [round, setRound] = useState<Round | null>(null);
    const [amount, setAmount] = useState(0);
    const [seed, setSeed] = useState(0);

    const goBet = async (choice: number): Promise<Bet | undefined> => {
        if (round === null || amount === 0) return;

        const account = await services.wallet.getAccount();
        const bet = new Bet(round, BetStatus.PENDING, account, choice, amount, 1);
        return services.bet.bet(bet);
    }

    const setAccountPct = async (pct: number): Promise<void> => {
        const account = await services.wallet.getAccount();
        setAmount(account.amount * pct);
    }

    const fetch = async () => {
        setSeed(Math.random);
        const currRound: Round = await services.round.getCurrent(game);
        setRound(currRound);
        const currBet: Bet | null = await services.bet.getPlayerBet(currRound);

        if (currBet === null) return;
        setBet(currBet);
    }

    useEffect(() => {
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
                        {bet === null
                            ? <Button
                                fullWidth
                                onClick={() => goBet(0)}
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
                                variant="outlined"
                                size="large">
                                {bet.choice === 0 ? 'You already bet' : '.'}
                            </Button>}

                    </Grid>
                    <Grid item style={item} md={4} xs={12}>
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
                    <Grid item style={item} md={4} xs={12}>
                        {bet === null
                            ? <Button
                                onClick={() => goBet(1).then()}
                                size="large"
                                fullWidth
                                color="warning"
                                variant="contained">
                                {game.choiceDescriptions[1]}
                            </Button>
                            : <Button
                                fullWidth
                                sx={{height: '100%'}}
                                color='warning'
                                variant="outlined"
                                size="large">
                                {bet.choice === 1 ? 'You already bet' : '.'}
                            </Button>}

                    </Grid>
                </Grid>
            </Box>
            {round === null ? <div/> : <PollComponent round={round} key={seed}/>}
        </>
    );
}

const item = {
    padding: '10px',
}
