import {
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {Round} from "../domain/round";
import {Game} from "../domain/game";
import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../App";
import {Bet, BetStatus} from "../domain/bet";
import Typography from "@mui/material/Typography";

type HistoricProps = {
    game: Game,
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function Historic({game}: HistoricProps) {
    const svc = useContext(ServiceContext);
    const [bets, setBets] = useState<Bet[]>([]);

    const fetch = async (): Promise<void> => {
        const rawBets = await svc.bet.getPlayerBets(game);
        setBets(rawBets.filter(notEmpty));
    }

    useEffect(() => {
        const interval = setInterval(fetch, 1000);
        return () => clearInterval(interval);
    }, []);

    const computeReward = (array: Bet[]): number => {
        const filtered = array
            .filter(b => b.status === BetStatus.ACCEPTED)
            .map(b => b.reward);
        return filtered.length === 0 ? 0 : filtered.reduce((a, b) => a + b);
    }

    return (
        <>
            <Grid
                container
                direction='row'
                alignItems="center"
                justifyContent="space-between">
                <Grid item md={4}>
                    <Typography variant="h4">Bets Historic</Typography>
                </Grid>
                <Grid item md={4}>&nbsp;</Grid>
                <Grid item md={4} sx={{textAlign: "right"}}>
                    <Button color="primary" variant="contained" onClick={() => svc.bet.claimMyRound(game).then()}>CLAIM {computeReward(bets).toFixed(2)} ALPH REWARDS</Button>
                </Grid>
            </Grid>
            <Box sx={{marginTop: '20px'}}></Box>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Epoch</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Bet</TableCell>
                            <TableCell align="right">Result</TableCell>
                            <TableCell align="right">Rewards</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bets.map((bet) => (
                            <TableRow
                                key={bet.epoch}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {bet.epoch.toString(10)}
                                </TableCell>
                                <TableCell align="right">{bet.status}</TableCell>

                                <TableCell align="right" color={bet.win ? 'warning' : 'secondary'}>
                                    {bet.amount.toFixed(2)} ALPH on {game.choiceDescriptions[bet.choice]}
                                </TableCell>
                                <TableCell align="right" color={bet.win ? 'warning' : 'secondary'}>
                                    {bet.win}
                                </TableCell>
                                <TableCell align="right" color={bet.win ? 'warning' : 'secondary'}>
                                    {bet.reward.toFixed(2)} ALPH
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer></>
    )
}
