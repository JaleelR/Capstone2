import React, { useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from "./userContext";

export const NavBar = ({ logout }) => {
    const navigate = useNavigate();
    const { currentUser, balances } = useContext(UserContext);

    const handleClick = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    }

    return (
        <div>
            {currentUser !== null ? (
                <>
                    {console.log("Logged In:", currentUser)}
                    {balances && (
                        <h5> Balance: ${parseFloat(balances.find(account => account.name.includes("CHECKING")).balance).toFixed(2)}</h5>


                    )}
                    <NavLink to="/"> <h4>Money Manager</h4></NavLink>
                    <NavLink to="/transactions"> transactions </NavLink>
                    <NavLink to="/invsout"> Money in vs out </NavLink>
                    <NavLink onClick={handleClick}> <h4>Logout {currentUser.user.username}</h4></NavLink>
                </>
            ) : (
                <>
                    {console.log("Logged out:", currentUser)}
                    <NavLink to="/login"> Login </NavLink>
                    <NavLink to="/signup"> Signup </NavLink>
                </>
            )}
        </div>
    );
}
