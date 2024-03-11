import React from "react";
import { Route, Routes } from "react-router-dom"; 
import { GetInfo } from "./GetInfo";
import { SignupForm } from "./SignupForm";
import { LoginForm } from "./LoginForm";
import { Home } from "./Home";
import { Transactions } from "./Transactions";
import { Savings } from "./Savings";
import { InVOut } from "./InVOut";
import {EditForm} from "./EditForm"
export const RoutesComponent = () => {
    return (
        <>
            <Routes>
                <Route exact path="/" element={<Home/>} />
       

                <Route exact path="/GetInfo" element={<GetInfo/>} />

                <Route exact path="/signUp" element={<SignupForm/>} />
     
                <Route exact path="/login" element={<LoginForm/>} />
                <Route exact path="/Edit" element={<EditForm/>} />
    


                <Route exact path="/transactions" element={<Transactions/>} />


                <Route exact path="/Savings" element={<Savings/>} />

                <Route exact path="/InVsOut" element={<InVOut/>} />
        </Routes>
        </>
    )
}