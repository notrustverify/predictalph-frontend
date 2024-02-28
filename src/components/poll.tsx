import {Round} from "../domain/round";
import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../App";
import {Box, Grid, LinearProgress} from "@mui/material";
import Typography from "@mui/material/Typography";

type PollComponentType = {
    round: Round;
}

export function PollComponent({round}: PollComponentType) {
    const svc = useContext(ServiceContext);
    const pct = 50;

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
            const diff = Math.ceil((round.end - now) / 1000);
            const sec = diff % 60;
            const min = (diff - sec) % 60;
            const hour = (diff - sec - min) % 24;

            return `${hour}h ${min}m ${sec}s`;
        } else {
            return (new Date(round.end)).toLocaleString();
        }
    }

    const computePct = (prev: Round): number | null => {
        if (prev === null)
            return null;
        return 10;
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
                                <Grid item md={12} sx={{textAlign: "center"}}>
                                    <Typography style={{color: round.result === 0 ? 'primary' : 'warning'}}>{round.game.choiceDescriptions[round.result]}</Typography>
                                </Grid>
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
