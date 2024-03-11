import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
// import {useHistory} from "react-router-dom"



export const LoginForm = () => {
    const navigate = useNavigate()



    const form = {
        username: "",
        password: "",
    };


    const [signup, setSignup] = useState(form);
    async function handleSubmit(e) {
        e.preventDefault();
        navigate("/");

    }







    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignup(prevState => ({
            ...prevState,
            [name]: value
        }));


    };



    return (
        <>
            <h1>Login</h1>

            {console.log(signup)}

            <form onSubmit={handleSubmit}>
                {

                }
                <label htmlFor="username"><b>Username</b></label>
                <input
                    name="username"
                    type="text"
                    onChange={handleChange}
                    value={signup.username}
                />

                <label htmlFor="password"><b>Password</b></label>
                <input
                    name="password"
                    type="text"
                    onChange={handleChange}
                    value={signup.password}
                />

                <br />
                <button> Submit </button>
            </form>


        </>
    )
}