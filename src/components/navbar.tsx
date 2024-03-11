import * as React from 'react';
import {styled, Theme} from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {drawerWidth} from "./sidebar";
import {ArrowBack, PreviewOutlined} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {ServiceContext} from "../App";
import {SignerProvider} from "@alephium/web3";
import {ConnectButton} from "./connect";


type AppBarProp = {
    theme: Theme,
    open: boolean
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}: AppBarProp) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export function AlphBetNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [already, setAlready] = useState(false);
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

                <ConnectButton onConnect={connect}/>
            </Toolbar>
        </AppBar>
    )
}
