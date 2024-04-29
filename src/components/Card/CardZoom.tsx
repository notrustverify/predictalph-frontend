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

    const [firstVote, setFirstVote] = useState(50);
    const [secondVote, setSecondVote] = useState(50);
    

    useEffect(() => {
        const interval = setInterval(fetch, 1000);
        return () => clearInterval(interval);
    }, []);

    async function fetch() {
        const currRound: Round = await services.bet.getCurrentRound(game);
        setRound(currRound);
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


    const displayProgressBar = (color: string, width: number) => {
        return (
            <ProgressBar
                color={color}
                width={width}
                number={width}
            />
        )
    }

    if (!game) return null;

    return (
        <div className={"containerCard"} style={{ minWidth: "50%"}}>
            <div className={"containerCardTitle"} style={{textAlign: "center"}} >
                {game.name}
            </div>
            <div className={"containerProgressBar"}>
                <div className={"zoomProgressBarFill"}>
                    {displayProgressBar('linear-gradient(to right, #005217, #00B833)', setFirstVote !== null ? firstVote : 0)}
                    {displayProgressBar('linear-gradient(to right, #631212, #C92424)', setSecondVote !== null ? secondVote : 0)}
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
                    placeholder={"Enter amount"}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    min={0}
                />}
            {selected && <div className={"zoomNote"}>
                    * {t("1 ALPH sera bloqué jusqu'à ce que vous le réclamiez")}
                </div>}
            <div className={"containerCardZoomButton"}>
                {displayButton("Valider", () => {
                    // navigate("/bet", {state: {game: state, choice: choice, amount: amount}})
                    if (choice === 0) {
                        setFirstVote(firstVote + amount)
                    } else {
                        setSecondVote(secondVote + amount)
                    }
                }, {})}
                {displayButton("Fermer", setVisible, {})}
            </div>
        </div>
    )
}

export default CardZoom;
