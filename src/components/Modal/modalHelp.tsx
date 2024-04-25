import { Box, Modal } from "@mui/material";
import React from "react";
import ModalText from "./modalText";


export const ModalHelp = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '80%',
                    maxHeight: '80%',
                    backgroundColor: 'var(--PrimaryGrey)',
                    border: '2px solid #000',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    padding: '20px',
                    overflow: 'auto',
                    borderRadius: '30px',
                }}
            >
                <ModalText />
            </div>
        </Modal>
    );
}

export default ModalHelp;

