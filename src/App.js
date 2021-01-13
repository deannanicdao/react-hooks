import { useEffect, useState } from 'react'  // destructure useState from react
import "./App.css";
import currencies from "./supported-currencies.json"
import bcData from "./bitcoin-data.json"
import {Line, Chart} from 'react-chartjs-2'

// class App extends React.Component {
//   state = {
//     currency: "AUD"
//   }
// }

function App() {
  const [currency, setCurrency] = useState("AUD")
  const [bitcoinData, setBitcoinData] = useState(bcData)

  Chart.defaults.global.defaultFontColor = "#000"
  Chart.defaults.global.defaultFontSize = 16

  const chartData = {
      labels: Object.keys(bitcoinData.bpi),
      datasets: [
        {
          label: "Bitcoin",
          data: Object.values(bitcoinData.bpi)
        }
      ]
  }

  const onCurrencyChange = (event) => {
      setCurrency(event.target.value)
  }

  const fetchData = () => {
    fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=${currency}`)
      .then(res => res.json())
      .then(data => setBitcoinData(data))
      .catch(e => console.log(e))
  }

  // componentDidUpdate - fires after every render, when any state changes
  useEffect(() => { 
    console.log('component updated')
  })

  // componentDidMount - fires after first read only
  useEffect(() => { 
    console.log('component mounted')
    fetchData()
  }, [])

  useEffect(() => {
    console.log('currency changed')
    fetchData()
  }, [currency])    // only trigger this affect when currency is changed, if bitcoinData is in the dependency array it will create an infinite loop

  return (
    <div className="App">
      <p>
        Select currency:
        <select value={currency} onChange={onCurrencyChange}>
          {
            currencies.map((obj, index) => 
              <option key={index} value={obj.currency}>{obj.country}</option>
            )
          }
        </select>

        <h1>Bitcoin Data for {currency}</h1>
        {
          // Object.keys(bitcoinData.bpi).map(date =>
          //       <div key={date}> Date: {date} Value: {bitcoinData.bpi[date]} </div>
          // )
        }
        <div>
          <Line data={chartData} height={250}/>
        </div>

      </p>
    </div>
  )
}

export default App;
