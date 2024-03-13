import React, {useEffect} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoutesComponent } from './RoutesComponent';
import axios from "axios"
import logo from './logo.svg';
import './App.css';
import { GetInfo } from './GetInfo';


function App() {
axios.defaults.baseURL = "http://localhost:3001"
  
  useEffect(() => {
    async function fetch() {
      const response = await axios.get("/")
      console.log(response);
    }   
    fetch();
  }, []);

  useEffect(() => {
    async function fetch2() {
      const response = await axios.post("/create_link_token")
      console.log(response);
    }   
    fetch2();
  }, []);
 



  return (
         <BrowserRouter>
    <div className="App">
      <header className="App-header">
    
          <RoutesComponent/>
      
    
      </header>
    </div >
       </BrowserRouter> 
  );
}

export default App;
