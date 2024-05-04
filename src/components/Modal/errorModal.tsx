import {useContext, useEffect, useState} from "react";
import {Box, Modal} from "@mui/material";
import {ServiceContext} from "../../App";
import Typography from "@mui/material/Typography";
import {WalletNotConnectedError} from "../../errors/WalletNotConnected";
import {ConnectButton} from "../../Assets/Connect/connect";

export function ErrorModal() {
    const CALLBACK_ID = 'ERROR_MODAL';
    const STYLE = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const svc = useContext(ServiceContext);
    const [open, setOpen] = useState(false);

    function onError(e: Error): void {
        if (e instanceof WalletNotConnectedError) {
            setOpen(true);
        }
    }

    useEffect(() => {
        svc.wallet.onError(CALLBACK_ID, onError);
        return () => svc.wallet.removeOnError(CALLBACK_ID);
    }, []);

    return <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={STYLE}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Connect your wallet
            </Typography>
            <Typography id="modal-modal-description" sx={{mt: 2}}>
                You have to be connected before bet or claim
            </Typography>
            <Box sx={{marginTop: '20px'}}/>
            <ConnectButton onConnect={() => setOpen(false)}/>
        </Box>
    </Modal>
}
