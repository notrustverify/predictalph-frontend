import {Game} from "../../domain/game";
import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../../App";
import {Round} from "../../domain/round";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ProgressBar from "./ProgressBar";
import ButtonClassic from "../Button/ButtonClassic";
import ButtonPink from "../Button/ButtonPink";
import {PollComponent} from "../poll";
import {Bet} from "../../domain/bet";

type cardType = {
    game: Game,
    cardModal: boolean,
    setCardModal: (value: boolean) => void,
    setGame: (value: Game) => void,
}

const Card = ({ game, cardModal, setCardModal, setGame }: cardType) => {

    const { t } = useTranslation();
    const services = useContext(ServiceContext);
    const [choice, setChoice] = useState(null);
    const [amount, setAmount] = useState(0);
    const [round, setRound] = useState<Round | null>(null);
    const [seed, setSeed] = useState(0);
    const navigate = useNavigate();


    useEffect(() => {
        // console.log("round", round);
    }, [services]);

    async function fetch() {
        setSeed(Math.random);
        const currRound: Round = await services.bet.getCurrentRound(game);
        setRound(currRound);
        const currBet: Bet | null = await services.bet.getCurrentBet(game);

        if (currBet === null) return;
        // setBet(currBet);
    }


    const displayProgressBar = (color: string) => {
        return (
            <ProgressBar
                color={color}
                width={50}
                number={0}
            />
        )
    }


    return (
        <div className={"containerCard"}>
            <div className={"containerCardTitle"}>
                {t("Will ALPH price be higher than the locked price ?")}
            </div>
            <div className={"containerProgressBar"}>
                <div className={"containerProgressBarFill"}>
                    {displayProgressBar('linear-gradient(to right, #005217, #00B833)')}
                    {displayProgressBar('linear-gradient(to right, #631212, #C92424)')}
                </div>
            </div>
            <div className={"containerCheck"}>
                <div className={"containerCheckLeft"}>
                    <div className={"containerCheckText"}>
                        {"End: 03h 15min 12s"}
                        {round === null ? <div/> : <PollComponent round={round} key={seed}/>}
                    </div>
                </div>
                <div className={"containerCheckRight"}>
                    <ButtonPink
                        children={"Voir Bet"}
                        onClick={() => {
                            setCardModal(true)
                            setGame(game)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Card;
