import React from "react";
import {Route, Routes} from "react-router-dom";
import {BetPage} from "../pages/bet";
import {Home} from "../pages/home";

const MainContent = () => {
    return (
            <Routes>
                <Route path="bet/:idUrl" element={<BetPage />} />
                <Route path="/" element={<Home/>}/>
            </Routes>
    );
};

export default MainContent;
