import React from "react";
import {useTranslation} from "react-i18next";

interface ButtonClassicProps {
    onClick?: () => void;
    containerStyle?: React.CSSProperties;
    children: string;
    textAdd?: string;
}

const ButtonPink: React.FC<ButtonClassicProps> = ({ onClick, containerStyle, children, textAdd = "" }) => {

    const {t} = useTranslation();

    return (
        <div className={"ButtonPink"} onClick={() => onClick && onClick()} style={{ ...containerStyle }}>
            {t(children) + " " + textAdd}
        </div>
    );
}

export default ButtonPink;
