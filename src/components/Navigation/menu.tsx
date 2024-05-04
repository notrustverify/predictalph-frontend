import React, { useContext, useState } from 'react';
import { ConnectButton } from '../../Assets/Connect/connect';
import { SignerProvider } from '@alephium/web3';
import { ServiceContext } from '../../App';
import ModalHelp from "../Modal/ModalHelp";

const Menu = () => {
    const [already, setAlready] = useState(false);
    const services = useContext(ServiceContext);
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);


    const connect = async (signer: SignerProvider): Promise<void> => {
        if (already) return;

        setAlready(true);
        await services.wallet.connect(signer);
    };

    return (
        <div className={"containerMenu"}>
            <div className={"containerLogo"} >
                {/*ALPH.BET*/}
                <img
                    src={require('./../../Assets/logo.png')}
                    alt="Logo ALPH.BET"
                    className={"logo"}
                />
            </div>
            <div className={"containerRight"}>
                <div
                    className="containerButtonQuestion"
                    onClick={() => setOpen(true)}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        backgroundColor: hovered ? 'var(--pink)' : 'var(--TextColor)',
                    }}
                >
                    <div className="helpIcon">
                        <span>?</span>
                    </div>
                </div>

                <div className={"containerButton"}>
                    <ConnectButton onConnect={connect}/>
                </div>
            </div>
            <ModalHelp open={open} handleClose={() => setOpen(false)} />
        </div>
    );
};

export default Menu;
