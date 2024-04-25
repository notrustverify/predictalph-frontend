import {useContext, useEffect, useState} from "react";
<<<<<<< HEAD:src/components/OldFiles/overviewCard.tsx
import {ServiceContext} from "../../App";
import {Round} from "../../domain/round";
import {Game} from "../../domain/game";
=======
import {ServiceContext} from "../App";
import {Round} from "../domain/round";
import {Game, GameType} from "../domain/game";
>>>>>>> PierreM33-UIV2_PierreM:src/components/overviewCard.tsx
import {Button, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Done, OpenInNew, Start} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import IconButton from "@mui/material/IconButton";

type OverviewCardType = {
    game: Game,
}

export function OverviewCard({game}: OverviewCardType) {
    const services = useContext(ServiceContext);
    const [round, setRound] = useState<Round | null>(null);
    const [choice, setChoice] = useState<number | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const navigate = useNavigate();


    async function fetch (): Promise<void> {
        const currRound: Round = await services.bet.getCurrentRound(game);
        setRound(currRound);
    }

    function goToBet() {
        if (choice === null || amount === 0)
            return;
        navigate(`bet/${game.id}`, {state: {choice, amount}})
    }

    function displayChoice(): JSX.Element {
        return (<Grid
                item md={12} xs={12}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid item md={6} sx={{marginTop: '10px', paddingRight: '5px'}}>
                    <Button
                        fullWidth
                        onClick={() => setChoice(0)}
                        color="secondary"
                        variant="outlined">
                        {game.choiceDescriptions[0]}
                    </Button>
                </Grid>
                <Grid item md={6} sx={{marginTop: '10px', paddingLeft: '5px'}}>
                    <Button
                        fullWidth
                        onClick={() => setChoice(1)}
                        color={ game.type === GameType.MULTIPLE_CHOICE ? "secondary": "warning"}
                        variant="outlined">
                        {game.choiceDescriptions[1]}
                    </Button>
                </Grid>
<<<<<<< HEAD:src/components/OldFiles/overviewCard.tsx
                { game.type === GameType.MULTIPLE_CHOICE ? 
=======
                { game.type === GameType.MULTIPLE_CHOICE && game.choiceDescriptions[2] !== undefined ? 
>>>>>>> PierreM33-UIV2_PierreM:src/components/overviewCard.tsx
                <Grid item md={6} sx={{marginTop: '10px'}}>
                    <Button
                        fullWidth
                        onClick={() => setChoice(2)}
                        color={ game.type === GameType.MULTIPLE_CHOICE ? "secondary": "warning"}
                        variant="outlined">
                        {game.choiceDescriptions[2]}
                    </Button>
                </Grid> : ''}
            </Grid>
        );
    }

    function displayAmount(amt: number): JSX.Element {
        return (
            <Grid
                item md={12} xs={12}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{marginTop: '10px'}}
            >
                <Grid item md={9}>
                <FormControl fullWidth size="small">
                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        type="number"
                        value={amt}
                        onChange={event => setAmount(parseInt(event.target.value))}
                        startAdornment={<InputAdornment position="start">ALPH</InputAdornment>}
                        label="Amount"/>
                </FormControl>
                </Grid>
                <Grid item md={3} sx={{textAlign: 'center',}}>
                    <Button sx={{height: '40px'}} onClick={goToBet} variant='outlined' startIcon={<Start/>}>Bet</Button>
                </Grid>
            </Grid>
        )
    }

    useEffect(() => {
        fetch().then();
    }, []);


    return round === null ? <></> : (
        <Paper
            sx={{padding: '10px', margin: '10px'}}

        >
            <Grid
                container
                direction='column'
                justifyContent='space-between'
                alignItems='stretch'
                sx={{width: '100%'}}
            >
                <Grid
                    item md={12} xs={12}
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{width: '100%'}}
                >
                    <Grid item><Typography>{game.name}</Typography></Grid>
                    <Grid item>
                        <Button
                            variant='text'
                            onClick={() => navigate(`bet/${game.id}`)}
                            endIcon={<OpenInNew/>}>
                            Open
                        </Button>
                    </Grid>
                </Grid>
                <Grid
                    item md={12} xs={12}
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item><Typography>ALPH {round.pollAmounts[0]}</Typography></Grid>
                    <Grid item><Typography>ALPH {round.pollAmounts[1]}</Typography></Grid>

                </Grid>
                <Grid item sx={{height: '100%'}} md={12} xs={12}>
                    {/*<HorizontalBar polls={round.pollAmounts} height='20px'/>*/}
                </Grid>

                {choice === null ? displayChoice() : displayAmount(amount)}

        </Grid>
</Paper>
)
}
