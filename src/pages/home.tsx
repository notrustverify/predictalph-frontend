import {useContext, useState} from "react";
import {ServiceContext} from "../App";
import {useNavigate} from "react-router-dom";
import {SignerProvider} from "@alephium/web3";
import Divider from "@mui/material/Divider";
import {Avatar, Box, Grid, Link, List, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {ConnectButton} from "../components/connect";
import Typography from "@mui/material/Typography";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import {OpenInNew, Share} from "@mui/icons-material";

export function Home() {

    const [already, setAlready] = useState(false);
    const services = useContext(ServiceContext);
    const navigate = useNavigate();

    const connect = async (signer: SignerProvider): Promise<void> => {
        if (already) return;

        setAlready(true);
        await services.wallet.connect(signer);
    }

    return (

        <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
        >
            <Grid item md={12}>
                <Typography variant='h5'>ALPH.bet, bet on ALPH price</Typography>
                <Typography>
                    The goal is very simple, connect your wallet and choose a side, Up or Down.
                    <br/><br/>
                    If you choose Up it means at the end of the round, the price of ALPH will be higher than the locked
                    price.
                    <br/><br/>
                    And if you choose Down, you will be considered as a bear and think the price at the end of the
                    counter will be lower than it was.<br/><br/>
                </Typography>

                <Typography variant='h5'>Why 1 ALPH is needed</Typography>
                <Typography>
                    1 ALPH is needed in addition of the bet to create your bet. You will be able to get this ALPH back
                    by clicking on Claiming rewards which will get you all the rewards on the round you bet correctly.
                    <br/><br/>
                </Typography>

                <Typography variant='h5'>How many times I can participate ?</Typography>
                <Typography>
                    You can only bet once per round. You have to wait the new round to be able to play again.
                    <br/><br/>
                </Typography>

                <Typography variant='h5'>What is Price locked</Typography>
                <Typography>
                    It's price set at the beginning of the round. It will be used to compute if it's Up or down side who
                    won at the end of the epoch.
                    <br/><br/>
                </Typography>

                <Typography variant='h5'>What is happening is if I don't claim my rewards ?</Typography>
                <Typography>
                    You have 1 week to claim your rewards, if you wait to long to do, after this period of time anybody
                    can claim them
                    <br/><br/>
                </Typography>
            </Grid>

            <Grid item md={4}>
                <ConnectButton onConnect={connect}/>
            </Grid>

            <Grid item md={6}>
                <List sx={{width: '100%'}}>
                    {services.bet.getGames().map((game, index) => (
                        <>
                            {index > 0 && <Divider/>}

                                <ListItem
                                    sx={{width: "100%"}}
                                    key={game.id}
                                    secondaryAction={
                                        <IconButton onClick={() => navigate(`/bet/${game.id}`)} edge="end"
                                                    aria-label="delete">
                                            <OpenInNew/>
                                        </IconButton>}

                                >
                                    <ListItemAvatar>
                                        <Avatar src={game.img} alt=''/>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={game.name}
                                        secondary={game.description}
                                    />
                                </ListItem>
                        </>
                    ))}
                </List>
            </Grid>

        </Grid>
    );
}
