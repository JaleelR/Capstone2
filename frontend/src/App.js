import React, {useEffect, useState} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoutesComponent } from './RoutesComponent';

import { Api } from './Api';
import { UserContext } from './userContext';
import logo from './logo.svg';
import { jwtDecode } from "jwt-decode";
import { useLocalStorage } from './useLocalStorage';
import './App.css';
export const TOKEN_STORAGE_ID = "api-token"


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, setUserToken] = useState(TOKEN_STORAGE_ID);

  useEffect(() => {
    async function getUser() {
      if (userToken) {
        console.log("useEffecttoken", userToken)
        try {
          let { username } = jwtDecode(userToken);
          Api.token = userToken;
          //found error!
          console.log("userrrrnammmmeeee", username);
          let user = await Api.getUserInfo(username);
          console.log("userrrrrrrrrr", user);
          setCurrentUser(user);

        } catch (e) {
          console.log("Error:", e);
          
        }
      } else {
        setCurrentUser(null);
      };
    }
    getUser();
  }, [userToken]);



  function logout() {
    setUserToken("");
    setCurrentUser(null);
    console.log(userToken);
  }


  async function register(username, password, firstName, lastName) {
    try {
      const gotToken = await Api.signup(username, password, firstName, lastName);
      setUserToken(gotToken);
      console.log("userToken:", gotToken);

    } catch (e) {
      console.log("Error:", e)
    }
  };


  async function login(username, password) {
    try {
      const getToken = await Api.login(username, password);
      console.log("tokeeeen:", getToken)
      setUserToken(getToken);
    }
    catch (e) {
      console.log("user not found!")
      console.log("Error:", e)
    }
  };


  
 




  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser }} >
    <div className="App">
        <header className="App-header">

          <RoutesComponent register={register}  login={login}  />
      </header>
      </div >
      </UserContext.Provider>
       </BrowserRouter> 
  );
};

export default App;
