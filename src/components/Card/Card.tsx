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
    setGame: (value: Game) => void,
    round: Round | null
}

const Card = ({ game, setCardModal, setGame, round }: cardType) => {

    const { t } = useTranslation();


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

    if (!game ) return null;



    return (
        <div className={"containerCard"}>
            <div className={"containerCardTitle"}>
                {game.name}
            </div>
            {game && game.choiceDescriptions.length === 2 &&
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
