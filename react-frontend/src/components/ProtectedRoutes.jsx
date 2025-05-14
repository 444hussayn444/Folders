import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


function ProtectedCompontent(){
    const user = JSON.parse(localStorage.getItem("user"))
    return user?.userdata?.token ? <Outlet/> : <Navigate to="/authantication/login"/>
}

export default ProtectedCompontent;