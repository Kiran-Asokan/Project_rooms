
import BillDetail from "./BillDetail";

const ListingBills = (props) => {
    return (
        <div className="listingbill">
        {props?.bills?.map((bill) =>{
            return (<div key={bill.id}>
                <BillDetail setBills = {props.setBills} handlePay = {props.handlePay} bill={bill} />
            </div>)
        })}
        </div>
    )
}

export default ListingBills;