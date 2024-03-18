import React, { useContext } from "react";
import { UserContext } from "./userContext";


export const Home = () => { 
    const { currentUser } = useContext(UserContext);
    if (!currentUser || !currentUser.user) {
        return <div>Loading...</div>; // Or any other appropriate loading indicator
    }
    return (
      
        <div>
            {console.log("!!!!!!!!!", currentUser)}
            <h1>Welcome {currentUser.user.username}</h1>
            <h3>Select what you would like to do</h3>
        </div>
    );
}