import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryInput = ({findCountry, change}) => {
  return (
    <>
      find countries <input value={findCountry}
      onChange={change}/>
    </>
  )
}

const Weather = ({c}) => {
  return (
    <>
      <h2>Weather in {c.capital[0]}</h2>
    </>
  )
}

const ShowCountryInfo = ({c}) => {
  const langsArray = Object.entries(c.languages)
  return (
    <>
      <h2>{c.name.common}</h2>
      <div>Capital: {c.capital[0]}</div>
      <div>Area code: {c.area}</div>
      <br></br>
      <div><b>Languages: </b></div>
      <ul>
      {langsArray.map(lang => <li key={lang[0]}>{lang[1]}</li>)}
      </ul>
      <img src={c.flags.png} alt="flag"/>
  </>
  )
}

const Button = ({handleSelectCountry}) => {
  return (
    <button onClick={handleSelectCountry}>show</button>
  )
}

const CountryInfo = ({countries, findCountry}) => {
  const [displayCountry, setDisplayCountry] = useState(null)
  if ( findCountry === '' ) {
    return (<></>)
  }
  
  const matchedCountry = countries.find(({name}) => name.common === displayCountry);

  const handleSelectCountry = (c) => {
    setDisplayCountry(selected => {
      return selected !== c.name.common ? c.name.common : null
    })
  }

  if ( countries.length > 10 ) {
    return (<div>Too many matches, specify another filter</div>)

  } else if ( countries.length > 1 ) {
    return (
      <>
        <ul>
        {countries.map(c => <li key={c.name.common}>{c.name.common} <Button handleSelectCountry={
                              () => handleSelectCountry(c)
                              }/></li>)}
        </ul>
        { matchedCountry && <ShowCountryInfo c={matchedCountry}/> }
      </>
    )  
  } else if ( countries.length === 1 ) {
    // Display all info
    const c = countries[0]
    // Langs
    return (
      <ShowCountryInfo c={c}/>
    )
  }
}

const App = () => {

  const [countries, setCountries] = useState([])
  const [findCountry, setFindCountry] = useState('')

  const [showAnything, setShowAnything] = useState(false)


  const handleCountryFindChange = (event) => {
    setFindCountry(event.target.value)
    setShowAnything(true)
  }

  useEffect(()=> {
    axios
    .get('https://restcountries.com/v3.1/all')
    .then(response => {
      setCountries(response.data)
    })
  })
  
  const countriesToShow = showAnything ?  countries.filter(c => 
                                          c.name.common.toLowerCase()
                                          .includes(findCountry.toLowerCase())) 
                                          : []

  return (
    <div>
      <CountryInput findCountry={findCountry} change={handleCountryFindChange}/>
      <CountryInfo countries={countriesToShow} findCountry={findCountry}/>
    </div>
  )
}

export default App