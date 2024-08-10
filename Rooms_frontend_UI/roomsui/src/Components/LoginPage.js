import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie'


const LoginPage = (props) => {
    const [setCookie] = useCookies(['token'])
    const [errorFlag, setErrorFlag] = useState(false)
    const [showMessage, setShowMessage] = useState("")
    const [registerPage, setRegisterPage] = useState(true)
    const [formData, setFormData] = useState({
        ...(registerPage && {
            name: '',
            role: 'admin',
            phone: '',
            confirmPassword: ''
        }),
        email: '',
        password: ''
      });
    const location = useLocation();

    useEffect(() => {
        setRegisterPage(location.pathname === "/register")
    },[location.pathname])
    
    

    const handleOnSubmit = async (e) =>{
        try {
            e.preventDefault()
            setShowMessage("")
            setErrorFlag(false)
            let url;
            let redirectUrl;
            if(registerPage){
                redirectUrl='/login'
                url = `${process.env.REACT_APP_BACKEND_DOMAIN}/users`
            }else{
                redirectUrl='/home'
                url = `${process.env.REACT_APP_BACKEND_DOMAIN}/login`
            }
            const result = await axios.post(url,formData);
            
            if(result.data.Error){
                setErrorFlag(true)
                setShowMessage(result.data.Error)
            }else{
                setShowMessage(result.data.Message)
                if(!registerPage){
                    setCookie('token', result.data.token)
                    window.location.href = `${redirectUrl}`
                }else{
                    setTimeout(() => {
                        window.location.href = `${redirectUrl}`
                    }, 2000)
                }
                
            }
            
           
        } catch (error) {
            console.log(error.message)
        }
        
    }
    return (
        <form onSubmit={handleOnSubmit} >
            <div>
                {registerPage && (
                    <>
                        <div>
                            <label>
                                Name:
                                <input type="text" name="name" onChange = {(e) => setFormData({...formData, name:e.target.value })} />
                            </label>
                        </div>
                        <div>
                            <label>
                                Role:
                                <select onChange = {(e) => setFormData({...formData, role: e.target.value })} name = 'role'>
                                    <option value="admin">Admin</option>
                                    <option value="tenant">Tenant</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                Phone:
                                <input type="text" name="phone" onChange = {(e) => setFormData({...formData, phone: e.target.value })}/>
                            </label>
                        </div>
                    </>
                )}
                
                <div>
                    <label>
                        email:
                        <input type="email" name="email" onChange = {(e) => setFormData({...formData, email: e.target.value })}/>
                    </label>
                </div>
                <div>
                    <label>
                        password:
                        <input type="password" name="password" onChange = {(e) => setFormData({...formData, password: e.target.value })}/>
                    </label>
                </div>
                {registerPage && (
                    <div>
                        <label>
                            Confirm Password:
                            <input type="password" name="confirmPassword" onChange = {(e) => setFormData({...formData, confirmPassword: e.target.value })}/>
                        </label>
                    </div>
                )} 
            </div>
            <div>
                <button type = 'submit' > {registerPage ? 'Sign Up': 'Sign In'} </button>
            </div>
            <div className={errorFlag ? 'errorSpan': 'successSpan'} >
                <span>{showMessage}</span>
            </div>
        </form>
        
    )
}

export default LoginPage