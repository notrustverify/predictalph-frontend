import { Game } from "../../domain/game";
import CardZoom from "../Card/CardZoom";
import {useEffect} from "react";

type State = {
    isVisible: boolean,
    game: Game,
    setVisible: (value: boolean) => void,
}

const ModalCard = ({ isVisible, game, setVisible }: State) => {

    useEffect(() => {
        // console.log("This game", game);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={"containerModalCard"} >
            <CardZoom
                game={game}
                setGame={() => { }}
                setVisible={() => setVisible(false)}
            />
        </div>
    )
}

export default ModalCard;
