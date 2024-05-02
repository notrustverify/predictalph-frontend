import React from "react";

interface ButtonClassicProps {
    onClick: () => void;
    containerStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

const ButtonClassic: React.FC<ButtonClassicProps> = ({ onClick, containerStyle, children }) => {
    return (
        <div className={"ButtonClassic"} onClick={onClick} style={{ ...containerStyle }}>
            {children}
        </div>
    );
}

export default ButtonClassic;
