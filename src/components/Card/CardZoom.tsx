import {Game} from "../../domain/game";
import React, {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../../App";
import {Round, RoundPrice} from "../../domain/round";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ProgressBar from "./ProgressBar";
import ButtonPink from "../Button/ButtonPink";
import {Bet} from "../../domain/bet";

type cardType = {
    game: Game,
    setGame: (value: Game) => void,
    setVisible: () => void,
}

const CardZoom = ({ game, setGame, setVisible }: cardType) => {

    const { t } = useTranslation();
    const services = useContext(ServiceContext);

    const [round, setRound] = useState<Round | null>(null);
    const [selected, setSelected] = useState(false);
    const [choice, setChoice] = useState(0);
    const [amount, setAmount] = useState(0);
    const placeholder = t("Entrer le montant à miser")

    useEffect(() => {
        const interval = setInterval(fetch, 1000);
        return () => clearInterval(interval);
    }, []);

    async function fetch() {
        const currRound: Round = await services.bet.getCurrentRound(game);
        setRound(currRound);
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


    const displayProgressBar = (color: string, roundAmount: number) => {

        if (!round) return null;
        const totalAmount = round.pollAmounts.reduce((acc, amount) => acc + amount, 0);
        const percentage = totalAmount === 0 ? 0 : (roundAmount / totalAmount) * 100;


        return (
            <ProgressBar
                color={color}
                width={percentage === 0 ? 50 : percentage}
                number={percentage}
            />
        )
    }

    if (!game && !round) return null;

    return (
        <div className={"containerCard"} style={{ minWidth: "50%"}}>
            <div className={"containerCardTitle"} style={{textAlign: "center"}} >
                {game.name}
            </div>
            <div className={"containerProgressBar"}>
                <div className={"zoomProgressBarFill"}>
                    {round &&
                        <div className={"containerProgressBarFill"}>
                            {displayProgressBar('linear-gradient(to right, #005217, #00B833)', round.pollAmounts[0])}
                            {displayProgressBar('linear-gradient(to right, #631212, #C92424)', round.pollAmounts[1])}
                        </div>}
                </div>
                <div className={"containerProgressBarButton"}>
                    {game && game.choiceDescriptions.map((choice, index) => (
                        displayButton(choice, () => {
                            setChoice(index);
                            setSelected(true);
                        }, { marginTop: 10, marginBottom: 10 })
                    ))}
                </div>
            </div>
            { round instanceof RoundPrice ?
                <div className={"containerZoomInfo"}>
                    {displayInfo("Locked:", round.priceStart)}
                    {displayInfo("Actual:", round.priceEnd)}
                </div>
                : <div/>}
            {selected &&
                <input
                    className={"CardEnterAmount"}
                    type="number"
                    placeholder={placeholder}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    min={0}
                />}
            {selected && <div className={"zoomNote"}>
                    * {t("1 ALPH sera bloqué jusqu'à ce que vous le réclamiez")}
                </div>}
            <div className={"containerCardZoomButton"}>
                {displayButton("Valider", myBet, {})}
                {displayButton("Fermer", setVisible, {})}
            </div>
        </div>
    )
}

export default CardZoom;
