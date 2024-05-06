// TradingViewWidget.jsx
import React, { useEffect, useRef } from 'react';

type Props = {
    symbol: string,
}

const TradingViewWidget: React.FC<Props> = ({ symbol }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": symbol, // Utiliser le symbole passé en tant que prop
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "hide_legend": true,
            "save_image": false,
            "calendar": false,
            "hide_volume": true,
            "support_host": "https://www.tradingview.com"
        });

        try {
            if (container.current) {
                container.current.appendChild(script);
            }
        } catch (e) {
            console.log(e);
        }

        return () => {
            try {
                if (container.current) {
                    container.current.removeChild(script); // Cleanup
                }
            } catch (e) {
                console.log(e);
            }
        };
    }, [symbol]); // Effect will re-run whenever the symbol prop changes

    return (
        <div ref={container}></div>
    );
}

export default TradingViewWidget;
