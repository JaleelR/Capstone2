import React, { useContext } from "react";
import { UserContext } from "./userContext";
export const Transactions = () => {
    const { currentUser } = useContext(UserContext);
    return (
        <div>
            <h1>View Transactions</h1>
            
        </div>
    )
}