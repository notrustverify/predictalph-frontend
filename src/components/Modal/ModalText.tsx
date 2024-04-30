import React from "react";
import { useTranslation } from 'react-i18next';

const ModalText = () => {
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
        <div >
            {modalContentKeys.map((key, index) => (
                <div key={key} style={{
                    fontSize: index % 2 === 0 ? '1.5rem' : 'inherit',
                    fontWeight: index % 2 === 0 ? 'bold' : 'normal',
                    marginBottom: index % 2 === 0 ? 5:30,
                    color: index % 2 === 0 ? 'var(--ModalTitle)' : 'var(--ModalText)',
                }}>
                    {t(key)}
                    <br />
                </div>
            ))}
        </div>
    );
}

export default ModalText;
