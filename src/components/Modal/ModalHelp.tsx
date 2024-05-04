import { Box, Modal } from "@mui/material";
import React from "react";
import { useTranslation } from 'react-i18next';


export const ModalHelp = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {

    const { t } = useTranslation();
    const modalContentKeys = [
        'modal.content0',
        'modal.content1',
        'modal.content2',
        'modal.content3',
        'modal.content4',
        'modal.content5',
        'modal.content6',
        'modal.content7',
        'modal.content8',
        'modal.content9',
        'modal.content10',
        'modal.content11',
    ];

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '80%',
                    maxHeight: '80%',
                    backgroundColor: 'var(--SecondaryColorV1)',
                    border: '2px solid var(--BorderColor)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    padding: '20px',
                    overflow: 'auto',
                    borderRadius: '30px',
                }}
            >
                <div >
                    {modalContentKeys.map((key, index) => (
                        <div key={key} style={{
                            fontSize: index % 2 === 0 ? '1.5rem' : 'inherit',
                            fontWeight: index % 2 === 0 ? 'bold' : 'normal',
                            marginBottom: index % 2 === 0 ? 5:30,
                            color: index % 2 === 0 ? 'var(--ModalTitle)' : 'var(--ModalValidate)',
                        }}>
                            {t(key)}
                            <br />
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}

export default ModalHelp;

