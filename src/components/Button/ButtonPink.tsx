import React from "react";

interface ButtonClassicProps {
    onClick?: () => void;
    containerStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

const ButtonPink: React.FC<ButtonClassicProps> = ({ onClick, containerStyle, children }) => {
    return (
        <div className={"ButtonPink"} onClick={() => onClick && onClick()} style={{ ...containerStyle }}>
            {children}
        </div>
    );
}

export default ButtonPink;
