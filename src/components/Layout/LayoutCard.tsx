import * as React from "react";
import {useContext} from "react";
import {ServiceContext} from "../../App";
import Card from "../Card/Card";


const LayoutCard = () => {

    const services = useContext(ServiceContext);

    return (
        <div className={"LayoutCard"}>
            {services.bet.getGames().map((game, index) => (
                <Card key={game.id} game={game} />
            ))}
        </div>
    );
}

export default LayoutCard;
