import {Round, RoundPrice} from "../domain/round";
import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../App";
import {Box, Grid, LinearProgress} from "@mui/material";
import Typography from "@mui/material/Typography";

type PollComponentType = {
    round: Round;
}

export function PollComponent({round}: PollComponentType) {
    const itemStyle = {
        padding: '10px',
    }

    const getPctBar = (amount: number): number => {
        const max = round.pollAmounts.reduce((a, b) => Math.max(a, b));
        return 90 * amount / max;
    }

    const displayDate = (round: Round): string => {
        const now = Date.now();
        if (round.end > now) {
            const duration = Math.ceil((round.end - now) / 1000);
            const hours = Math.floor(duration / 3600); // Hours are in 24-hour format
            const minutes = Math.floor((duration % 3600) / 60);
            const secondsRemaining = duration % 60;

            return `${hours}h ${minutes}m ${secondsRemaining}s`;
        } else {
            return (new Date(round.end)).toLocaleString();
        }
    }

    function computePct(curr: RoundPrice): number {
        return (curr.priceEnd - curr.priceStart) / curr.priceStart * 100;
    }

    return (
        <Box sx={{width: '100%'}}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
            >
                <Grid item style={itemStyle} sx={{height: '100%'}} md={4} xs={12}>
                    <Typography>ALPH {round.pollAmounts[0]}</Typography>
                    <LinearProgress
                        sx={{transform: "rotate(180deg)"}}
                        color="secondary"
                        variant="determinate"
                        value={getPctBar(round.pollAmounts[0])}
                        valueBuffer={20}
                    />
                </Grid>
                <Grid item style={itemStyle} md={4} xs={12}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center">
                        { round instanceof RoundPrice
                            ? <>
                                <Grid item md={6} sx={{textAlign: "center"}}>{round.priceEnd} $</Grid>
                                <Grid item md={6} sx={{textAlign: "center"}}>
                                    <Typography color={computePct(round) > 0 ? 'secondary.main': 'warning.main'}>
                                        {computePct(round).toFixed(2)} %
                                    </Typography>

                                </Grid>
                            </>
                            : <Grid item md={12} sx={{textAlign: "center"}}>
                                <Typography style={{color: round.result === 0 ? 'secondary.main' : 'warning.main'}}>{round.game.choiceDescriptions[round.result]}</Typography>
                            </Grid>
                        }

                        <Grid item md={12} sx={{textAlign: "center"}}>{displayDate(round)}</Grid>
                    </Grid>
                </Grid>
                <Grid item style={itemStyle} md={4} xs={12}>
                    <Typography>ALPH {round.pollAmounts[1]}</Typography>
                    <LinearProgress
                        color="warning"
                        variant="determinate"
                        value={getPctBar(round.pollAmounts[1])}
                        valueBuffer={20}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
