import ListingComponent from './ListingComponent'

const ListingUser = (props) => {
    return (
            <div className='listinguser'>
                {props?.users.map((user) => {
                    return (<div onClick={ () =>  props.fetchBills(user.id)} key={user.id} className = 'user_comp' >
                        <ListingComponent handleVacate = {props.handleVacate} fetchBills = {props.fetchBills} user={user} />
                    </div>)
                })}
            </div>
            

    )
}

export default ListingUser;