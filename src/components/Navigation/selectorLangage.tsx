import React, { useState } from 'react';
import ButtonClassic from "../Button/ButtonClassic";

type state = {
    language: string,
    setLanguage: (value: string) => void,
}

const LanguageSelector = ({ language, setLanguage }: state) => {


    const toggleLanguage = () => {
        setLanguage(language === 'fr' ? 'en' : 'fr');
    };

    const styleFlag = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }

    const styleImg = {
        width: "20px",
        height: "20px",
    }

    return (
        <div>
            <ButtonClassic
                onClick={toggleLanguage}
                containerStyle={{
                    background: "var(--SecondaryColor)",
                    color: "var(--TextColor)",
                    border: "1px solid var(--BorderColor)",
                    borderRadius: "10px",
                    padding: 10,
                    minWidth: "0px",
                    marginRight: "25px",
                }}
            >

                {language === 'fr' ?
                    <div style={styleFlag}>
                        <img src={require("./../../Assets/EN.png")} style={styleImg} />
                    </div>
                    :
                    <div style={styleFlag}>
                        <img src={require("./../../Assets/FR.png")}  style={styleImg} />
                    </div>
                }
            </ButtonClassic>
        </div>
    );
};

export default LanguageSelector;
