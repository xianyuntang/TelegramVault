import React from 'react'
import {HashRouter,Routes,Route} from "react-router-dom";
import {Home} from "../components/Home";
import {LoginPage} from "../components/pages/LoginPage";

export const RootRouter: React.FC = ()=>{
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}>

                </Route>
            </Routes>

        </HashRouter>
    )
}
