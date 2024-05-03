import * as React from 'react';
import {styled, Theme} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {ArrowBack, Help, PreviewOutlined} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {ServiceContext} from "../App";
import {SignerProvider} from "@alephium/web3";
import {ConnectButton} from "../Assets/Connect/connect";
import {ModalHelp} from "./Modal/ModalHelp";
import AppBar from "@mui/material/AppBar";


type AppBarProp = {
    theme: Theme,
    open: boolean
}

export function AlphBetNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [already, setAlready] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const services = useContext(ServiceContext);

    const connect = async (signer: SignerProvider): Promise<void> => {
        if (already) return;

        setAlready(true);
        await services.wallet.connect(signer);
    }
    return (
        // @ts-ignore
        <AppBar position="fixed">
            <Toolbar>
                {location.key !== 'default' &&
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBack/>
                    </IconButton>
                }
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    ALPH.BET
                </Typography>
                <IconButton onClick={() => setOpen(true)} ><Help sx={{fill: 'white'}}/></IconButton>
                <ModalHelp open={open} handleClose={() => setOpen(false)}/>
                <ConnectButton onConnect={connect}/>
            </Toolbar>
        </AppBar>
    )
}
