import {Game} from "../../domain/game";
import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../../App";
import {Round, RoundPrice} from "../../domain/round";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ProgressBar from "./ProgressBar";
import ButtonClassic from "../Button/ButtonClassic";
import ButtonPink from "../Button/ButtonPink";
import {PollComponent} from "../poll";
import {Bet} from "../../domain/bet";
import Typography from "@mui/material/Typography";

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
        console.log("round", round);
    }, [services]);

    useEffect(() => {
        const interval = setInterval(fetch, 1000);
        return () => clearInterval(interval);
    }, []);

    async function fetch() {
        const currRound: Round = await services.bet.getCurrentRound(game);
        setRound(currRound);
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

    const displayDate = (round: any) => {
        if (!(round instanceof RoundPrice)) {
            return <div>{t("Fin du pari dans ")}{(new Date(round.end)).toLocaleString(undefined,{dateStyle: "medium", timeStyle: "short"})}</div>;
        }
        const now = Date.now();
        if (round.end > now) {
            const duration = Math.ceil((round.end - now) / 1000);
            const hours = Math.floor(duration / 3600); // Hours are in 24-hour format
            const minutes = Math.floor((duration % 3600) / 60);
            const secondsRemaining = duration % 60;

            return <div>{t("Tour terminé dans ")}{hours}h {minutes}m {secondsRemaining}s </div>;
        } else {
            return <div>{t("Fin du pari dans ")}{(new Date(round.end)).toLocaleString(undefined,{dateStyle: "medium", timeStyle: "short"})}</div>;
        }
    }

    if (!game) return null;



    return (
        <div className={"containerCard"}>
            <div className={"containerCardTitle"}>
                {t("Will ALPH price be higher than the locked price ?")}
            </div>
            <div className={"containerProgressBar"}>
                {round &&
                    <div className={"containerProgressBarFill"}>
                        {displayProgressBar('linear-gradient(to right, #005217, #00B833)', round.pollAmounts[0])}
                        {displayProgressBar('linear-gradient(to right, #631212, #C92424)', round.pollAmounts[1])}
                    </div>}
            </div>
            <div className={"containerCheck"}>
                <div className={"containerCheckLeft"}>
                    <div className={"containerCheckText"}>
                        {round === null ? <div/> : displayDate(round)}
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
