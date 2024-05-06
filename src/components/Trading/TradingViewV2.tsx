import React, { useRef, useEffect } from 'react';
type State = {
    symbol: string,
}

const TradingViewV2 = ({ symbol }: State) => {
    const tradingViewRef = useRef(null);

    useEffect(() => {
        if (tradingViewRef.current) {

        }
    }, [symbol]);

    return (
        <div>
        </div>
    );
}

export default TradingViewV2;
