import React, {useState, useEffect} from "react";
import axios from "axios"
import { usePlaidLink } from 'react-plaid-link';
import { Api } from "./Api";
import { useNavigate } from "react-router-dom"
axios.defaults.baseURL = 'http://localhost:3001';

export const ConnectBank = () => {
    const [linkToken, setLinkToken] = useState();
    const [publicToken, setPublicToken] = useState();
    const navigate = useNavigate();
  
   
    useEffect(() => {
        async function token_link() {
            const tl = await Api.getLinkToken();
            console.log(tl)
            setLinkToken(tl);
        }
        token_link();
    }, []);
   


    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            setPublicToken(public_token);

        },
    });


    useEffect(() => {
        async function access_token() {
            if (publicToken) {
                const accessToken = await Api.exchangePublicToken(publicToken);
                console.log("access token:", accessToken);
                navigate("/")
            } else {
                console.log("no public token")
            }
        };
        access_token();
    }, [publicToken])

   

    return (
        <div>
           
            <button onClick={() => open()} disabled={!ready}>
                Connect a bank account
            </button>
        </div>
    )
};