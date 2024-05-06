import {useContext, useEffect, useState} from "react";
import {ServiceContext} from "../../App";
import {useBalance} from "@alephium/web3-react";


const Leaderboard = () => {

    const services = useContext(ServiceContext);
    const [title, setTitle] = useState("Leaderboard");
    const { balance, updateBalanceForTx } = useBalance()



    return (
        <div className="Leaderboard">
            <div className={"containerLeaderboard"}>
                <div className={"titleLeaderboard"}>
                    {title.toUpperCase()}
                </div>
                {services.wallet && balance?.balanceHint && (
                    <div className={"amountLeaderboard"}>
                        {parseFloat(balance.balanceHint).toFixed(0) + " ALPH"}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Leaderboard
