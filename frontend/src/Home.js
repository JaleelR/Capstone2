import React, { useContext } from "react";
import { UserContext } from "./userContext";


export const Home = () => { 
    const { currentUser } = useContext(UserContext);
    return (
        <div>
        <h1> Welcome {currentUser.user.username} </h1>
        <h3> Select What you would like to do </h3>
        </div>
    )
}