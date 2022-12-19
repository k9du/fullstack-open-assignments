import { useState, useEffect } from 'react'
import personService from './services/persons'

const Person = ({name, number}) => {
  return (
    <>{name} {number} </>
  )
}

const Filter = ({newFilter, change}) => {
  return (
    <>
      filter shows with <input value={newFilter} 
                        onChange={change}/>
    </>
  )
}

const PersonForm = ({addName, newName, changeName, newNumber, changeNumber, setMessage} ) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input 
        value={newName}
        onChange={changeName}/>
      </div>
      <div>
        number: <input
        value={newNumber}
        onChange={changeNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className = 'ok'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className = 'error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [showAll, setShowAll] = useState(true)
  
  
  useEffect(() => {
    personService
    .getAll()
    .then(response => {
      setPersons(response.data)
    })
  }, [])

  // Delete
  const handleDelete = (person) => {
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
      // Poista kannasta täs
      personService
      .deleteId(person.id)

      setSuccessMessage (
        `Deleted ${person.name} from the phonebook`
      )

      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      
    }
  }

  // Update
  const handleUpdate = (person, newNumber) => {
    if (window.confirm(`${person.name} is already added to the phonebook. Do you want to replace the old number with a new one?`)) {
      const changedPerson = {...person, number: newNumber}
      personService
      .update(person.id, changedPerson)
      .then(response => {
        setPersons(persons.map(p => p.id !== person.id ? p : response.data))
        setSuccessMessage (
          `Updated ${person.name}'s number`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      }).catch( 
        error => {
          console.log('error caught')
          setErrorMessage (
            `Person ${person.name} has already been deleted from the phonebook`
          )
          setTimeout(() =>{
            setErrorMessage(null)
          }, 3500)
        }
      )
    }
  }

  const addName = (event) => {
    event.preventDefault()
    
    const oldInfo = persons.find(n => n.name === newName)
    if ( oldInfo !== undefined ) {
      handleUpdate(oldInfo, newNumber)
      setNewName('')
      setNewNumber('')
      return
    }
    
    const personObject = {
      name: newName,
      number: newNumber
    }
    
    // Update json file
    personService
    .create(personObject)
    .then(response => {
      setPersons(persons.concat(response.data))
      setSuccessMessage (
        `Added ${personObject.name}`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    })

    // setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const namesToShow = showAll ? persons : persons.filter(s => s.name.toLowerCase()
                      .includes(newFilter.toLowerCase()))

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    setShowAll(false)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage}/>
      <ErrorNotification message={errorMessage}/>
      <Filter newFilter={newFilter} change={handleFilterChange} />
      <h2>Add a new number</h2>
      <h2>Numbers</h2>
      <PersonForm addName={addName} newName={newName} changeName={handleNameChange} newNumber={newNumber} changeNumber={handleNumberChange} setMessage={setSuccessMessage}/>
      {namesToShow.map(person => <div key={person.id}> <Person name={person.name} number={person.number}/>
                                 <button type="button" 
                                 onClick={() => handleDelete(person)}> delete </button> </div>)}
    </div>                             
  )

}

export default App