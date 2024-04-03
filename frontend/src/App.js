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
  const [userToken, setUserToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function getUser() {
  
      setIsLoading(true); // Set loading to true when fetching user data
      if (userToken) {
        
          let { username } = jwtDecode(userToken);
          Api.token = userToken;

          try {
            let user = await Api.getUserInfo(username);
            setCurrentUser(user);
          } catch (e) {
            console.log("cannot find user")
          }
     //  try {
            //               const auth = await Api.authGet();
            //               console.log("AAAAAAAAUUUUUTHHHHH", auth);
            //             } catch (e) {
            //               console.log("Auth not created", e)
            //             }

            // try {
            //   const transactions = await Api.transactions();
            //   console.log("transactionnnnnnnsssss", transactions);
            // } catch (e) {
            //   console.log("trans not made", e)
            // }

    
          // } catch (e) {
          //   console.log("Error:", e);
          // }
          //  console.log(await Api.authBalance())
          
          //   }
        
        }
      else {
        setCurrentUser(null);
      }
      setIsLoading(false); // Set loading to false after fetching user data
    }
    getUser();
  }, [userToken]);

  function logout() {
    setUserToken("");
    setCurrentUser(null);
    console.log(userToken);
  }


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
     
      {console.log("________", currentUser)}
      <UserContext.Provider value={{ currentUser, setCurrentUser }} >
        <div className="App">
       
        <header className="App-header">
   <button onClick={logout}>logout</button>
          <RoutesComponent register={register}  login={login} logout={logout}  />
      </header>
      </div >
      </UserContext.Provider>
       </BrowserRouter> 
  );
};

export default App;
