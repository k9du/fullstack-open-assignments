import { useState } from 'react'

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function indexOfMax(arr) {
  if (Object.keys(arr).length === 0) {
      return -1;
  }

  let max = arr[0];
  let maxIndex = 0;
  for (let i = 1; i < Object.keys(arr).length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }

  return maxIndex;
}

const MostVotes = ({idx, votes, anecdotes}) => {
  return (
    <div>
      <h1>
        Anecdote with most votes
      </h1>
      <div>
        {anecdotes[idx]}
      </div>
      <div>
        has {votes[idx]} votes
      </div>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [mostVotesIndex, setMostVotesIndex] = useState(0)
  const [mostVotes, setMostVotes] = useState(0)

  // Array for votes

  const handleNextClick = () => {
    setSelected(getRandomInt(0,anecdotes.length-1))
  }
  
  const handleVoteClick = () => {
    const copy = {...votes}
    copy[selected] += 1
    setVotes(copy)
    setMostVotes(copy[indexOfMax(copy)])
    setMostVotesIndex(indexOfMax(copy))
  }
  
  return (
    <div>
      <h1>
      Anecdote of the day
      </h1>

      {anecdotes[selected]}
      <div>
        has {votes[selected]} votes
      </div>
      <div>
        <button onClick={handleVoteClick}>
          vote
        </button>
        <button onClick={handleNextClick}>
          next anecdote
        </button>
      </div>
      <h1>
        Anecdote with most votes
      </h1>
      <div>
        {anecdotes[mostVotesIndex]}
      </div>
      <div>
        has {mostVotes} votes
      </div>
    </div>
  )
}

export default App