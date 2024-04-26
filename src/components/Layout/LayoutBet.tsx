import ButtonClassic from "../Button/ButtonClassic";
import { useState } from "react";

const LayoutBet = () => {

    const [arrayButton, setArrayButton] = useState(["My Bet", "All Bet", "Stats"]);

    const onClick = (index: number) => {
        console.log("click", index);
    }

    return (
        <div className="containerLayoutBet">
            {arrayButton.map((buttonText, index) => (
                <ButtonClassic
                    key={index}
                    onClick={() => onClick(index)}
                    containerStyle={{
                        borderTopLeftRadius: index === 0 ? "10px" : "0",
                        borderBottomLeftRadius: index === 0 ? "10px" : "0",
                        borderTopRightRadius: index === arrayButton.length - 1 ? "10px" : "0",
                        borderBottomRightRadius: index === arrayButton.length - 1 ? "10px" : "0",
                        border: "1px solid var(--BorderColor)",
                    }}
                >
                    {buttonText}
                </ButtonClassic>
            ))}
        </div>
    );
}

export default LayoutBet;
