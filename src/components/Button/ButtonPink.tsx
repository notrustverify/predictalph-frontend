import React from "react";
import {useTranslation} from "react-i18next";

interface ButtonClassicProps {
    onClick?: () => void;
    containerStyle?: React.CSSProperties;
    children: string;
}

const ButtonPink: React.FC<ButtonClassicProps> = ({ onClick, containerStyle, children }) => {

    const {t} = useTranslation();

    return (
        <div className={"ButtonPink"} onClick={() => onClick && onClick()} style={{ ...containerStyle }}>
            {t(children)}
        </div>
    );
}

export default ButtonPink;
