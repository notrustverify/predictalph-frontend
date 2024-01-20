// Sidebar.js
import * as React from 'react';
import {useContext, useState} from 'react';
import {styled, Theme} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {DrawerHeader} from "./drawerHeader";
import {
    Box,
} from "@mui/material";
import {Asset} from "../domain/asset";
import {SignerProvider} from "@alephium/web3";
import {ServiceContext} from "../App";
import {ConnectButton} from "./connect";

export const drawerWidth = 240;

const openedMixin = (theme: Theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `0`,
    [theme.breakpoints.up('sm')]: {
        width: `0`,
    },
});

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    // @ts-ignore
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

type AlphBetSidebarProp = {
    open: boolean,
    handleDrawerClose: () => void,
    theme: Theme
}

export const AlphBetSidebar = ({open, handleDrawerClose, theme}: AlphBetSidebarProp) => {

    const [seed, setSeed] = useState(1);
    const [already, setAlready] = useState(false);
    const [assets, setAssets] = useState(new Array<Asset>());
    const services = useContext(ServiceContext);

    const reload = () => setSeed(Math.random());

    const connect = async (signer: SignerProvider): Promise<void> => {
        if (already) return;

        setAlready(true);
        const account = await services.wallet.connect(signer);
    }

    return (
        <Drawer variant="permanent" open={open} key={seed}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                </IconButton>
            </DrawerHeader>
            <Divider/>
            <Box sx={{margin: "10px",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'center'}}>


                <Box sx={{marginTop: "10px"}}/>
                    <ConnectButton onConnect={connect}/>

            </Box>
        </Drawer>
    );
};
