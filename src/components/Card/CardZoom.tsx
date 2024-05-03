import {Game} from "../../domain/game";
import React, {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../../App";
import {Round, RoundPrice} from "../../domain/round";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ProgressBar from "./ProgressBar";
import ButtonPink from "../Button/ButtonPink";
import {Bet} from "../../domain/bet";
import Chart from 'chart.js/auto';
import {displayCircle, displayProgressBar} from "../../FunctionGlobal";

type cardType = {
    game: Game,
    setVisible: () => void,
}

const CardZoom = ({ game, setVisible }: cardType) => {

    const { t } = useTranslation();
    const services = useContext(ServiceContext);

    const [round, setRound] = useState<Round | null>(null);
    const [selected, setSelected] = useState(false);
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
    const [choice, setChoice] = useState(0);
    const [amount, setAmount] = useState(0);
    const placeholder = t("Entrer le montant à miser")
    const [displayCheck, setDisplayCheck] = useState(false)

    useEffect( () => {
        (async () => {
            if (round && !displayCheck ) {
                await displayCircle(round.pollAmounts, round, game)
                setDisplayCheck(true)
            }
        })()
    },[displayCheck, round])

    useEffect(() => {
       fetch().catch(console.log).then();
    }, []);

    async function fetch() {
        try {
            const currRound: Round = await services.bet.getCurrentRound(game);

            console.log("ICI ===", currRound)
            if (currRound) {
                setRound(currRound);
            } else {
                //A voir pour la gestion du cas où aucune donnée de tour n'est disponible
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du tour actuel :", error);
        }
    }

    const myBet = async () => {
        if (choice === null || amount === 0)
            return;

        placeBet(choice).catch(console.log).then()
    }

    async function placeBet(choice: number): Promise<Bet | undefined>  {
        if (round === null || amount === 0) return;

        return services.bet.bet(amount, choice, game);
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
            game && game.choiceDescriptions.map((choice, index) => (
                displayButton(choice, () => {
                    setChoice(index);
                    setSelected(true);
                    setSelectedChoiceIndex(index);
                }, {
                    marginTop: 10,
                    marginBottom: 10,
                    marginRight: state ? 10 : 0,
                    marginLeft: state ? 10 : 0,
                    backgroundColor: selectedChoiceIndex === index ? "var(--pinkBlack)" : "",
                    border: selectedChoiceIndex === index ? "2px solid var(--white)" : "",
                })
            ))
        )
    }


    if (!game && !round) return null;

    return (
        <div className={"containerCard"} style={{ minWidth: "50%"}}>
            <div className={"containerCardTitle"} style={{textAlign: "center"}} >
                {game.name}
            </div>
            <div className={"containerProgressBar"}>
                {game && game.choiceDescriptions.length === 2 &&
                    <div className={"zoomProgressBarFill"}>
                        {round && round.pollAmounts.map((item, index) => (
                            <div key={index} className={"zoomProgressBarFill"}>
                                {displayProgressBar(index, item, round, round.pollAmounts)}
                            </div>
                        ))}
                    </div>}
                {game && game.choiceDescriptions.length > 2 &&
                    <div className={"zoomProgressBarFill"} style={{alignItems: "center"}}>
                        {<div id="chartContainer" style={{ marginBottom: 24}}/>}
                    </div>}
                {game && game.choiceDescriptions.length === 2 &&
                    <div className={"containerProgressBarButton"}>
                        {displayButtonChoice(false)}
                    </div>}
            </div>
            {game && game.choiceDescriptions.length > 2 &&
                <div className={"containerButtonRow"}>
                    {displayButtonChoice(true)}
                </div>}
            { round instanceof RoundPrice ?
                <div className={"containerZoomInfo"}>
                    {displayInfo("Locked:", round.priceStart)}
                    {displayInfo("Actual:", round.priceEnd)}
                </div>
                : <div/>}
                <input
                    className={"CardEnterAmount"}
                    type="number"
                    placeholder={placeholder}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    min={0}
                />
            <div className={"zoomNote"}>
                    * {t("1 ALPH sera bloqué jusqu'à ce que vous le réclamiez")}
                </div>
            <div className={"containerCardZoomButton"}>
                {!selected && displayButton("Valider", () => {}, {backgroundColor: "var(--DisabledButton)", borderColor: "var(--DisabledButton)"})}
                {selected && displayButton("Valider", myBet, {})}
                {displayButton("Fermer", setVisible, {})}
            </div>
        </div>
    )
}

export default CardZoom;
