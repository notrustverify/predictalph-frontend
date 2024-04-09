import {Round, RoundPrice} from "../domain/round";
import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../App";
import {Box, Grid, LinearProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
import {HorizontalBar} from "./horizontalBar";

type PollComponentType = {
    round: Round;
}

export function PollComponent({round}: PollComponentType) {



    const displayDate = (round: Round): any => {
        if (!(round instanceof RoundPrice)) {
            //return `Bet end at ${(new Date(round.end)).toLocaleString()}`;
            return <><Typography sx={{display: 'inline'}}>Bet end on </Typography><Typography sx={{display: 'inline'}} fontWeight={600}>{(new Date(round.end)).toLocaleString(undefined,{dateStyle: "medium", timeStyle: "short"})}</Typography></>;
        }
        const now = Date.now();
        if (round.end > now) {
            const duration = Math.ceil((round.end - now) / 1000);
            const hours = Math.floor(duration / 3600); // Hours are in 24-hour format
            const minutes = Math.floor((duration % 3600) / 60);
            const secondsRemaining = duration % 60;

            return <><Typography sx={{display: 'inline'}}>Round end in </Typography><Typography sx={{display: 'inline'}} fontWeight={600}>{hours}h {minutes}m {secondsRemaining}s</Typography></>;
        } else {
            return <><Typography sx={{display: 'inline'}}>Bet end on </Typography><Typography sx={{display: 'inline'}} fontWeight={600}>{(new Date(round.end)).toLocaleString(undefined,{dateStyle: "medium", timeStyle: "short"})}</Typography></>;
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
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid
                    item md={12} xs={12}
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{margin: '0px 10px 0 10px'}}
                >
                    <Grid item><Typography>ALPH {round.pollAmounts[0]}</Typography></Grid>
                    <Grid item><Typography>ALPH {round.pollAmounts[1]}</Typography></Grid>

                </Grid>
                <Grid item sx={{height: '100%', padding: '10px'}} md={12} xs={12}>
                    <HorizontalBar polls={round.pollAmounts} height='20px'/>
                </Grid>
                <Grid
                    item md={12} xs={12}
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    sx={{margin: '0px 10px 0 10px'}}
                >
                        <Grid item md={6} xs={12} sx={{textAlign: "center"}}>{displayDate(round)}</Grid>

                        { round instanceof RoundPrice
                            ? <>
                                <Grid item xs={4} md={2} sx={{textAlign: "center"}}>Actual: <b>${round.priceEnd}</b></Grid>
                                <Grid item xs={4} md={2} sx={{textAlign: "center"}}>Locked: <b>${round.priceStart}</b></Grid>
                                <Grid item xs={4} md={2} sx={{textAlign: "center"}}>
                                    <Typography color={computePct(round) > 0 ? 'secondary.main': 'warning.main'}>
                                        ({computePct(round).toFixed(2)} %)
                                    </Typography>

                                </Grid>
                            </>
                            : <></>
                        }
                    </Grid>
            </Grid>
        </Box>
    );
}
