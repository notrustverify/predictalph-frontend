import {Game} from "../../domain/game";
import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../../App";
import {Round} from "../../domain/round";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ProgressBar from "./ProgressBar";
import ButtonClassic from "../Button/ButtonClassic";
import ButtonPink from "../Button/ButtonPink";

type cardType = {
    state: Game,
    setGame: (value: Game) => void,
}

const CardZoom = ({ state, setGame }: cardType) => {

    const { t } = useTranslation();
    const services = useContext(ServiceContext);
    const [round, setRound] = useState(null);
    const [choice, setChoice] = useState(null);
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();


    useEffect(() => {
        console.log("GAME", state);
    }, [services]);


    return (
        <div className={"containerCard"}>
            <div className={"containerCardTitle"}>
                {t("Will ALPH price be higher than the locked price ?")}
            </div>
            <div className={"containerProgressBar"}>
                <div className={"containerProgressBarFill"}>
                    <ProgressBar color={'linear-gradient(to right, #005217, #00B833)'} />
                    <ProgressBar color={"linear-gradient(to right, #631212, #C92424)"}/>
                </div>
                <div className={"containerProgressBarButton"}>
                    <ButtonClassic
                        children={"top"}
                        containerStyle={{
                            minWidth: 0,
                            borderRadius: 20,
                            padding: "10px",
                            border: "1px solid var(--BorderColor)",
                        }}
                    />
                    <ButtonClassic children={"up"}/>
                </div>
            </div>
        </div>
    )
}

export default CardZoom;
