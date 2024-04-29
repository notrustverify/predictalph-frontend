import * as React from "react";
import {useContext, useState} from "react";
import {ServiceContext} from "../../App";
import Card from "../Card/Card";
import ModalCard from "../Modal/ModalCard";
import {Game} from "../../domain/game";


const LayoutCard = () => {

    const services = useContext(ServiceContext);
    const [cardModal, setCardModal] = useState(false);
    const [game, setGame] = useState<Game | null>(null);



    const test = (event: Game) => {
        setGame(event);
    }


    return (
        <div className={"LayoutCard"}>
            {services.bet.getGames().map((state, index) => (
                <Card
                    key={state.id}
                    game={state}
                    cardModal={cardModal}
                    setCardModal={setCardModal}
                    setGame={event => test(event)}
                />
            ))}
            {game &&
                <ModalCard
                    isVisible={cardModal}
                    game={game}
                    setVisible={setCardModal}
                />}
        </div>
    );
}

export default LayoutCard;
