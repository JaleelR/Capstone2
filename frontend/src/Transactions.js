import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { Api } from "./Api";
import { useNavigate } from "react-router-dom"

export const Transactions = () => {
    const navigate = useNavigate();
    const [transactionsSaved, setTransactionsSaved] = useState([]);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        async function getallTransactions() {
            try {
               if (currentUser && transactionsSaved.length === 0) {
                   const transactions = await Api.transactions();   
                   console.log(transactions);
                   setTransactionsSaved(transactions); 
               } 
                
               
            } catch (e) {
                console.log("trans not made", e)
            }
        }
         {

            getallTransactions();
        }
    }, [currentUser]);

    if (!currentUser) {
        return <div>loading</div>; // Or any other appropriate loading indicator
    }

    return (
        <div>
            <h1>View Transactions for {currentUser.user.username}</h1>

        </div>
    )
}
