import {Game} from "../../domain/game";
import CardZoom from "../Card/CardZoom";

type State = {
    isVisible: boolean,
    game: Game,
    setVisible: (value: boolean) => void,
}

const ModalCard = ({ isVisible, game, setVisible }: State) => {

    if (!isVisible) return null;

    return (
        <div className={"containerModalCard"} onClick={() => {setVisible(false)}} >
            <CardZoom
                state={game}
                setGame={() => {}}
            />
        </div>
    )
}

export default ModalCard;
