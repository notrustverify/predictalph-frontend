import {Game} from "../../domain/game";
import React, {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../../App";
import {Round} from "../../domain/round";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ProgressBar from "./ProgressBar";
import ButtonPink from "../Button/ButtonPink";

type cardType = {
    state: Game,
    setGame: (value: Game) => void,
    setVisible: () => void,
}

const CardZoom = ({ state, setGame, setVisible }: cardType) => {

    const { t } = useTranslation();
    const services = useContext(ServiceContext);
    const [round, setRound] = useState(null);
    const [selected, setSelected] = useState(false);
    const [choice, setChoice] = useState(0);
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();
    const [firstVote, setFirstVote] = useState(50);
    const [secondVote, setSecondVote] = useState(50);


    useEffect(() => {
        console.log("GAME", state);
    }, [services]);

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
        return (
            <div className={"ZoomInfoText"}>
                {text} {price}$
            </div>
        )
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

    return (
        <div className={"containerCard"} style={{ minWidth: "50%"}}>
            <div className={"containerCardTitle"} style={{textAlign: "center"}} >
                {t("Will ALPH price be higher than the locked price ?")}
            </div>
            <div className={"containerProgressBar"}>
                <div className={"zoomProgressBarFill"}>
                    {displayProgressBar('linear-gradient(to right, #005217, #00B833)', setFirstVote !== null ? firstVote : 0)}
                    {displayProgressBar('linear-gradient(to right, #631212, #C92424)', setSecondVote !== null ? secondVote : 0)}
                </div>
                <div className={"containerProgressBarButton"}>
                    {displayButton("top", () => {
                        setChoice(0)
                        setSelected(true)
                    }, {marginTop: 10, marginBottom: 10})}
                    {displayButton("bot", () => {
                        setChoice(1)
                        setSelected(true)
                    }, {marginTop: 10, marginBottom: 10})}
                </div>
            </div>
            <div className={"containerZoomInfo"}>
                {displayInfo("Locked:", 0)}
                {displayInfo("Actual:", 0)}
            </div>
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
