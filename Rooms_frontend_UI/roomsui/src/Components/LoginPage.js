import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import '../Style/Global.css'

const LoginPage = () => {
    const [cookie,setCookie] = useCookies(['token'])
    const [errorFlag, setErrorFlag] = useState(false)
    const [showMessage, setShowMessage] = useState("")
    const [registerPage, setRegisterPage] = useState(true)
    const [formData, setFormData] = useState({
        ...(registerPage && {
            name: '',
            role: 'admin',
            phone: '',
            confirmPassword: '',
            status: 'active',
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
                redirectUrl='/'
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
                }
                
            }
            
           
        } catch (error) {
            console.log(error.message)
        }
        
    }
    return (
        <div className='formwrap'>
            <form onSubmit={handleOnSubmit} className='loginform'>
                <div className='loginformfields'>
                    {registerPage && (
                        <>
                            <div  className='inputWrap'>
                                <label>
                                    Name:
                                </label>
                                <input className='input' type="text" name="name" onChange = {(e) => setFormData({...formData, name:e.target.value })} />
                            </div>
                            <div  className='inputWrap'>
                                <label>
                                    Role:
                                </label>
                                <select className='inputselect' onChange = {(e) => setFormData({...formData, role: e.target.value })} name = 'role'>
                                    <option value="admin">Admin</option>
                                    <option value="tenant">Tenant</option>
                                </select>
                            </div>
                            <div  className='inputWrap'>
                                <label>
                                    Phone:
                                </label>
                                <input className='input' type="text" name="phone" onChange = {(e) => setFormData({...formData, phone: e.target.value })}/>
                            </div>
                        </>
                    )}
                    
                    <div className='inputWrap'>
                        <label>
                            email:
                        </label>
                        <input className='input' type="email" name="email" onChange = {(e) => setFormData({...formData, email: e.target.value })}/>
                        
                    </div>
                    <div className='inputWrap'>
                        <label>
                            password:
                        </label>
                        <input className='input' type="password" name="password" onChange = {(e) => setFormData({...formData, password: e.target.value })}/>
                    </div>
                    {registerPage && (
                        <div className='inputWrap'>
                            <label>
                                Confirm Password:
                            </label>
                            <input className='input' type="password" name="confirmPassword" onChange = {(e) => setFormData({...formData, confirmPassword: e.target.value })}/>
                        </div>
                    )} 
                    <div>
                        <button className='input' type = 'submit' > {registerPage ? 'Sign Up': 'Sign In'} </button>
                    </div>
                </div>
                
                <div className={errorFlag ? 'errorSpan': 'successSpan'} >
                    <span>{showMessage}</span>
                </div>
                <div>
                    {registerPage ? (
                        <span> Already have an Account? <Link to="/login">Sign in</Link></span>
                    ): (
                        <span> New Here? <Link to="/register">Create Account</Link></span> 
                    )} 
                </div>
            </form>
        </div>
        
        
    )
}

export default LoginPage