import '../Style/Global.css'

const Header = (props) => {
    return (
        <div className="headerDiv">
            <div onClick={props.handleBillModal} > Create a bill</div>
            <div onClick={props.handleLogout} > Log out</div>
        </div>
    )
}

export default Header;