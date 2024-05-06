import {AlephiumConnectButton, useWallet} from "@alephium/web3-react";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {SignerProvider} from "@alephium/web3";
import {ServiceContext} from "../../App";
import {useTranslation} from "react-i18next";


interface ConnectButtonProp {
    onConnect: (signer: SignerProvider) => void;
}


export function ConnectButton({onConnect}: ConnectButtonProp) {

    const { t } = useTranslation();
    const { account, signer } = useWallet();
    const [hovered, setHovered] = useState(false);
    const services = useContext(ServiceContext);

    useEffect(() => {

    }, [services]);


    if (signer !== undefined) {
        onConnect(signer as unknown as SignerProvider);
    }

    const displayButton = (state: () => void, address: boolean ) => {
        const trimmedAddress = account?.address ? `${account.address.substring(0, 5)}...${account.address.substring(account.address.length - 5)}` : '';

        return (
            <button
                className={"ButtonConnect"}
                style={{
                    background: hovered ? 'var(--PrimaryGrey)' : 'linear-gradient(to right, var(--pink), var(--pinkDark))',
                    border: hovered ? '1px solid var(--pink)' : '1px solid var(--PrimaryColor)',
                    color: hovered ? 'var(--pink)' : 'var(--white)',
                }}
                onClick={state}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {address ? trimmedAddress : t("Connecter le portefeuille")}
            </button>
        )
    }

    return (
        <AlephiumConnectButton.Custom>
            {({ isConnected, disconnect, show, account }) => {
                return isConnected ? (
                    disconnect && displayButton(disconnect, true)
                ) : (
                    show && displayButton(show, false)
                );
            }}
        </AlephiumConnectButton.Custom>
    );
}
