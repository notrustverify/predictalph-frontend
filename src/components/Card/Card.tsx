import {Game} from "../../domain/game";
import React, {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../../App";
import {Round, RoundPrice} from "../../domain/round";
import {useTranslation} from "react-i18next";
import ProgressBar from "./ProgressBar";
import ButtonPink from "../Button/ButtonPink";
import {displayCircle, displayProgressBar} from "../../FunctionGlobal";

type cardType = {
    game: Game,
    setCardModal: (value: boolean) => void,
    setGame: (value: Game) => void
    setThisRound: (value: Round) => void
}

const Card = ({ game, setCardModal, setGame, setThisRound }: cardType) => {

    const services = useContext(ServiceContext);
    const [round, setRound] = useState<Round | null>(null);
    const { t } = useTranslation();

    useEffect( () => {
        if (game) {
            fetch().then();
        }
    }, [game])

    async function fetch() {
        try {
            const currRound: Round = await services.bet.getCurrentRound(game);
            if (currRound) {
                setRound(currRound);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du tour actuel :", error);
        }
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

    if (!game && !round ) return null;

    return (
        <div className={"containerCard"}>
            <div className={"containerCardTitle"}>
                {game.name}
            </div>
            {game && ((game.type === "CHOICE") || (game.type === "PRICE")) &&
                <div className={"containerProgressBar"} style={{flexDirection: "column"}}>
                    {round && round.pollAmounts.map((item, index) => (
                        <div key={index} className={"containerProgressBarFill"}>
                            {displayProgressBar(index, item, round, round.pollAmounts)}
                        </div>
                    ))}
                </div>}
            <div className={"containerCheck"}>
                <div className={"containerCheckLeft"}>
                    <div className={"containerCheckText"}>
                        {round === null ? <div/> : displayDate(round)}
                    </div>
                </div>
                {round &&
                    <div className={"containerCheckRight"}>
                        <ButtonPink
                            children={t("Voir le pari")}
                            onClick={() => {
                                setCardModal(true)
                                setGame(game)
                                setThisRound(round)
                            }}
                        />
                    </div>}
            </div>
        </div>
    )
}

export default Card;
