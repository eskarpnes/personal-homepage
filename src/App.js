import React, { Component } from 'react';
import './css/App.css';
import EthereumDashboard from "./components/EthereumDashboard";
import Shortcuts from './components/Shortcuts'
import Weather from "./components/Weather";

class App extends Component {
  render() {
    return (
      <div className="App">
        <EthereumDashboard/>
      </div>
    );
  }
}

export default App;
