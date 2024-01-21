import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import {Box} from "@mui/material";
import {BetPanel} from "../components/betPanel";
import {useContext} from "react";
import {ServiceContext} from "../App";
import {Game} from "../domain/game";

type BetPageProps = {
    id?: string;
}

export function BetPage({id}: BetPageProps) {
    let { idUrl } = useParams();
    const idGame: string = id ?? idUrl ?? "";
    const services = useContext(ServiceContext);

    const game: Game = services.bet.getGame(idGame);

    return (
        <Box sx={{alignItems: "center", maxWidth: '1000px', margin: '20px'}}>
            <BetPanel game={game}/>
        </Box>
    )
}
