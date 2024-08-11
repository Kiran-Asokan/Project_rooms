

const VacateModal = (props) => {
    return (
        <div>
            <span>
                Security Amount Paid : {props.data.securityAmountPaid}
            </span>
            <span>
                Total bills paid (Amount) : {props.data.paidAmount}
            </span>
            <span>
                Total due (Amount) : {props.data.pendingAmount}
            </span>

            <h4>
                Total Payable Amount : {props.data.pendingAmount}
            </h4>
            <h4>
                Refund Amount : {props.data.refuntAmount}
            </h4>
        </div>
    )
}

export default VacateModal;