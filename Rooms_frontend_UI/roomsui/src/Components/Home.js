import { useEffect, useState } from "react";
import axios from 'axios'
import ListingUser from "./ListingUsers";
import ListingBills from "./ListingBills";
import CreatBillForm from "./CreateBillForm";
import VacateModal from "./VacateModal";
import { useCookies } from 'react-cookie'
import Header from "./Header";
const Home = () => {
    const [cookie, removeCookie] = useCookies(['token'])
    const [users, setUsers] = useState([])
    const [activeUsers, setActiveUsers] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [flagBills, setFlagBills] = useState(false)
    const [flagBillModal, setFlagBillModal] = useState(true)
    const [vacateData, setVacateData] = useState({})
    const [bills, setBills] = useState([])


    useEffect(() => {
        const listUsers = users.filter((user) => user.status === 'active')
        setActiveUsers(listUsers)
    },[users])

    useEffect(() => {
        const user = cookie?.token?.user
        setCurrentUser(user)
    },[cookie?.token?.user])

    useEffect(() => {
        const url = `${process.env.REACT_APP_BACKEND_DOMAIN}/users`
        axios.get(url)
        .then(result => {
            setUsers(result.data)
        })
        .catch(error => {
            console.log(error.message)
        })
    }, [vacateData])

    useEffect(() => {
        const url = `${process.env.REACT_APP_BACKEND_DOMAIN}/users`
        axios.get(url)
        .then(result => {
            setUsers(result.data)
        })
        .catch(error => {
            console.log(error.message)
        })
    }, [])

    const fetchBills =  (userId) => {
        const url = `${process.env.REACT_APP_BACKEND_DOMAIN}/users/bills?id=${userId}`
        axios.get(url)
        .then(result => {
            setFlagBills(true)
            setBills(result.data)
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    const handleLogout = () => {
        const url = `${process.env.REACT_APP_BACKEND_DOMAIN}/logout`
        const data = {
            userId : currentUser.id
        }
        console.log(url, data)
        axios.post(url, data)
        .then(result => {
            removeCookie('token')
        })

    }

    const handleBillModal = () => {
        setFlagBillModal(true)
        const modal = document.querySelector("#modal");
        modal.showModal();
    }

    const handleBillModalClose = () => {
        const modal = document.querySelector("#modal");
        modal.close();
    }

    const handlePay = async (billId) => {
        const data = {
            billId: billId
        }
        const url = `${process.env.REACT_APP_BACKEND_DOMAIN}/bills/pay`

        const result = await axios.put(url, data);
        return result.data;
    }
    const handleVacate = (userId) => {
        const url = `${process.env.REACT_APP_BACKEND_DOMAIN}/users/vacate`
        const data = {
            userId: userId
        }

        axios.put(url, data)
        .then(result => {
            setVacateData(result.data)
            setFlagBillModal(false)
            const modal = document.querySelector("#modal");
            modal.showModal();
        })
        .catch(error => {
            console.log(error)
        })
    }

    const handleCreateForm = async (formData) => {
        const url = `${process.env.REACT_APP_BACKEND_DOMAIN}/bills`
        axios.post(url, formData)
        .then(result => {
            if(result.data.Error){
                window.alert(result.data.Error)
            }else{
                handleBillModalClose()
            }
            
        })
        .catch(error => {
            console.log(error.message, 'uiuiui')
        })
    }
    return (
        <div>
            <Header handleBillModal = {handleBillModal} handleLogout = {handleLogout} />
            <div className="listingWrap">
            <ListingUser users={activeUsers} handleVacate ={handleVacate} fetchBills = {fetchBills} />
            {flagBills && (
                <ListingBills bills = {bills} setBills = {setBills} handlePay = {handlePay}  />
            )}
            </div>
            

            <dialog id="modal">
                {flagBillModal? (
                    <CreatBillForm handleCreateForm = {handleCreateForm} users={activeUsers} />
                ) : (
                    < VacateModal data = {vacateData} />
                ) } 
                <button id="closeModal" onClick={handleBillModalClose} >X</button>
            </dialog>
        </div>
        
        
    )
}

export default Home;