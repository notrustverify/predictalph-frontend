import React, { useRef, useEffect } from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

type State = {
    symbol: string,
}

const TradingViewV2 = ({ symbol }: State) => {
    const tradingViewRef = useRef(null);

    useEffect(() => {
        if (tradingViewRef.current) {
            // Access TradingViewWidget instance and update the symbol
            tradingViewRef.current.changeSymbol(symbol);
        }
    }, [symbol]);

    return (
        <div>
            <TradingViewWidget
                ref={tradingViewRef}
                symbol={symbol}
                timezone="Etc/UTC"
                locale="fr"
                autosize
            />
        </div>
    );
}

export default TradingViewV2;
