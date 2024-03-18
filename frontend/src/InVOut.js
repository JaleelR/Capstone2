import React, {useContext} from "react";
import { UserContext } from "./userContext";
export const InVOut = () => {
    const { currentUser } = useContext(UserContext);
    return (
        <div>
            <h1> Income vs transactions 💸  </h1>
 
        </div>
    )
}