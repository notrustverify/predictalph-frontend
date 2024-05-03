import {AlephiumConnectButton, useWallet} from "@alephium/web3-react";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {SignerProvider} from "@alephium/web3";
import {ServiceContext} from "../App";
import {useTranslation} from "react-i18next";


interface ConnectButtonProp {
    onConnect: (signer: SignerProvider) => void;
}

export function ConnectButton({onConnect}: ConnectButtonProp) {

    const { t } = useTranslation();
    const { account, signer } = useWallet();
    const [hovered, setHovered] = useState(false);

    if (signer !== undefined) {
        onConnect(signer as unknown as SignerProvider);
    }

    const displayButton = (state: () => void, text: string) => {
        return (
            <button
                className={"ButtonConnect"}
                style={{
                    backgroundColor: hovered ? 'var(--PrimaryGrey)' : 'var(--pink)',
                    border: hovered ? '1px solid var(--pink)' : '1px solid var(--pink)',
                    color: hovered ? 'var(--pink)' : 'var(--white)',
                }}
                onClick={state}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {t(text)}
            </button>
        )
    }

    return (
        <AlephiumConnectButton.Custom>
            {({ isConnected, disconnect, show, account }) => {
                return isConnected ? (
                    disconnect && displayButton(disconnect, "Déconnecter le portefeuille")
                ) : (
                    show && displayButton(show, "Connecter le portefeuille")
                );
            }}
        </AlephiumConnectButton.Custom>
    );
}
