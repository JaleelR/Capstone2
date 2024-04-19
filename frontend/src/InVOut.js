import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { Api } from "./Api";

export const InVOut = () => {
    const { currentUser, balances } = useContext(UserContext);
    const [totalDeposits, setTotalDeposits] = useState(null);
    const [totalSpending, setTotalSpending] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!currentUser || !balances) {
                    setIsLoading(true);
                    return;
                }

                const currentDate = new Date();
                const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
                const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

                const transactions = await Api.getTransactions(startDate, endDate, "date", "DESC");
                console.log(transactions);
        
                const deposits = transactions.filter(t =>
                    parseFloat(t.amount) < 0 &&
                    (t.category.toLowerCase().split(',').map(c => c.trim()).includes('deposit') ||
                        t.category.toLowerCase().split(',').map(c => c.trim()).includes('payroll') ||
                        t.category.toLowerCase().split(',').map(c => c.trim()).includes('refund'))
                );

                console.log("deposssss", deposits);
                
                const spending = transactions.filter(t =>
                    parseFloat(t.amount) > 0 && t.category.toLowerCase().indexOf('deposit') === -1 && t.category.toLowerCase().indexOf('transfer') === -1
                );
                console.log("spending", spending);

                const totalDepositAmount = deposits.reduce((acc, t) => acc - parseFloat(t.amount), 0);
                const totalSpendingAmount = spending.reduce((acc, t) => acc + parseFloat(t.amount), 0);

                setTotalDeposits(totalDepositAmount.toFixed(2));
                setTotalSpending(totalSpendingAmount.toFixed(2));
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentUser, balances]);

    if (isLoading || !currentUser || !balances) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const checkingBalance = balances.filter(account => account.name.includes("CHECKING"));

    return (
        <div>
            <h1>Income vs spending 💸</h1>
            <p>Checking Balance: {checkingBalance[0]?.balance}</p>
            <div><p>Money in:{totalDeposits} - Money out:{totalSpending}</p></div>
            <p>Total Deposits: {totalDeposits - totalSpending}</p>
       
        </div>
    );
};
