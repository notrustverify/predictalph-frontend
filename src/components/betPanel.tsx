import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../App";
import {Box, Button, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import {Game} from "../domain/game";
import {Bet, BetStatus} from "../domain/bet";
import {Round} from "../domain/round";

type BetPanelProps = {
    game: Game,
}

export function BetPanel({game}: BetPanelProps) {
    const services = useContext(ServiceContext);
    const [bet, setBet] = useState<Bet | null>(null);
    const [round, setRound] = useState<Round | null>(null);
    const [amount, setAmount] = useState(0);

    const goBet = (choice: number) => {
        if (round === null) return;

        const bet = new Bet(round, BetStatus.PENDING, services.wallet.getAccount(), choice, amount);
        services.bet.bet(bet).then();
    }

    useEffect( () => {
        console.log("EFFECT", game.id);
        const interval = await services.bet.getCurrentRound(game).then(res => {
            setRound(res)

            return setInterval(() => {
                console.log('INTERVAL', round);
                if (round === null) return;
                console.log("INTERVAL")

                services.bet.getPlayerBet(round).then(res => {
                    if (res === null) return;
                    console.log(res);
                    setBet(res);
                });

                return () =>  clearInterval(interval);
            }, 1000);
        });

    }, [])

    return (
        <Box sx={{width: '100%'}}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
            >
                <Grid item style={item} sx={{height: '100%'}} md={4} xs={12}>
                    <Button
                        fullWidth
                        disabled={bet !== null}
                        onClick={() => goBet(0)}
                        sx={{height: '100%'}}
                        color="secondary"
                        variant="contained"
                        size="large">
                        {bet === null ? game.choiceDescriptions[0] : bet.choice === 0 ? 'ALREADY BET' : '\ '}
                    </Button>
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
                                    <Button fullWidth variant="text">20%</Button>
                                </Grid>
                                <Grid item md={3}>
                                    <Button fullWidth variant="text">50%</Button>
                                </Grid>
                                <Grid item md={3}>
                                    <Button fullWidth variant="text">70%</Button>
                                </Grid>
                                <Grid item md={3}>
                                    <Button fullWidth variant="text">100%</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item style={item} md={4} xs={12}>
                    <Button
                        disabled={bet !== null}
                        onClick={() => goBet(1)}
                        size="large"
                        fullWidth
                        color="warning"
                        variant="contained">
                        {bet === null ? game.choiceDescriptions[1] : bet.choice === 1 ? 'ALREADY BET' : '&nbsp;'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

const item = {
    padding: '10px',
}
