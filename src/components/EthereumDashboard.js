import React, { Component } from 'react';
import axios from 'axios';
import ethereumOptions from '../data/ethereum-options.json'
import roundTo from 'round-to'

class EthereumDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      apiKey: 'HYDJIIH4EC43CAE7DD8JVFN47Q29614FS8',
      ethBalance: 0,
      ethWorth: 0,
      tokenBalances: [],
      prices: {},
      totalEthWorth: 0
    }
  }


  componentWillMount() {
    this.getPrices();
    this.getEthereumBalance();
    this.getTokenBalances();
  }

  getPrices() {
    let cryptos = ["Ethereum"]
    let tokens = ethereumOptions.tokens
    for (let i = 0; i < tokens.length; i++) {
      cryptos.push(tokens[i].name)
    }
    for (let i = 0; i < cryptos.length; i++) {
      axios.get("https://api.coinmarketcap.com/v1/ticker/" + cryptos[i] + '/')
        .then(res => {
          let name = cryptos[i]
          let price = res.data[0]['price_usd']
          this.state.prices[name] = price
      })
    }
  }

  getEthereumBalance() {
    let address = ethereumOptions.ethereumAddress;
    let decimals = 10**18;
    axios.get('https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + this.state.apiKey)
      .then(res => {
        let ethBalance = roundTo(res.data.result/decimals,2 );
        let ethWorth = roundTo(ethBalance*this.state.prices['Ethereum'],2 )
        this.setState({ethBalance: ethBalance, ethWorth: ethWorth});
      })
  }


  getTokenBalances() {
    let tokens = ethereumOptions.tokens;
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      axios.get('https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=' +
        token.address +
        '&address=' +
        ethereumOptions.ethereumAddress +
        '&tag=latest&apikey=' +
        this.state.apiKey)
      .then(res => {
        let balance = roundTo(res.data.result/10**token.decimals, 2);
        let worth = roundTo(balance*this.state.prices[token.name], 2)
        let result = {name: token.name, balance: balance, worth: worth}
        this.state.tokenBalances.push(result);
        this.forceUpdate()
      })
    }
  }

  calculateEthPortfolio() {
    let totalWorth = 0
    totalWorth += this.state.ethWorth
    let tokens = this.state.tokenBalances
    for (let i = 0; i < tokens.length; i++) {
      totalWorth += tokens[i].worth
    }
    let totalEthWorth = roundTo(totalWorth/this.state.prices['Ethereum'],2 )
    return totalEthWorth
  }

  calculateDollarPortfolio(){
    let totalWorth = 0
    totalWorth += this.state.ethWorth
    let tokens = this.state.tokenBalances
    for (let i = 0; i < tokens.length; i++) {
      totalWorth += tokens[i].worth
    }
    return roundTo(totalWorth,2)
  }

  render() {
    console.log("render called")
    let totalEthWorth = this.calculateEthPortfolio()
    let totalWorth = this.calculateDollarPortfolio()
    return (
      <div className="wallet w-50 mx-auto">
          <h1>Wallet stats</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Coin</th>
              <th scope="col">Holding</th>
              <th scope="col">Price</th>
              <th scope="col">Worth</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Ethereum</th>
              <td>{this.state.ethBalance}</td>
              <td>${this.state.prices['Ethereum']}</td>
              <td>${this.state.ethWorth}</td>
            </tr>
            {this.state.tokenBalances.map((token,idx) =>
              <tr>
                <th scope="row">{token.name}</th>
                <td>{token.balance}</td>
                <td>${this.state.prices[token.name]}</td>
                <td>${token.worth}</td>
              </tr>
            )}
            <tr>
              <th scope="row">Total</th>
              <td>{totalEthWorth} eth</td>
              <td></td>
              <td>${totalWorth}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default EthereumDashboard;