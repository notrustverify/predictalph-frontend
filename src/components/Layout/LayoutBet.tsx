import ButtonClassic from "../Button/ButtonClassic";
import { useState } from "react";

type typeState = {
    setChoice: (value: number) => void,
    choice: number,
}


const LayoutBet = ({ setChoice, choice }: typeState) => {

    const [arrayButton, setArrayButton] = useState(["Double choix", "Multi Choix", "Soon"]);

    return (
        <div className="containerLayoutBet">
            {arrayButton.map((buttonText, index) => (
                <ButtonClassic
                    key={index}
                    containerStyle={{
                        borderTopLeftRadius: index === 0 ? "10px" : "0",
                        borderBottomLeftRadius: index === 0 ? "10px" : "0",
                        borderTopRightRadius: index === arrayButton.length - 1 ? "10px" : "0",
                        borderBottomRightRadius: index === arrayButton.length - 1 ? "10px" : "0",
                        border: "1px solid var(--BorderColor)",
                        background: index === choice ? "linear-gradient(to right, #600c30, #ff2e63, #600c30)" : "var(--SecondaryColor)",
                        color: index === choice ? "white" : "none",
                    }}
                    onClick={() => setChoice(index)}
                >
                    {buttonText}
                </ButtonClassic>
            ))}
        </div>
    );
}

export default LayoutBet;
