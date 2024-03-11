import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoutesComponent } from './RoutesComponent';
import logo from './logo.svg';
import './App.css';
import { GetInfo } from './GetInfo';
function App() {
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
