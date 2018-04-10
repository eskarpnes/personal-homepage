import React, { Component } from 'react';
import ReactTable from 'react-table'
import "react-table/react-table.css";
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

  getTableRow(_name, _holding, _coin, _price, _value) {
    return {
      name: _name,
      holding: _holding.toString() + " " + _coin,
      price: _price,
      value: _value
    }
  }

  render() {
    let portfolio = this.calculatePortfolioWorth()
    var data = []
    var tokenCount = 1
    var ethSum = 0
    var valueSum = 0

    let ethHolding = roundTo(this.props.addressInfo.ETH.balance, 2)
    let ethPrice = parseFloat(this.props.ethData['price'])
    let ethWorth = roundTo(this.props.addressInfo.ETH.balance*this.props.ethData['price'], 2)
    valueSum += ethWorth
    data.push(this.getTableRow("Ethereum", ethHolding, "ETH", ethPrice, ethWorth))
    console.log(data)

    this.props.addressInfo.tokens.map((token,idx) => {
      let tokenName = token.tokenInfo.name
      let tokenHolding = roundTo(token.balance/10**token.tokenInfo.decimals, 2)
      let tokenCoin = token.tokenInfo.symbol
      let tokenPrice = parseFloat(token.tokenInfo.price.rate)
      let tokenValue = roundTo(token.balance/10**token.tokenInfo.decimals*token.tokenInfo.price.rate, 2)
      valueSum += tokenValue
      data.push(this.getTableRow(tokenName, tokenHolding, tokenCoin, tokenPrice, tokenValue))
      tokenCount ++
    })

    console.log(valueSum)
    console.log(portfolio.worthInEth)

    var columns = [
      {
        Header: 'Name',
        accessor: 'name',
        Footer: 'Total'
      }, {
        Header: 'Holding',
        accessor: 'holding',
        Footer: portfolio.worthInEth + ' ETH'
      }, {
        Header: 'Price',
        accessor: 'price',
        Cell: row => ( '$' + row.value )
      }, {
        Header: 'Value',
        accessor: 'value',
        Cell: row => ( '$' + row.value ),
        Footer: '$' + valueSum
      }
    ]
    return(
      <ReactTable
        data={data}
        columns={columns}
        showPageSizeOptions={false}
        showPageJump={false}
        showPagination={false}
        defaultPageSize={tokenCount}
      />
    )
  }
}

export default WalletTable;
