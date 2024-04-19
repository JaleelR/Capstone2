import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoutesComponent } from './RoutesComponent';
import { Api } from './Api';
import { UserContext } from './userContext';
import { NavBar } from './NavBar';
import { jwtDecode } from "jwt-decode";
import { useLocalStorage } from './useLocalStorage';
import './App.css';
export const TOKEN_STORAGE_ID = "api-token";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [balances, setBalances] = useState(null); // Add balances state
  const [userToken, setUserToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      if (userToken) {
        let { username, id } = jwtDecode(userToken);
        Api.token = userToken;
        if (!Api.token) {
          throw new Error("No TOekn")
        }
        try {
          let user = await Api.getUserInfo(username);
          setCurrentUser(user);
        } catch (e) {
          console.log("cannot find user")
        }

        try {
          // Fetch balances & transactions
          await Api.saveTransactions();
          await Api.saveBalance();
          let userBalances = await Api.getBalance(id);
          setBalances(userBalances);
        } catch (error) {
          console.log("Error fetching balances:", error);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    }
    getUser();
  }, [userToken]);

  function logout() {
    setUserToken("");
    setCurrentUser(null);
  }

  async function register(username, password, firstName, lastName) {
    try {
      const gotToken = await Api.signup(username, password, firstName, lastName);
      setUserToken(gotToken);
    } catch (e) {
      console.log("Error:", e)
    }
  };

  async function login(username, password) {
    try {
      const getToken = await Api.login(username, password);
     
      setUserToken(getToken);
    } catch (e) {
      console.log("Error:", e)
    }
  };

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser, balances }}> 
        <div className="App">
          <header className="App-header">
         
            <RoutesComponent register={register} login={login} logout={logout} />
          </header>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
