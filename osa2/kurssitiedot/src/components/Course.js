const Part = (props) => {
    return (
      <>
        <p>
          {props.id} {props.ex}
        </p>
      </>
    )
  }
  
  
  const Total = ({parts}) => {
    const initialValue = 0
    const total = parts.reduce((s,p) => s + p.exercises, 0)
  
    return (
      <>
        <b>
          Number of exercises {total}
        </b>
      </>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(p => <Part key={p.id} id = {p.name} ex = {p.exercises}/>)}
      </div>
    )
  }
  
  const Header = (props) => {
    return (
      <>
        <h2>
          {props.name}
        </h2>
      </>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header name={course.name}/>
        <div>
         <Content parts={course.parts}/>
        </div>
        <div>
          <Total parts={course.parts}/>
        </div>
      </div>
    )
  }
  
  export default Course