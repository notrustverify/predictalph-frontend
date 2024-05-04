import * as React from "react";
import {useContext} from "react";
import {ServiceContext} from "../App";
import {Box, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import {OverviewCard} from "../components/OldFiles/overviewCard";
import {useTranslation} from "react-i18next";

export function Home() {

    const { t } = useTranslation();
    const services = useContext(ServiceContext);

    return (
        <Box>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "30px"}} >
                {t("Bienvenue sur ALPH.BET, les paris décentralisé")}
            </div>
            <Box sx={{margin: '20px', backgroundColor: "orange"}}/>
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
