const App = () => {
  // Header component
  const Header = (props) => {
    return (
      <>
        <h1>
          {props.name}
        </h1>
      </>
    )
  }

  const Part = (props) => {
    return (
      <>
        <p>
          {props.id} {props.ex}
        </p>
      </>
    )
  }

  // Content component
  const Content = (props) => {
    return (
      <>
        <Part id = {props.parts[0].name} ex = {props.parts[0].exercises}/> 
        <Part id = {props.parts[1].name} ex = {props.parts[1].exercises}/> 
        <Part id = {props.parts[2].name} ex = {props.parts[2].exercises}/> 
      </>
    )
  }

  // Total component
  const Total = (props) => {
    return (
      <>
        <p>
          Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}
        </p>
      </>
    )
  }

  
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </>
  )
}

export default App