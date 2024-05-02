import ButtonClassic from "../Button/ButtonClassic";
import { useState } from "react";

type typeState = {
    setChoice: (value: number) => void,
}


const LayoutBet = ({ setChoice }: typeState) => {

    const [arrayButton, setArrayButton] = useState(["Double choix", "Multi Choix", "Stats"]);

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
