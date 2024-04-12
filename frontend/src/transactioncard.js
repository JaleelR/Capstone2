import React from "react";

export const TransactionsCard = ({name, amount, date}) => {
    return (
        <div>
            <ul>
            <li><b>Name:</b>{name}   &nbsp;  <b>Amount:</b>{amount} &nbsp; <b>Date:</b>{date}  </li>   
            </ul>

        </div>
    )
}