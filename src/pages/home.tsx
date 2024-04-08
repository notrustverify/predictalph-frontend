import * as React from "react";
import {useContext} from "react";
import {ServiceContext} from "../App";
import {Box, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import {OverviewCard} from "../components/overviewCard";

export function Home() {

    const services = useContext(ServiceContext);

    return (
        <Box>
            <Box sx={{textAlign: 'center', width: '100%'}}>
                <Typography variant="h3">ALPH.BET, decentralized betting system</Typography>

            </Box>
            <Box sx={{margin: '20px'}}/>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                {services.bet.getGames().map((game, index) => (
                    <Grid item md={4} xs={12}>
                        <OverviewCard key={game.id} game={game}/>
                    </Grid>
                ))}

            </Grid>
        </Box>
    );
}
