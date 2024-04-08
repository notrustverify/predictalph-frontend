// TradingViewWidget.jsx
import React, {useEffect, useRef, memo} from 'react';

type TradingViewWidgetType = {
    symbol: string,
}

function TradingViewWidget({symbol}: TradingViewWidgetType) {
    const container = useRef();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "autosize": true,
        "symbol": "GATEIO:ALPHUSDT",
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
      }`;

        try {
            // @ts-ignore
            container.current.appendChild(script);
        } catch (e) {
            console.log(e);
        }

        return () => {
            try {
                // @ts-ignore
                container.current.removeChild(script); // Cleanup
            } catch (e) {
                console.log(e);
            }
        };
    }, []);

    return (
        // @ts-ignore
        <div className="tradingview-widget-container" ref={container} style={{height: "100%", width: "100%"}}>
            <div className="tradingview-widget-container__widget"
                 style={{height: "calc(100% - 32px)", width: "100%"}}></div>
            <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow"
                                                             target="_blank"><span className="blue-text">Track all markets on TradingView</span></a>
            </div>
        </div>
    );
}

export default TradingViewWidget;
