const FilterForm = (props) => {
    return(
    <div>
      filter: 
      <input value={props.filterWord} onChange={props.handleFilterChange}/>
    </div>
    )
  }

  export default FilterForm