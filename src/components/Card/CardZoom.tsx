import {Game} from "../../domain/game";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {ServiceContext} from "../../App";
import {Round, RoundPrice} from "../../domain/round";
import {useTranslation} from "react-i18next";
import ButtonPink from "../Button/ButtonPink";
import {Bet} from "../../domain/bet";
import {backgroundColorArray, displayCircle, displayProgressBar} from "../../FunctionGlobal";
import TradingViewWidget from "../OldFiles/tradingview";
import { useTxStatus } from '@alephium/web3-react';
import {NodeProvider} from "@alephium/web3";
import History from "./History";

type cardType = {
    game: Game,
    setVisible: () => void,
    round: Round,
    setValidated: (state: boolean) => void
    language: string
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

const CardZoom = ({ game, setVisible, round, setValidated, language }: cardType) => {

    const { t } = useTranslation();
    const services = useContext(ServiceContext);

    const [selected, setSelected] = useState(false);
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
    const [choice, setChoice] = useState(0);
    const [amount, setAmount] = useState(0);
    const placeholder = t("Entrer le montant à miser")
    // const nodeUrl = 'https://lb-fullnode-alephium.notrustverify.ch/docs/'
    const nodeUrl = 'https://predictalph-api.notrustverify.ch/'
    const nodeProvider = new NodeProvider(nodeUrl)

    const [step, setStep] = useState(0)
    const [bets, setBets] = useState<Bet[]>([]);

    // console.log("services", services)
    // console.log("nodeProvider", nodeProvider)

    // const { txStatus } = useTxStatus(txId)
    // const confirmed = useMemo(() => {
    //     return txStatus?.type === 'Confirmed'
    // }, [txStatus])

    useEffect( () => {
        if (game && round) {
            displayCircle(round.pollAmounts, round, game)
        }
    },[])

    useEffect(() => {
        setBets([])
        fetch();
    }, []);

    async function fetch(): Promise<void> {
        const rawBets = await services.bet.getPlayerBets(game, true);
        setBets(rawBets.filter(notEmpty));
    }


    const myBet = async () => {
        if (choice === null || amount === 0)
            return;
        try {
            const result = await placeBet(choice);
            console.log('Résultat:', result);
            // if (txId) {
            //     const txStatus = await nodeProvider.transactions.getTransactionsStatus({ txId });
            //     console.log('Transaction Status:', txStatus);
            // } else {
            //     console.log('L\'ID de transaction est introuvable.');
            // }
            // setValidated(true);
        } catch (error) {
            console.log(error);
        }
    }

    async function placeBet(choice: number): Promise<Bet | undefined> {
        if (round === null || amount === 0) return;

        return new Promise((resolve, reject) => {
            services.bet.bet(amount, choice, game)
                .then((result: Bet) => {
                    resolve(result); // Résout la promesse avec le résultat du pari
                })
                .catch((error: any) => {
                    reject(error); // Rejette la promesse en cas d'erreur
                });
        });
    }


    const displayButton = (text: string, onClick: () => void, style: any ) => {
        return (
            <ButtonPink
                children={text}
                onClick={onClick}
                containerStyle={style}
            />
        )
    }

    const displayInfo = (text: string, price: number) => {
        const formattedPrice = price.toLocaleString('en-US');
        return (
            <div className={"ZoomInfoText"}>
                {text} {formattedPrice}$
            </div>
        );
    }

    const displayButtonChoice = (state: boolean) => {
        return (
            game && game.choiceDescriptions.map((choice, index) => {
                const buttonColor = state ? backgroundColorArray[index] : "";
                const borderColor = selectedChoiceIndex === index ? "2px solid var(--white)" : "2px solid linear-gradient(to right, var(--pink), var(--pinkDark))";

                return displayButton(choice, () => {
                    setChoice(index);
                    setSelected(true);
                    setSelectedChoiceIndex(index);
                }, {
                    marginTop: 10,
                    marginBottom: 10,
                    marginRight: state ? 10 : 0,
                    marginLeft: state ? 10 : 0,
                    backgroundColor:  buttonColor,
                    backgroundImage: state ? "none" : "linear-gradient(to right, var(--pink), var(--pinkDark))",
                    border: borderColor
                });
            })
        );
    };



    const getDisplayBet = () => {

        return (
            <div>
                <div className={"containerCardTitle"} style={{textAlign: "center"}} >
                    {game.name && Array.isArray(game.name) ? (
                        game.name.map(nameObj => nameObj[language])
                    ) : (
                        game.name
                    )}
                </div>
                <div className={"containerProgressBar"}>
                    {game && ((game.type === "CHOICE") || (game.type === "PRICE")) &&
                        <div className={"zoomProgressBarFill"}>
                            {round && round.pollAmounts.map((item, index) => (
                                <div key={index} className={"zoomProgressBarFill"}>
                                    {displayProgressBar(index, item, round, round.pollAmounts)}
                                </div>
                            ))}
                        </div>}
                    {game && game.type === "MULTIPLE_CHOICE" &&
                        <div className={"zoomProgressBarFill"} style={{alignItems: "center"}}>
                            {<div id="chartContainer" style={{ marginBottom: 24}}/>}
                        </div>}
                    {game && ((game.type === "CHOICE") || (game.type === "PRICE")) &&
                        <div className={"containerProgressBarButton"}>
                            {displayButtonChoice(false)}
                        </div>}
                </div>
                {game && game.type === "MULTIPLE_CHOICE" &&
                    <div className={"containerButtonRow"}>
                        {displayButtonChoice(true)}
                    </div>}
                { round instanceof RoundPrice && game && ((game.type === "PRICE")) ?
                    <div className={"containerZoomInfo"}>
                        {displayInfo("Locked:", round.priceStart)}
                        {displayInfo("Actual:", round.priceEnd)}
                    </div>
                    : <div/>}
                <div className={"containerCardInput"}>
                    <input
                        className={"CardEnterAmount"}
                        type="number"
                        placeholder={placeholder}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                        min={0}
                    />
                </div>
                {/*{game &&*/}
                {/*<div style={{height: "95%", marginTop: 25}}>*/}
                {/*    <TradingViewWidget symbol={game.symbol}/>*/}
                {/*</div>}*/}
                <div className={"zoomNote"}>
                    * {t("1 ALPH sera bloqué jusqu'à ce que vous le réclamiez")}
                </div>
                <div className={"containerCardZoomButton"}>
                    {!selected && displayButton("Valider", () => {}, {backgroundColor: "var(--DisabledButton)", backgroundImage: "none", borderColor: "var(--DisabledButton)"})}
                    {selected && displayButton("Valider", myBet, {})}
                    {displayButton("Fermer", setVisible, {})}
                </div>
                {bets && bets && bets.length > 0 && <div style={{padding: 15, borderTopWidth: 1, borderColor: "orange", display: "flex", flex: 1, justifyContent: "center"}}>
                    {displayButton("Historique", () => {setStep(1)}, {})}
                </div>}
            </div>
        )
    }

    const getDisplayHistoric = () => {
        return (
            <div>

            </div>
        )
    }

    if (!game && !round) return null;

    return (
        <div className={"containerCard"} style={{ minWidth: "50%"}}>
            {step === 0 && getDisplayBet()}
            {/*{step === 1 && getDisplayHistoric()}*/}
            {step === 1 && bets && bets.length > 0 &&
                <History
                    bets={bets}
                    game={game}
                    setStep={setStep}
                />}
        </div>
    )
}

export default CardZoom;
