const Person = (props) => {
    return (
          <li key={props.id}> 
            {props.name} : {props.number} 
            <button onClick={props.deleteThis}> delete me </button> 

          </li>
    )
  }

  export default Person