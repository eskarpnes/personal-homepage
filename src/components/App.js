import React, { Component } from 'react';
import '../css/App.css';
import EthereumDashboard from "./EthereumDashboard";
import Weather from './Weather';
import Shortcuts from './Shortcuts'
import Weather from "./Weather";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Weather />
        <EthereumDashboard/>
        <Weather/>
        <Shortcuts/>
      </div>
    );
  }
}

export default App;
