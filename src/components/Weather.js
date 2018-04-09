import React, {Component} from "react"
import YQL from "yql"

class Weather extends Component {
  componentWillMount() {
    //this.sendYQLRequest()
  }

/*  sendYQLRequest() {
    let query = new YQL("select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='trondheim') and u='c'")
    query.exec(function(err, data) {
      console.log(data)
    })
  }*/

  render() {
    return(
      <div className="weather">

      </div>
    )
  }
}

export default Weather;