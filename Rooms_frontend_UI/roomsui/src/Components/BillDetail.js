import { useEffect, useState } from "react";


const BillDetail = (props) => {
    const [flagPaid, setFlagPaid] = useState(false)
    const [bill, setBill] = useState(props.bill)
    useEffect(() =>{
        if(props.bill.status === 'paid'){
            setFlagPaid(true)
        }else{
            setFlagPaid(false)
        }
    },[props.bill.status])
    const handleClick = async () => {
        const result = await props.handlePay(props.bill.id)
        setFlagPaid(result.bill.status === 'paid')
        setBill(result.bill)
    }

    return (
        <>
            <div>
                <h5>Ref: {bill.id} </h5> 
                <h3>Amount: {bill.amount}</h3>
                <h5>Status: {bill.status}</h5>
                <h5>Bill Type: {bill.billType} </h5>
            </div>
            <div>
                <button type='button' onClick={handleClick} disabled={flagPaid} >{flagPaid ? 'Paid': 'PayBill'} </button>
            </div>
        </>
    )
}

export default BillDetail;