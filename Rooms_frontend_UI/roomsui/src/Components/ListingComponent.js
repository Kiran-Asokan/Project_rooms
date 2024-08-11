

const ListingComponent = (props) =>{

    
    const handleClickVacate = (e) => {
        e.stopPropagation()
        props.handleVacate(props.user.id)
    }


    return (
        <div >
            <div>
                <h3>{props.user.name} </h3> 
                <h5>Role: {props.user.role} </h5>
                <h5>Status: {props.user.status} </h5>
            </div>
            <div>
                <button type="button" onClick={handleClickVacate}>Vacate</button>
            </div>
        </div>
    )
}

export default ListingComponent