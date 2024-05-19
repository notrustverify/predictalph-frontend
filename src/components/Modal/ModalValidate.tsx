import React, {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import {Modal} from "@mui/material";
import ButtonPink from "../Button/ButtonPink";

type state = {
    open: boolean,
    handleClose: () => void,
    informationValidation: { type: string, message: string }

}

const ModalValidate = ({ open, handleClose, informationValidation }: state) => {

    const { t } = useTranslation();
    const [type, setType] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        let messageType: string;

        switch (informationValidation.type) {
            case 'success':
                messageType = 'Succès';
                break;
            case 'info':
                messageType = 'Transaction en cours';
                break;
            case 'error':
                messageType = 'Erreur';
                break;
            default:
                messageType = 'Inconnu';
                break;
        }

        setType(messageType);
        setMessage(informationValidation.message)
    }, [informationValidation])

    const getMessage = (text: string, classname: string) => {
        return (
            <div className={classname}>
                {t(text)}
            </div>
        )
    }

    return (
        <Modal
            open={open}
            onClose={ () => {
                if (informationValidation.type === 'success') {
                    handleClose()
                }
            }}
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
                {getMessage(type, "validateTitle")}
                {getMessage(message, "validateText")}
                    {/*<div className={"validateTitle"}>*/}
                    {/*    {t("VALIDATION")}*/}
                    {/*</div>*/}
                    {/*<div className={"validateText"}>*/}
                    {/*    {t("Votre pari à bien été enreigstré")}*/}
                    {/*</div>*/}
                <ButtonPink
                    children={t("Fermer")}
                    onClick={ () => {
                        if (informationValidation.type === 'success') {
                            handleClose()
                        }
                    }}
                    containerStyle={{marginTop: 20}}
                />
            </div>
        </Modal>
    );
}

export default ModalValidate;
