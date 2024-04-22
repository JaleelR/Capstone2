import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ login }) => {
    const navigate = useNavigate();

    const form = {
        username: "",
        password: "",
    };

    const [signup, setSignup] = useState(form);

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(signup.username, signup.password);
        navigate("/");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignup((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    <b>Username</b>
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    onChange={handleChange}
                    value={signup.username}
                    autoComplete="username"
                />

                <label htmlFor="password">
                    <b>Password</b>
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={signup.password}
                    autoComplete="current-password"
                />

                <br />
                <button type="submit">Submit</button>
            </form>
        </>
    );
};
