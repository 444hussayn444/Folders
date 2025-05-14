import "./styles/auth.css";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
function Authantication() {
  return (
    <div className="auth-container">
      <div className="titleauth">
        <h2>Login Or register - Health Care Center</h2>
      </div>
      <div className="options">
        <Link className="auth-links" to="login">
          Login
        </Link>
        <Link className="auth-links" to="register">
          Regiser
        </Link>
      </div>
      <Outlet />
    </div>
  );
}

export default Authantication;
