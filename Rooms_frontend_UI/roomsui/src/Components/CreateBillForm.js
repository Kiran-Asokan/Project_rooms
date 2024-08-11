
import { useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreatBillForm = (props) => {
    console.log(props)
    const [startDate, setStartDate] = useState(new Date());
    const [formData, setFormData] = useState({
        amount:'',
        status: 'pending',
        billType: 'security',
        dueDate: Date.now(),
        userId: props?.users[0]?.id ?? ''

    })
    const handleSubmit = (e) => {
        e.preventDefault()
        props.handleCreateForm(formData)
        
    }

    return (
        <form onSubmit={handleSubmit}>
            <div >
                <div className='inputWrap'>
                    <label>
                        Amount:
                    </label> 
                    <input className='input' type="Text" onChange = {(e) => setFormData({...formData, amount: e.target.value })} name="amount" placeholder="Enter the Bill Amount"/>
                </div>
            
                <div className='inputWrap'>
                    <label>
                        DueDate: 
                    </label>
                    <DatePicker className='inputdate' selected={startDate} onChange={(date) =>{
                            setStartDate(date)
                            setFormData({...formData, dueDate: `${date}` })}
                        } name = 'dueDate' />
                </div>
                <div className='inputWrap'>
                    <label>
                        Status:
                    </label>
                        <select className='inputselect' onChange = {(e) => setFormData({...formData, status: e.target.value })} name = 'status'>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>
                </div>
           
                <div className='inputWrap'>
                    <label>
                        User:
                    </label>
                    <select className='inputselect' onChange = {(e) => setFormData({...formData, userId: e.target.value })}>
                        {props?.users.map((user) => {
                                return <option key={user.id} value ={user.id} > {user.name}</option>
                        })} 
                    </select>
                </div>

                <div className='inputWrap'>
                    <label>
                        Bill Type:
                    </label> 
                    <select className='inputselect' onChange = {(e) => setFormData({...formData, billType: e.target.value })} name = 'billType'>
                        <option value="security">Security</option>
                        <option value="other">Other</option>
                    </select>
                </div>
    
            
            </div>
            <div >
                <button type="submit" >Create Bill</button>
            </div>
        </form>
    )
}

export default CreatBillForm;