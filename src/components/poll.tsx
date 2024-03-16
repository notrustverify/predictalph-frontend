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

    const displayDate = (round: Round): any => {
        if (!(round instanceof RoundPrice)) {
            return `Round end at ${(new Date(round.end)).toLocaleString()}`;
        }
        const now = Date.now();
        if (round.end > now) {
            const duration = Math.ceil((round.end - now) / 1000);
            const hours = Math.floor(duration / 3600); // Hours are in 24-hour format
            const minutes = Math.floor((duration % 3600) / 60);
            const secondsRemaining = duration % 60;

            return <><Typography sx={{display: 'inline'}}>Round end in </Typography><Typography sx={{display: 'inline'}} fontWeight={600}>{hours}h {minutes}m {secondsRemaining}s</Typography></>;
        } else {
            return `Round end at ${(new Date(round.end)).toLocaleString()}`;
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
                        <Grid item md={12} sx={{textAlign: "center"}}>{displayDate(round)}</Grid>

                        { round instanceof RoundPrice
                            ? <>
                                <Grid item md={4} sx={{textAlign: "center"}}>Actual: ${round.priceEnd}</Grid>
                                <Grid item md={4} sx={{textAlign: "center"}}>Locked: ${round.priceStart} </Grid>
                                <Grid item md={4} sx={{textAlign: "center"}}>
                                    <Typography color={computePct(round) > 0 ? 'secondary.main': 'warning.main'}>
                                        ({computePct(round).toFixed(2)} %)
                                    </Typography>

                                </Grid>
                            </>
                            : <Box></Box>
                        }
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
