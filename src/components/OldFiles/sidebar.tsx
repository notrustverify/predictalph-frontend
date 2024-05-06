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
    Avatar,
    Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText,
} from "@mui/material";
import {SignerProvider} from "@alephium/web3";
import {ServiceContext} from "../../App";
import {ConnectButton} from "../Connect/connect";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";

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

    const [already, setAlready] = useState(false);
    const services = useContext(ServiceContext);
    const navigate = useNavigate();

    const connect = async (signer: SignerProvider): Promise<void> => {
        if (already) return;

        setAlready(true);
        await services.wallet.connect(signer);
    }

    return (
        <Drawer variant="permanent" open={open}>
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

                <List>
                {services.bet.getGames().map((game, index) => (
                    <>
                    {index > 0 && <Divider/>}

                    <ListItem sx={{width: "100%"}} key={game.id}>
                        <ListItemAvatar>
                            <Avatar src={game.img} alt=''/>
                        </ListItemAvatar>
                        <ListItemButton onClick={() => navigate(`/bet/${game.id}`)}>
                            <ListItemText>
                                <Typography variant="body2">{game.name}</Typography>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    </>
                ))}
                </List>

            </Box>
        </Drawer>
    );
};
