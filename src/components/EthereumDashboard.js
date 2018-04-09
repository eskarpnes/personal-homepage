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
      addressInfo: {},
      lastUpdate: 0
    }
  }


  componentWillMount() {
    this.checkLastUpdate();
  }

  checkLastUpdate() {
    // Unix time uber allest
    const lastUpdate = localStorage.getItem("lastUpdate")
    const now = Math.round((new Date()).getTime() / 1000);
    const timeout = 60*5;
    let timeSinceUpdate = now - lastUpdate
    console.log("Timeout at " + timeout + " seconds.")
    console.log("Time since last update: " + timeSinceUpdate)
    if (timeSinceUpdate > timeout) {
      console.log("Fetching new data.")
      this.getEthPrice();
      this.getAddressinfo();
    } else {
      console.log("Fetching data from cache.")
      this.checkCache();
    }
  }

  checkCache() {
    const cachedEthData = localStorage.getItem("ethData")
    const cachedAddressInfo = localStorage.getItem("addressInfo")
    if (cachedEthData) {
      this.setState({ethData: JSON.parse(cachedEthData)})
      console.log(JSON.parse(cachedEthData))
      this.setState(prevState => {
        return {apiResponded: prevState.apiResponded + 1}
      })
    } else {
      console.log("Empty ethdata cache, getting new data.")
      this.getEthPrice()
    }
    if (cachedAddressInfo) {
      this.setState({addressInfo: JSON.parse(cachedAddressInfo)})
      console.log(JSON.parse(cachedAddressInfo))
      this.setState(prevState => {
        return {apiResponded: prevState.apiResponded + 1}
      })
    } else {
      console.log("Empty addressinfo cache, getting new data.")
      this.getAddressinfo()
    }
  }

  getEthPrice() {
    axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/')
      .then(res => {
        let ethData = res.data[0];
        console.log("Coinmarketcap responded.")
        this.setState({ ethData: { 'price': ethData['price_usd'], 'change': ethData['percent_change_7d'] } })
        this.setState(prevState => {
          return {apiResponded: prevState.apiResponded + 1}
        })
        localStorage.setItem("ethData", JSON.stringify({ 'price': ethData['price_usd'], 'change': ethData['percent_change_7d'] }))
        localStorage.setItem("lastUpdate", Math.round((new Date()).getTime() / 1000))
      })
  }

  getAddressinfo() {
    let address = options.ethereumAddress;
    axios.get('https://api.ethplorer.io/getAddressInfo/' + address + '/?apiKey=freekey')
      .then(res => {
        console.log("Ethplorer responded.")
        this.setState({addressInfo: res.data})
        this.setState(prevState => {
          return {apiResponded: prevState.apiResponded + 1}
        })
        localStorage.setItem("addressInfo", JSON.stringify(res.data))
        localStorage.setItem("lastUpdate", Math.round((new Date()).getTime() / 1000))
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

  render() {
    return (
      <div className="w-50 mx-auto">
        <h1>Wallet stats</h1>
        {(this.state.apiResponded === this.state.totalApi) ?
          (<WalletTable ethData={this.state.ethData} addressInfo={this.state.addressInfo}/>):
          (<LoadingBar current={this.state.apiResponded} max={this.state.totalApi}/>)}
      </div>
    );
  }
}

export default EthereumDashboard;