import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignupForm = ({ register }) => {
    const navigate = useNavigate();

    const form = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
    };

    const [signup, setSignup] = useState(form);

    async function handleSubmit(e) {
        e.preventDefault();
        const gotToken = register(signup.username, signup.password, signup.firstName, signup.lastName);
        console.log("Received Token:", gotToken);
        navigate("/connectbank");
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
            <h1>Signup</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="input input-bordered flex items-center gap-2">
                    Username
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={handleChange}
                        value={signup.username}
                        autoComplete="username"
                        className="grow"
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    Password
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        value={signup.password}
                        autoComplete="current-password"
                        className="grow"
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    First name
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        onChange={handleChange}
                        value={signup.firstName}
                        className="grow"
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    Last name
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        onChange={handleChange}
                        value={signup.lastName}
                        className="grow"
                    />
                </label>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    );
};
