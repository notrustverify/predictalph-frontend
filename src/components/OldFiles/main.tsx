import React from "react";
import {Route, Routes} from "react-router-dom";
import {BetPage} from "../../pages/bet";
import {Home} from "../../pages/home";
import {Stack} from "@mui/material";
import {ErrorModal} from "../Modal/errorModal";

const MainContent = () => {
    return (
        <Stack>
            <ErrorModal/>
            <Routes>
                <Route path="bet/:idUrl" element={<BetPage />} />
                <Route path="/" element={<Home/>}/>
            </Routes>
        </Stack>

    );
};

export default MainContent;
