import { Game } from "../../domain/game";
import CardZoom from "../Card/CardZoom";
import {Modal} from "@mui/material";
import {Round} from "../../domain/round";
import {useState} from "react";

type State = {
    isVisible: boolean,
    game: Game,
    setVisible: () => void,
    round: Round,
    setValidated: (state: boolean) => void
}

const ModalCard = ({ isVisible, game, setVisible, round, setValidated }: State) => {

    if (!isVisible) return null;

    return (
        <Modal
            className={"containerModalCard"}
            open={isVisible}
            onClose={setVisible}
        >
            <CardZoom
                game={game}
                setVisible={setVisible}
                round={round}
                setValidated={setValidated}
            />
        </Modal>
    )
}

export default ModalCard;
