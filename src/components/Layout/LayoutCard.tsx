import * as React from "react";
import { useContext, useState, useEffect } from "react";
import Card from "../Card/Card";
import ModalCard from "../Modal/ModalCard";
import { Game } from "../../domain/game";
import {Round} from "../../domain/round";
import ModalValidate from "../Modal/ModalValidate";

type typeState = {
    choice: number | null,
    ThisServices: any,
    language: string
}

const LayoutCard = ({ choice, ThisServices, language }: typeState) => {


    const [cardModal, setCardModal] = useState(false);
    const [thisGame, setThisGame] = useState<Game | null>(null);
    const [thisRound, setThisRound] = useState<Round | null>(null);
    const [validated, setValidated] = useState(false);
    const [game, setGame] = useState([]);
    const [informationValidation, setInformationValidation] = useState<{ type: string, message: string }>({ type: "", message: "" });


    useEffect(() => {
        fetchRoundData();
    }, [choice]);


    const fetchRoundData = async () => {
        try {
            const roundGames = ThisServices.bet.getGames().filter((state: Game) => {
                if (choice === 0) {
                    return state && (state.type === "PRICE" || state.type === "CHOICE");
                }
                if (choice === 1) {
                    return state && state.type === "MULTIPLE_CHOICE";
                }
                return false;
            });
            setGame(roundGames);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du tour actuel :", error);
        }
    };

    const onClick = (event: Game) => {
        setThisGame(event);
    };

    const onClickThisRound = (event: Round) => {
        setThisRound(event);
    }


    return (
        <div className={"LayoutCard"}>
            {game && game.map((state, index) => (
                <Card
                    key={index}
                    game={state}
                    setCardModal={setCardModal}
                    setGame={event => onClick(event)}
                    setThisRound={event => onClickThisRound(event)}
                    language={language}
                />
            ))}
            {thisGame && thisRound !== null &&
                <ModalCard
                    isVisible={cardModal}
                    game={thisGame}
                    setVisible={() => {
                        setCardModal(false);
                        setThisGame(null);
                    }}
                    round={thisRound}
                    setValidated={setValidated}
                    language={language}
                    setInformationValidation={setInformationValidation}
                />}
                <ModalValidate
                    open={validated}
                    handleClose={() => {
                        setValidated(false)
                        window.location.reload();
                    }}
                    informationValidation={informationValidation}
                />

        </div>
    );

}

export default LayoutCard;
