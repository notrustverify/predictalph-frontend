import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ButtonPink from "../Button/ButtonPink";
import {Alert, Button, Snackbar} from "@mui/material";
import {Bet, BetStatus, WinStatus} from "../../domain/bet";
import {ServiceContext} from "../../App";

type State = {
    bets: any,
    game: any,
    setStep: any,
    setValidated: any,
    setInformationValidation: any

}

enum ClaimRequest {
    PENDING,SUCCESS,FAILED,NONE
}

const History = ({ bets, game, setStep, setValidated, setInformationValidation }: State) => {

    const services = useContext(ServiceContext);
    const {t} = useTranslation();
    const [epoch, setEpoch] = useState(null)
    const [claiming, setClaiming] = useState<ClaimRequest>(ClaimRequest.NONE);
    const [buttonLocked, setButtonLocked] = useState(false)

    const getResult = (item: Bet) => {
        if (item.win() === WinStatus.WIN) {
            return getMessage("Gagné", "win", item)
        } else if (item.win() === WinStatus.INPROGRESS) {
            return (
                <div style={{display: "flex", flexDirection: "row", zIndex: 100}} >
                    <div className={"wait"}>
                        <span style={{ color: "var(--white)" }}>{"#" + item.epoch + " "}</span>
                        {" "}
                        {t("En attente")}
                    </div>
                    <img src={getIcon(item)} alt={"icon"} style={{ width: "20px", height: "20px", marginLeft: 25 }} />
                </div>
            )
        } else {
            return getMessage("Perdu", "lose", item)
        }
    }

    const getIcon = (item: any) => {
        if (item.status === "In progress" || item.status === "Not claimed") {
            return require("./../../Assets/attendreIcon.png")
        }
        if (item.status === "Claimed") {
            return require("./../../Assets/validIcon.png")
        }
        if (item.status === "Failed") {
            return require("./../../Assets/attendreIcon.png")
        }
    }


    const getMessage = (text: string, classname: string, item: any) => {
        return (
            <div className={classname}>
                <span style={{ color: "var(--white)" }}>{"#" + item.epoch + " "}</span>
                {" "}
                {t(text) + " " + item.reward.toFixed(2) + " ALPH"}
                <img src={getIcon(item)} alt={"icon"} style={{ width: "20px", height: "20px", marginLeft: 25 }} />
            </div>
        )
    }


    const onClick = (item: any) => {

        if (item.status === "Not claimed") {
            setButtonLocked(true)
        }

        if (epoch === item.epoch && !buttonLocked) {
            setEpoch(null)
        } else {
            setEpoch(item.epoch)
        }
    }



    function computeReward(array: Bet[]): number {
        const filtered = array
            .filter(b => b.status === BetStatus.NOTCLAIMED)
            .map(b => b.reward);
        return filtered.length === 0 ? 0 : filtered.reduce((a, b) => a + b);
    }

    async function claim(): Promise<void>{
        setClaiming(ClaimRequest.PENDING);
        setValidated(true);
        setInformationValidation({ type: "info", message: "Transaction en cours de traitement." });
        try {
            const res: boolean = await services.bet.claimMyRound(game);
            setClaiming(res ? ClaimRequest.SUCCESS : ClaimRequest.FAILED);
            if (res) {
                setInformationValidation({ type: "success", message: "Transaction confirmée avec succès." });
                setTimeout(() => {
                    window.location.reload();
                    setValidated(false);
                }, 2000);
            }
        } catch (e) {
            console.log(e);
            setClaiming(ClaimRequest.FAILED);
        }
    }



    const getStatus = (item: any) => {
        if (item.status === "In progress") {
            return t("En attente")
        }
        if (item.status === "Claimed") {
            return t("Réclamé")
        }
        if (item.status === "Not claimed") {
            return (
                <ButtonPink
                    children={"Réclamer"}
                    textAdd={computeReward(bets).toFixed(2) + " ALPH"}
                    onClick={() => {
                        claim()
                    }}
                    containerStyle={{
                        fontSize: "14px",
                        borderRadius: "10px",
                    }}
                />
            )
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setClaiming(ClaimRequest.NONE);
    };


    return (
        <div className={"containerHistory"}>
            <div className={"titleHistory"}>
                {t("Historique des paris")}
            </div>
            {bets.map((item: any, index: number) => (
                <div key={index} className={"history"} onClick={() => {onClick(item)}} style={{flexDirection: item.epoch === epoch ? "column" : "row"}}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", flex: 1}}>
                        {getResult(item)}
                        <div style={{transform: "rotate(90deg)",cursor: "pointer"}} >
                            {">"}
                        </div>
                    </div>
                    {item.epoch === epoch && (
                        <div className={"containerInfoHistory"}>
                            <div className={"strongHistory"}>
                                <div className={"strongTitle"}>Status</div>
                                <div className={"strongTitle"}>Initial bet ALPH </div>
                                <div className={"strongTitle"}>Position</div>
                            </div>
                            <div className={"infoHistory"}>
                                <div className={"strongSubTitle"}>{getStatus(item)}</div>
                                <div className={"strongSubTitle"}>{(item.amount).toFixed(2)} +1 locked </div>
                                <div className={"strongSubTitle"}>{game.choiceDescriptions[item.choice]}</div>
                            </div>
                        </div>
                    )}

                </div>
            ))}
            <ButtonPink
                children={"Fermer"}
                onClick={() => {
                    setStep(0)
                }}
                containerStyle={{
                    width: "10%",
                    alignSelf: "center",
                }}
            />
            <Snackbar open={claiming === ClaimRequest.SUCCESS} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Claim success !
                </Alert>
            </Snackbar>
            <Snackbar open={claiming === ClaimRequest.FAILED} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Claim failed !
                </Alert>
            </Snackbar>
        </div>
    )
}

export default History;

