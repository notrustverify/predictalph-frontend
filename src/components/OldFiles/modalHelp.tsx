import {Box, Modal} from "@mui/material";
import React from "react";
import Typography from "@mui/material/Typography";

type  ModalHelpType = {
    open: boolean,
    handleClose: () => void
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80%',
    maxHeight: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow:'scroll',
};

export function ModalHelp({open, handleClose}: ModalHelpType) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant='h5'>ALPH.bet, bet on ALPH price</Typography>
                <Typography>
                    The goal is very simple, connect your wallet and choose a side, Up or Down.
                    <br/><br/>
                    If you choose Up it means at the end of the round, the price of ALPH will be higher than the locked
                    price.
                    <br/><br/>
                    And if you choose Down, you will be considered as a bear and think the price at the end of the
                    counter will be lower than it was.<br/><br/>
                </Typography>

                <Typography variant='h5'>Why 1 ALPH is needed</Typography>
                <Typography>
                    1 ALPH is needed in addition of the bet to create your bet. You will be able to get this ALPH back
                    by clicking on Claiming rewards which will get you all the rewards on the round you bet correctly.
                    <br/><br/>
                </Typography>

                <Typography variant='h5'>How many times I can participate ?</Typography>
                <Typography>
                    You can only bet once per round. You have to wait the new round to be able to play again.
                    <br/><br/>
                </Typography>

                <Typography variant='h5'>What is Price locked</Typography>
                <Typography>
                    It's price set at the beginning of the round. It will be used to compute if it's Up or down side who
                    won at the end of the epoch.
                    <br/><br/>
                </Typography>

                <Typography variant='h5'>What is happening is if I don't claim my rewards ?</Typography>
                <Typography>
                    You have 1 week to claim your rewards, if you wait to long to do, after this period of time anybody
                    can claim them
                    <br/><br/>
                </Typography>

                <Typography variant='h5'>Responsible Gambling</Typography>
                <Typography>
                While we strive to promote responsible gambling, ALPH.bet does not accept liability for any adverse consequences resulting from users' failure to gamble responsibly. Users participate in gambling activities at their own risk and discretion.
                <br/><br/>
                </Typography>

            </Box>
        </Modal>
    );

}
