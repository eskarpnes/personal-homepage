import React, {Component} from "react"


class Weather extends Component {
  constructor(props) {
    super()
    this.state = {
      temp: -999,
      icon: -1,
      text: 'undefined',
      updated: false
    }
  }

  componentWillMount() {
    let url = 'http://apidev.accuweather.com/currentconditions/v1/261172.json?language=en&apikey=hoArfRosT1215'
    fetch(url).then(res => res.json())
      .then(data => {
        let tmp_icon = data[0]['WeatherIcon'].toString()
        if (tmp_icon.length < 2) { tmp_icon = "0" + tmp_icon }
        this.setState({
          temp: data[0]['Temperature']['Metric']['Value'],
          icon: tmp_icon,
          text: data[0]['WeatherText'],
          updated: true
        })
      })

    console.log(this.state)
  }

  render() {
    if (this.state.updated) {
      let icon_url = 'https://developer.accuweather.com/sites/default/files/' + this.state.icon + '-s.png'
      let css_bg = "url(" + icon_url + ") no-repeat";
      let temp = this.state.temp + '°C'
      document.getElementById('bg').style.background = css_bg;
      return(
        <div className="weather">
          {this.state.text}
          <img src={icon_url} />
          {temp}
        </div>
      )
    } else { return(<p>Loading weather</p>) }
  }
}

export default Weather;
