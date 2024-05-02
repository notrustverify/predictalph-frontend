import * as React from "react";
import { useContext, useState, useEffect } from "react";
import { ServiceContext } from "../../App";
import Card from "../Card/Card";
import ModalCard from "../Modal/ModalCard";
import { Game } from "../../domain/game";
import { Round } from "../../domain/round";

type typeState = {
    choice: number | null,
    ThisServices: any
}

const LayoutCard = ({ choice, ThisServices }: typeState) => {


    const [cardModal, setCardModal] = useState(false);
    const [game, setGame] = useState<Game | null>(null);
    const [round, setRound] = useState<Round | null>(null);
    const [filteredGames, setFilteredGames] = useState<Round[]>([]);

    useEffect(() => {
        console.log("CHOICE ===", choice)
        fetchRoundData();
    }, [choice]);

    useEffect(() => {

        console.log("filteredGames ===", filteredGames)
    }, [filteredGames]);

    useEffect(() => {
        start()
    }, []);

    async function start() {
        try {
            const currRound: Round = await ThisServices.bet.getCurrentRound(game);
            if (currRound) {
                setRound(currRound);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du tour actuel :", error);
        }
    }

    const fetchRoundData = async () => {

        try {
            // const roundGames = ThisServices.bet.getGames();
            const roundGames = ThisServices.bet.getGames().filter((state: Game) => {
                if (choice === 0) {
                    return state && state.type.includes("PRICE");
                }
                if (choice === 1) {
                    return state && state.type.includes("MULTIPLE_CHOICE");
                }
                return false;
            });

            const roundData = [];

            console.log("roundGames:", roundGames)
            for (const state of roundGames) {
                console.log("JE RENTRE DANS FOR???")
                console.log("STATE ===", state)
                // console.log("ThisServices.bet.getCurrentRound ===", ThisServices.bet.getCurrentRound(state))
                const currRound: Round = await ThisServices.bet.getCurrentRound(state);
                console.log("currRound ===", currRound)
                roundData.push(currRound);
            }

            // console.log("ICI ===", roundData);
            console.log("je lance le setFilteredGames")
            setFilteredGames(roundData);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du tour actuel :", error);
        }
    };

    const onClick = (event: Game) => {
        setGame(event);
    };

    return (
        <div className={"LayoutCard"}>
            {filteredGames.map((state, index) => (
                    <Card
                        key={state.game.id}
                        game={state.game}
                        setCardModal={setCardModal}
                        setGame={event => onClick(event)}
                        round={state}
                    />
                ))}
            {game &&
                <ModalCard
                    isVisible={cardModal}
                    game={game}
                    setVisible={() => {
                        setCardModal(false);
                        setGame(null);
                    }}
                />}
        </div>
    );

}

export default LayoutCard;
