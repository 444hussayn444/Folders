import React from "react";
import "../components/styles/auth.css";
import { useDispatch, useSelector } from "react-redux";
import { REGISTER } from "../redux/actions/actions";
import { useState } from "react";
import { toast } from "react-toastify";
const Register = () => {
  const [formData, setFormData] = useState({
    First_name: "",
    Last_name: "",
    Birth_Date: null,
    State: "",
    City: "",
    ST_name: "",
    House_number: null,
    Sex: "",
    Email: "",
    Card_number: null,
    Password: "",
  });

  console.log(formData)

  const { user, data_loading, data_error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  console.log(user);
  const handelRegister = async () => {
    await REGISTER(dispatch, formData);
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
    <div className="registerPage">
      <form className="form-auth" onSubmit={handleSubmit}>
        <div className="names  m-x">
          <input
            className="inputs"
            type="text"
            placeholder="Firstname"
            name="First_name"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, First_name: e.target.value }))
            }
          />
        </div>
        <div>
          <input
            className="inputs"
            type="text"
            placeholder="Lastname"
            name="Last_name"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Last_name: e.target.value }))
            }
          />
        </div>
        <div className="age-email m-x">
          <input
            className="inputs"
            placeholder="Email"
            name="Email"
            type="Email"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Email: e.target.value }))
            }
          />  </div>  <div>
          <input
            className="inputs date"
            type="date"
            placeholder="Age"
            name="Birth_Date"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Birth_Date: parseInt(e.target.value) }))
            }
          />
        </div>
        <div className="pass m-x">
          <input
            type="password"
            width={100}
            placeholder="Password"
            className="inputs"
            name="Password"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Password: e.target.value }))
            }
          />
        </div>
        <div className="pass m-x">
          <input
            type="address"
            width={100}
            placeholder="State"
            className="inputs"
            name="State"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, State: e.target.value }))
            }
          />
        </div>
        <div className="pass m-x">
          <input
            type="address"
            width={100}
            placeholder="Street Name"
            className="inputs"
            name="ST_name"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, ST_name: e.target.value }))
            }
          />
        </div>
        <div className="pass m-x">
          <input
            type="number"
            width={100}
            placeholder="House Number"
            className="inputs"
            name="House_number"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, House_number: e.target.value }))
            }
          />
        </div>
        <div className="pass m-x">
          <input
            type="number"
            width={100}
            placeholder="Card Number"
            className="inputs"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Card_number: e.target.value }))
            }
          />
        </div>
        <div className="pass m-x">
          <input
            type="address"
            width={100}
            placeholder="City"
            className="inputs"
            name="City"

            onChange={(e) =>
              setFormData((prev) => ({ ...prev, City: e.target.value }))
            }
          />
        </div>




        <div className="gender m-x">
          <label htmlFor="sex">Male</label>
          <input
            className="inputs"
            type="radio"
            value="male"
            id="male"
            name="Sex"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Sex: e.target.value }))
            }
          />
          <label htmlFor="sex">Female</label>
          <input
            className="inputs"
            type="radio"
            id="female"
            value="female"
            name="Sex"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Sex: e.target.value }))
            }
          />
        </div>
        <button onClick={handelRegister} type="submit" className="submit">
          {data_loading ? "Loading.." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Register;
