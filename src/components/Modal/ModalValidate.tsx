import React from "react";
import { useTranslation } from 'react-i18next';
import {Modal} from "@mui/material";
import ButtonPink from "../Button/ButtonPink";


const ModalValidate = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {

    const { t } = useTranslation();


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
                    padding: '50px',
                    overflow: 'auto',
                    borderRadius: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                    <div className={"validateTitle"}>
                        {t("VALIDATION")}
                    </div>
                    <div className={"validateText"}>
                        {t("Votre pari à bien été enreigstré")}
                    </div>
                <ButtonPink
                    children={t("Fermer")}
                    onClick={handleClose}
                    containerStyle={{marginTop: 20}}
                />
            </div>
        </Modal>
    );
}

export default ModalValidate;
