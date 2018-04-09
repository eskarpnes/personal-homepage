import React, { Component } from 'react';
import roundTo from 'round-to'

class WalletTable extends Component {

  calculatePortfolioWorth() {
    let totalWorth = 0
    totalWorth += this.props.ethData['price']*this.props.addressInfo.ETH.balance
    for (let i = 0; i<this.props.addressInfo.tokens.length; i++ ) {
      let token = this.props.addressInfo.tokens[i]
      let balance = token.balance/10**token.tokenInfo.decimals
      let price = token.tokenInfo.price.rate
      totalWorth += balance*price
    }
    totalWorth = roundTo(totalWorth, 2)
    let worthInEth = roundTo(totalWorth/this.props.ethData['price'], 2)
    return {totalWorth: totalWorth, worthInEth: worthInEth}
  }

  render() {
    let portfolio = this.calculatePortfolioWorth()
    return(
      <div>
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
            <td>{this.props.addressInfo.ETH.balance}</td>
            <td>${this.props.ethData['price']}</td>
            <td>${roundTo(this.props.addressInfo.ETH.balance*this.props.ethData['price'], 2)}</td>
          </tr>
          {this.props.addressInfo.tokens.map((token,idx) =>
            <tr>
              <th scope="row">{token.tokenInfo.name}</th>
              <td>{token.balance/10**token.tokenInfo.decimals} {token.tokenInfo.symbol}</td>
              <td>${token.tokenInfo.price.rate}</td>
              <td>${roundTo(token.balance/10**token.tokenInfo.decimals*token.tokenInfo.price.rate, 2)}</td>
            </tr>
          )}
          <tr>
            <th scope="row">Total</th>
            <td>{portfolio.worthInEth} eth</td>
            <td></td>
            <td>${portfolio.totalWorth}</td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default WalletTable;