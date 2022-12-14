import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return (
  <button onClick={handleClick}>
    {text}
  </button>
  )
}

const StatisticLine = (props) => {
  if ( props.text === 'positive' ) {
    const tmp = props.value*100
    return (
      <tr>
        <td>{props.text}</td>
        <td>{tmp} %</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if ( props.all === 0 ) {
      return (
        <>
          No feedback given
        </>
      )
  }
  return (
    <table>
      <thead>
        <StatisticLine text='good' value={props.good}/>
        <StatisticLine text='neutral' value={props.neutral}/>
        <StatisticLine text='bad' value={props.bad}/>
        <StatisticLine text='all' value={props.all}/>
        <StatisticLine text='average' value={props.average}/>
        <StatisticLine text='positive' value={props.positive}/>
      </thead>
    </table>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  // Total amount of feedbacks
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)
  const [positiveClicks, setPositiveClicks] = useState(0)

  const handleGoodClick = () => {
    setGood(good+1)
    setAll(all+1)
    setTotal(total+1)
    setAverage((total+1)/(all+1))
    setPositiveClicks(positiveClicks+1)
    setPositive(((positiveClicks+1)/(all+1)))
  }

  const handleNeutralClick = () => {
    setNeutral(neutral+1)
    setAll(all+1)
    setTotal(total)
    setAverage(total/(all+1))
    setPositive((positiveClicks/(all+1)))
  }

  const handleBadClick = () => {
    setBad(bad+1)
    setAll(all+1)
    setTotal(total-1)
    setAverage((total-1)/(all+1))
    setPositive((positiveClicks/(all+1)))
  }
  return (
    <div>
      <h2>Give feedback here</h2>
      <br></br>
      <div>
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral'/>
        <Button handleClick={handleBadClick} text='bad'/>
      </div>
      <br></br>
      <h3>Statistics</h3>
      <Statistics all={all} good={good} neutral={neutral} bad={bad} total={total} average={average} positive={positive}/>

    </div>
  )
}

export default App