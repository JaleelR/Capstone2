import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { Api } from "./Api";
import { useNavigate } from "react-router-dom";
import { TransactionsCard } from "./transactioncard";
import { FormattedDate } from "./FormattedDate";

export const Transactions = () => {
    const navigate = useNavigate();
    const [transactionsSaved, setTransactionsSaved] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
    const [totalSpending, setTotalSpending] = useState(0);
    const [year, setYear] = useState(new Date().getFullYear()); // Current year
    const [orderByColumn, setOrderByColumn] = useState('date');
    const [orderBy, setOrderBy] = useState('DESC');

    const { currentUser } = useContext(UserContext);
    console.log(currentUser);

    useEffect(() => {
        async function getTransactionsByMonth() {
            try {
                if (isNaN(year) || isNaN(month)) {
                    console.error('Invalid year or month:', year, month);
                    return;
                }

                const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
                const endDate = `${year}-${String(month).padStart(2, '0')}-30`; // Assuming 30 days in a month for simplicity
          
                const transactions = await Api.getTransactions(startDate, endDate, orderByColumn, orderBy);

                // Calculate total spending
                const validTransactions = transactions.filter(t =>
                    parseFloat(t.amount) > 0 &&
                    t.category.toLowerCase().indexOf('transfer') === -1
                ).map(t => ({
                    ...t,
                    amount: parseFloat(t.amount).toFixed(2) // Round to two decimal places
                }));

                setTransactionsSaved(transactions); // Set state with filtered and formatted transactions
                setTotalSpending(validTransactions.reduce((total, t) => total + parseFloat(t.amount), 0).toFixed(2)); // Update total spending state
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.log('Too many requests. Retrying after 5 seconds...');
                    setTimeout(() => {
                        getTransactionsByMonth(); // Retry after delay
                    }, 5000); // 5 seconds delay
                } else {
                    console.log("There was an error getting transactions", error);
                }
            }
        }
        getTransactionsByMonth();
    }, [currentUser, year, month, orderByColumn, orderBy]);

    if (!currentUser) {
        console.log("no user");
        return <div>Loading...</div>;
    }

    const handleMonthChange = (e) => {
        const selectedMonth = parseInt(e.target.value, 10);
        setMonth(selectedMonth);
    };

    const handleYearChange = (e) => {
        const selectedYear = parseInt(e.target.value, 10);
        setYear(selectedYear);
    };

    const handleOrderByChange = (e) => {
        setOrderBy(e.target.value);
    };

    const handleOrderByColumnChange = (e) => {
        setOrderByColumn(e.target.value);
    };

    return (
        <div>
            <h1>Transactions for {currentUser.user.username}</h1>

            <div>
                <label htmlFor="month">Select Month:</label>
                <select id="month" value={month} onChange={handleMonthChange}>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>

                <label htmlFor="year">Select Year:</label>
                <select id="year" value={year} onChange={handleYearChange}>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </div>

            <div>
                <label htmlFor="orderByColumn">Order By Column:</label>
                <select id="orderByColumn" value={orderByColumn} onChange={handleOrderByColumnChange}>
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="merchant_name">Merchant Name</option>
                </select>

                <label htmlFor="orderBy">Order By:</label>
                <select id="orderBy" value={orderBy} onChange={handleOrderByChange}>
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                </select>
            </div>

            {transactionsSaved.map(t => (
                <TransactionsCard
                    key={t.transaction_id}
                    name={t.merchant_name === null ? t.category : t.merchant_name}
                    amount={t.amount}
                    date={FormattedDate(t.date)}
                />
            ))}
            <div>
                Total spending the month: ${isNaN(totalSpending) ? '0.00' : totalSpending}
            </div>
        </div>
    );
};
