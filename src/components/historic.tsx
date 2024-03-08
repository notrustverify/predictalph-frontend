import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Grid,
    Icon,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {Game} from "../domain/game";
import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../App";
import {Bet, BetStatus} from "../domain/bet";
import Typography from "@mui/material/Typography";
import {AttachMoney, Done, ExpandMore, MoneyOff, Timelapse} from "@mui/icons-material";

type HistoricProps = {
    game: Game,
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function Historic({game}: HistoricProps) {
    const svc = useContext(ServiceContext);
    const [bets, setBets] = useState<Bet[]>([]);

    async function fetch(): Promise<void> {
        const rawBets = await svc.bet.getPlayerBets(game);
        setBets(rawBets.filter(notEmpty));
    }

    useEffect(() => {
        const interval = setInterval(fetch, 1000);
        return () => clearInterval(interval);
    }, []);

    function computeReward(array: Bet[]): number {
        const filtered = array
            .filter(b => b.status === BetStatus.NOTCLAIMED)
            .map(b => b.reward);
        return filtered.length === 0 ? 0 : filtered.reduce((a, b) => a + b);
    }

    function displayIcon(status: BetStatus) {
        switch (status) {
            case BetStatus.PENDING:
                return <Icon><Timelapse/></Icon>;
            case BetStatus.ACCEPTED:
                return <Icon><Done/></Icon>
            case BetStatus.NOTCLAIMED:
                return <Icon><AttachMoney/></Icon>
            case BetStatus.CLAIMED:
                return <Icon><MoneyOff/></Icon>
        }
    }

    return (
        <>
            <Grid
                container
                direction='row'
                alignItems="center"
                justifyContent="space-between">
                <Grid item md={4}>
                    <Typography variant="h4">Historic</Typography>
                </Grid>
                <Grid item md={4}>&nbsp;</Grid>
                <Grid item md={4} sx={{textAlign: "right"}}>
                    <Button color="primary" variant="contained" onClick={() => svc.bet.claimMyRound(game).then()}>CLAIM {computeReward(bets).toFixed(2)} ALPH</Button>
                </Grid>
            </Grid>
            <Box sx={{marginTop: '20px'}}></Box>
            {bets.map((bet) => (
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            sx={{ width: '33%', flexShrink: 0 }}
                        >
                            <Grid item><Typography># {bet.epoch.toString()}</Typography></Grid>
                            <Grid sx={{marginLeft: 1}}></Grid>
                            <Grid item>{displayIcon(bet.status)}</Grid>
                        </Grid>

                        <Typography variant='body2' color={bet.win() ? 'secondary.main' : 'warning.main'}>
                            {bet.amount.toFixed(2)} ALPH on {game.choiceDescriptions[bet.choice]}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>STATUS</TableCell>
                                        <TableCell>{bet.status}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>REWARD</TableCell>
                                        <TableCell>{bet.reward} ALPH</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}
