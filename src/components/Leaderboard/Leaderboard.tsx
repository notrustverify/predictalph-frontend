import {useState} from "react";


const Leaderboard = () => {

    const [title, setTitle] = useState("Leaderboard");
    const [nameMoney, setNameMoney] = useState("alph");
    const [amountMoney, setAmountMoney] = useState(0);

    return (
        <div className="Leaderboard">
            <div className={"containerLeaderboard"}>
                <div className={"titleLeaderboard"}>
                    {title.toUpperCase()}
                </div>
                <div className={"amountLeaderboard"}>
                    {amountMoney} {nameMoney.toUpperCase()}
                </div>
            </div>
        </div>
    )
}

export default Leaderboard
