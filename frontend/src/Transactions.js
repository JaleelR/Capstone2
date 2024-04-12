import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { Api } from "./Api";
import { useNavigate } from "react-router-dom"
import { TransactionsCard } from "./transactioncard";
import { FormattedDate } from "./FormattedDate";

export const Transactions = () => {
    const navigate = useNavigate();
    const [transactionsSaved, setTransactionsSaved] = useState([]);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
            async function getallTransactions() {
                try {    
            
                const transactions = await Api.saveTransactions(
                    currentUser.user.username);
                
                    const transactions2 = await Api.getTransactions();
                    setTransactionsSaved(oldtransactions => transactions2 )
            }
         catch (error) {
                console.log("there was an error getting transactions", error)
            }
        }
        getallTransactions(); 
    }, [currentUser]);

    if (!currentUser) {
        return <div>loading</div>; // Or any other appropriate loading indicator
    }

    return (
        <div>
        <h1>Transactions for {currentUser.user.username}</h1>
            {transactionsSaved.map(t => (
                <TransactionsCard key={t.transaction_id } name={t.merchant_name} amount={t.amount } date={FormattedDate(t.date)} />
            ))}
            

        </div>
    )
}
