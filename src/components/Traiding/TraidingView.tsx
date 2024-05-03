import React, {useContext, useEffect, useState} from "react";
import ButtonPink from "../Button/ButtonPink";



const TraidingView = () => {

    const [hovered, setHovered] = useState(false);

    const openTradingView = () => {
        // Ouvrir TradingView dans une nouvelle fenêtre ou un nouvel onglet
        window.open('https://www.tradingview.com/chart/?symbol=BITSTAMP%3ABTCUSD', '_blank');
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}
             onMouseEnter={() => setHovered(true)}
             onMouseLeave={() => setHovered(false)}
        >
            <ButtonPink
                onClick={openTradingView}
                children={"TradingView"}
                containerStyle={{
                    background: hovered ? 'var(--PrimaryGrey)' : 'linear-gradient(to right, var(--pink), var(--pinkDark))',
                    border: hovered ? '1px solid var(--pink)' : '1px solid var(--PrimaryColor)',
                    color: hovered ? 'var(--pink)' : 'var(--white)',
                }}
            />
        </div>
    );
}

export default TraidingView;
