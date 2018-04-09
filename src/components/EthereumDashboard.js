import React, { Component } from 'react';
import axios from 'axios';
import options from '../data/options.json'
import roundTo from 'round-to'
import LoadingBar from "./LoadingBar";
import WalletTable from "./WalletTable"

class EthereumDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      totalApi: 2,
      apiResponded: 0,
      ethData: {},
      addressInfo: {
        address:'',
        ETH: {
          balance: 0
        },
        tokens: []
      },
      lastUpdate: 0
    }
  }


  componentWillMount() {
    this.getEthPrice();
    this.getAddressinfo();
  }

  getEthPrice() {
    axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/')
      .then(res => {
        let ethData = res.data[0];
        this.setState({ ethData: { 'price': ethData['price_usd'], 'change': ethData['percent_change_7d'] } })
        this.setState(prevState => {
          return {apiResponded: prevState.apiResponded + 1}
        })
      })
  }

  getAddressinfo() {
    let address = options.ethereumAddress;
    axios.get('https://api.ethplorer.io/getAddressInfo/' + address + '/?apiKey=freekey')
      .then(res => {
        console.log(res)
        this.setState({addressInfo: res.data})
        this.setState(prevState => {
          return {apiResponded: prevState.apiResponded + 1}
        })
      })
  }

  calculatePortfolioWorth() {
    let totalWorth = 0
    totalWorth += this.state.ethData['price']*this.state.addressInfo.ETH.balance
    for (let i = 0; i<this.state.addressInfo.tokens.length; i++ ) {
      let token = this.state.addressInfo.tokens[i]
      let balance = token.balance/10**token.tokenInfo.decimals
      let price = token.tokenInfo.price.rate
      totalWorth += balance*price
    }
    totalWorth = roundTo(totalWorth, 2)
    let worthInEth = roundTo(totalWorth/this.state.ethData['price'], 2)
    return {totalWorth: totalWorth, worthInEth: worthInEth}
  }

  gotResponse() {
    this.apisResponded += 1;
    if (this.apisResponded === 2) {
      this.finishedUpdate = true;
    }
  }

  render() {
    console.log("render called")
    let portfolio = this.calculatePortfolioWorth()
    return (
      <div className="wallet w-50 mx-auto">
        <h1>Wallet stats</h1>
        {(this.state.apiResponded === this.state.totalApi) ?
          (<WalletTable ethData={this.state.ethData} addressInfo={this.state.addressInfo}/>):
          (<LoadingBar current={this.state.apiResponded} max={this.state.totalApi}/>)}
      </div>
    );
  }
}

export default EthereumDashboard;