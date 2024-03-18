import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"



export const SignupForm = ({ register}) => {
    const navigate = useNavigate()
    

    // const history = useHistory();
    const form = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
    };


    const [signup, setSignup] = useState(form);

    async function handleSubmit(e) {
        e.preventDefault();
        register(signup.username, signup.password, signup.firstName, signup.lastName);
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

                <label htmlFor="firstName"><b>First name</b></label>
                <input
                    name="firstName"
                    type="text"
                    onChange={handleChange}
                    value={signup.firstName}
                />

                <label htmlFor="lastName"><b>Last name</b></label>
                <input
                    name="lastName"
                    type="text"
                    onChange={handleChange}
                    value={signup.lastName}
                />

                <br />
                <button> Submit </button>
            </form>


        </>
    )
}