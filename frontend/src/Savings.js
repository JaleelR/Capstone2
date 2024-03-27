import React, {useContext} from "react";
import { UserContext } from "./userContext";
export const Savings = () => {
    const { currentUser } = useContext(UserContext);
    return (
        <div>

            <h1> How much you could save  🤑</h1>
          
        </div>
    )
};