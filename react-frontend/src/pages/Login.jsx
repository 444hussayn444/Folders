import React from "react";
import "../components/styles/auth.css";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN } from "../redux/actions/actions";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const { user, data_loading, data_error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handelRegister = async () => {
    await LOGIN(dispatch, formData);
    setFormData("");
  };

  if (data_error) {
    toast.error(data_error, {
      style: {
        backgroundColor: "#333",
        color: "white",
      },
    });
  }

  return (
    <div className="loginPage">
      <form className="form-auth" onSubmit={handleSubmit}>
        <input
          className="inputs"
          type="Email"
          placeholder="Enter Your Email"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, Email: e.target.value }))
          }
        />
        <input
          className="inputs"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, Password: e.target.value }))
          }
        />
        <button onClick={handelRegister} className="submit" type="submit">
          {data_loading ? "Loading.." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
