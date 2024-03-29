import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Grid,
    Icon,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@mui/material";
import {Game} from "../domain/game";
import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../App";
import {Bet, BetStatus, WinStatus} from "../domain/bet";
import Typography from "@mui/material/Typography";
import {AttachMoney, ExpandMore, HourglassEmpty, MoneyOff, Timelapse} from "@mui/icons-material";

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
        const rawBets = await svc.bet.getPlayerBets(game, true);
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
                return <Icon><HourglassEmpty/></Icon>;
            case BetStatus.INPROGRESS:
                return <Icon><Timelapse/></Icon>
            case BetStatus.NOTCLAIMED:
                return <Icon><AttachMoney/></Icon>
            case BetStatus.CLAIMED:
                return <Icon><MoneyOff/></Icon>
        }
    }

    function aa(bet: Bet) {

    }

    function displayText(bet: Bet) {
        switch (bet.status) {
            case BetStatus.PENDING:
                return 'Pending';
            case BetStatus.INPROGRESS:
                return 'In progress';
            case BetStatus.NOTCLAIMED:
                if (bet.win() === WinStatus.WIN) {
                    return `Won ${bet.reward} ALPH`
                } else {
                    return `Lost bet`
                }
            case BetStatus.CLAIMED:
                if (bet.win() === WinStatus.WIN) {
                    return `Won ${bet.reward} ALPH`
                } else {
                    return `Lost bet`
                }
        }
    }

    function selectColor(status: WinStatus): string {
        switch (status) {
            case WinStatus.WIN:
                return 'secondary.main';
            case WinStatus.FAILED:
                return 'warning.main';
            case WinStatus.INPROGRESS:
                return '';
        }
    }

    return bets.length === 0 ? <></> : (
        <>
            <Grid
                container
                direction='row'
                alignItems="center"
                justifyContent="space-between">
                <Grid item md={4}>
                    <Typography variant="h5">History</Typography>
                </Grid>
                <Grid item md={4}>&nbsp;</Grid>
                <Grid item md={4} sx={{textAlign: "right"}}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => svc.bet.claimMyRound(game).catch(console.log).then()}
                    >
                        CLAIM {computeReward(bets).toFixed(2)} ALPH
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{marginTop: '20px'}}></Box>
            {bets.map((bet) => (
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                        >
                            <Grid item><Typography># {bet.epoch.toString().padStart(3, '0')}</Typography></Grid>
                            <Grid sx={{marginLeft: 1}}></Grid>
                            <Grid item>{displayIcon(bet.status)}</Grid>
                            <Grid sx={{marginLeft: 1}}></Grid>
                            <Grid item>
                                <Typography variant='body1' fontWeight={600} color={selectColor(bet.win())}>
                                    {displayText(bet)}
                                </Typography></Grid>
                        </Grid>


                    </AccordionSummary>
                    <AccordionDetails>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography fontWeight={600}>Status</Typography></TableCell>
                                    <TableCell>{bet.status}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Typography fontWeight={600}>Initial bet</Typography></TableCell>
                                    <TableCell>{(bet.amount - 1).toFixed(2)} ALPH (+1 locked)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Typography fontWeight={600}>Position</Typography></TableCell>
                                    <TableCell>{game.choiceDescriptions[bet.choice]}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}
