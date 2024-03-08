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
                <Typography variant="h6" noWrap component="div">
                    ALPH.BET
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
