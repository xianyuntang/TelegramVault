import React from 'react'
import {HashRouter,Routes,Route} from "react-router-dom";
import {Home} from "../components/Home";

export const RootRouter: React.FC = ()=>{
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home/>}>

                </Route>
            </Routes>

        </HashRouter>
    )
}
