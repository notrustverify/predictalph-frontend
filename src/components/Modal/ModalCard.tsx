import { Game } from "../../domain/game";
import CardZoom from "../Card/CardZoom";
import {Modal} from "@mui/material";

type State = {
    isVisible: boolean,
    game: Game,
    setVisible: () => void
}

const ModalCard = ({ isVisible, game, setVisible }: State) => {

    if (!isVisible) return null;

    return (
        <Modal
            className={"containerModalCard"}
            open={isVisible}
            onClose={setVisible}
        >
            <CardZoom
                game={game}
                setGame={() => { }}
                setVisible={setVisible}
            />
        </Modal>
    )
}

export default ModalCard;
