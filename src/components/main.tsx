import React from "react";
import {Route, Routes} from "react-router-dom";
import {BetPage} from "../pages/bet";

const MainContent = () => {
    return (
            <Routes>
                <Route path="bet/:idUrl" element={<BetPage />} />
                <Route path="/" element={<BetPage id='ALPHPRICE'/>}/>
            </Routes>
    );
};

export default MainContent;
