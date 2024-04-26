import React, { useContext, useState } from 'react';
import { ConnectButton } from '../connect';
import { SignerProvider } from '@alephium/web3';
import { ServiceContext } from '../../App';
import { useLocation, useNavigate } from 'react-router-dom';
import { Help } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import ModalHelp from "../Modal/modalHelp";

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [already, setAlready] = useState(false);
    const services = useContext(ServiceContext);
    const [open, setOpen] = useState(false);


    const connect = async (signer: SignerProvider): Promise<void> => {
        if (already) return;

        setAlready(true);
        await services.wallet.connect(signer);
    };

    return (
        <div className={"containerMenu"}>
            <div className={"containerLogo"} >
                ALPH.BET
            </div>
            <div className={"containerRight"}>
                <IconButton onClick={() => setOpen(true)} ><Help sx={{ fill: 'white' }} /></IconButton>
                <div className={"containerButton"}>
                    <ConnectButton onConnect={connect}/>
                </div>
            </div>
            <ModalHelp open={open} handleClose={() => setOpen(false)} />
        </div>
    );
};

export default Menu;
