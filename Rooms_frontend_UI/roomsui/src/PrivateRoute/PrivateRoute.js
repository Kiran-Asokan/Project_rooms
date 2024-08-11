import { useCookies } from 'react-cookie'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {
    const [cookie] = useCookies(['token'])
    return cookie?.token?.token ? children : <Navigate to='/login' />
}

export default PrivateRoute;