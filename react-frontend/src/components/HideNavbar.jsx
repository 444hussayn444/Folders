import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";


function ShowNavBar({quantity}){
    const location = useLocation()
  
    return  location.pathname === "/authantication/register" || location.pathname === "/authantication/login" || location.pathname === "/authantication"? <Outlet /> : <Navbar quantity={quantity}/>


}

export default ShowNavBar