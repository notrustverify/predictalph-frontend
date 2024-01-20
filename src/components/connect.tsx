import {AlephiumConnectButton, useWallet} from "@alephium/web3-react";
import * as React from "react";
import {useContext, useEffect} from "react";
import {SignerProvider} from "@alephium/web3";
import {ServiceContext} from "../App";


interface ConnectButtonProp {
    onConnect: (signer: SignerProvider) => void;
}
export function ConnectButton({onConnect}: ConnectButtonProp) {
    const { account, signer } = useWallet();
    const services = useContext(ServiceContext);

    if (signer !== undefined) {
        onConnect(signer as unknown as SignerProvider);
    }

    return <AlephiumConnectButton />
}
