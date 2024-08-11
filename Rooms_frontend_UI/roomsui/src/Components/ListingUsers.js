import ListingComponent from './ListingComponent'

const ListingUser = (props) => {
    return (
            <div className='listinguser'>
                {props.users.length !== 0 ? (
                    props?.users.map((user) => {
                        return (<div onClick={ () =>  props.fetchBills(user.id)} key={user.id} className = 'user_comp' >
                            <ListingComponent handleVacate = {props.handleVacate} fetchBills = {props.fetchBills} user={user} />
                        </div>)
                    })
                ) : 
                <div>
                    No active Users
                </div> 
                }
                {}
            </div>
            

    )
}

export default ListingUser;