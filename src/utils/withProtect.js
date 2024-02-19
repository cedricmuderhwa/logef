import { useDispatch } from "react-redux"
import { Navigate } from "react-router-dom"
import { authUser } from "../redux/slices/sessions"

export const PrivateRoute = ({ children }) => {
    
    const dispatch = useDispatch()

    const isAuthenticated = async () => {
        const auth = await dispatch(authUser())
        if(auth?.payload) {
            return true
        } 
        return false
    }
        
    if (isAuthenticated()) {
      return children
    }
      
    return <Navigate to="/login?expired=true" />
}

