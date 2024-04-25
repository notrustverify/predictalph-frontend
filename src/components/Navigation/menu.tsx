import React, { useContext, useState } from 'react';
import { ConnectButton } from '../connect';
import { SignerProvider } from '@alephium/web3';
import { ServiceContext } from '../../App';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Help } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import ModalHelp from "../Modal/modalHelp";

const Menu = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [already, setAlready] = useState(false);
    const [hovered, setHovered] = useState(false);
    const services = useContext(ServiceContext);
    const [open, setOpen] = useState(false);

    const menuStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
    };

    const logoStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 'bold',
        marginLeft: '2%',
        color: hovered ? 'var(--pink)' : 'inherit',
        cursor: hovered ? 'pointer' : 'default'
    };

    const buttonStyle: React.CSSProperties = {
        marginRight: '3%'
    };

    const connect = async (signer: SignerProvider): Promise<void> => {
        if (already) return;

        setAlready(true);
        await services.wallet.connect(signer);
    };

    return (
        <div style={menuStyle}>
            <div style={logoStyle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                ALPH.BET
            </div>
            <div style={{display: "flex", flexDirection: "row", flex: 1, justifyContent: "flex-end", alignItems: "center"}}>
                <IconButton onClick={() => setOpen(true)} ><Help sx={{ fill: 'white' }} /></IconButton>
                <div style={buttonStyle}>
                    <ConnectButton onConnect={connect}/>
                </div>
            </div>
            <ModalHelp open={open} handleClose={() => setOpen(false)} />
        </div>
    );
};

export default Menu;
