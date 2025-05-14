import {
  prediction_failure,
  prediction_success,
  prediction_start,
} from "../slices/predictionSlice";
import { toast } from "react-toastify";
import {
  register_start,
  register_faliure,
  register_success,
  login_start,
  login_faliure,
  login_success,
} from "../slices/usersSlice";
import { add_to_cart, decrease } from "../slices/CaritemsSlice";

import { f_failure, f_start, f_success } from "../slices/medicineSlice";

const API = "http://127.0.0.1:5000";

async function get_prediction(dispatch, symptoms) {
  console.log(symptoms);
  try {
    dispatch(prediction_start());
    const response = await fetch(`${API}/predict`, {
      method: "POST",
      body: JSON.stringify(symptoms),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const data = await response.json();
      console.log(data, symptoms);
      console.log(data);
      toast.error(
        data.error,
        localStorage.getItem("theme") === "dark" && {
          style: {
            backgroundColor: "#333",
            color: "white",
          },
        }
      );
    }
    const data = await response.json();
    toast.success(
      "Done.",
      localStorage.getItem("theme") === "dark" && {
        style: {
          backgroundColor: "#333",
          color: "white",
        },
      }
    );
    dispatch(prediction_success(data));
  } catch (error) {
    console.log(error);
    dispatch(prediction_failure(error));
    toast.error(
      error,
      localStorage.getItem("theme") === "dark" && {
        style: {
          backgroundColor: "#333",
          color: "white",
        },
      }
    );
  }
}

export async function REGISTER(dispatch, formData) {
  try {
    dispatch(register_start());
    const response = await fetch(`${API}/register`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.log(data);
      toast.error(data.Error, {
        style: {
          backgroundColor: "#333",
          color: "white",
        },
      });
      dispatch(register_faliure(data.error));
    } else {
      dispatch(register_success(data));
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/predict";
    }

    console.log(data);
  } catch (error) {
    dispatch(register_faliure(error));
    console.log(error);
  }
}

export async function LOGIN(dispatch, formData) {
  try {
    dispatch(login_start());
    const response = await fetch(`${API}/login`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const data = await response.json();
      console.log(data.error);
      toast.error(
        data.Error,
        localStorage.getItem("theme") === "dark" && {
          style: {
            backgroundColor: "#333",
            color: "white",
          },
        }
      );
      dispatch(login_faliure(data.error));
    } else {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      dispatch(login_success(data));
      window.location.href = "/predict";
      console.log(data);
    }
  } catch (error) {
    dispatch(login_faliure(error));
    console.log(error);
  }
}

export async function PRODUCTS(dispatch) {
  dispatch(f_start());
  try {
    const userToken = JSON.parse(localStorage.getItem("user"));

    const formatedToken = userToken.userdata.token;
    console.log("token: ", formatedToken);

    const response = await fetch(`${API}/get-products`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + formatedToken,
      },
    });
    if (!response.ok) {
      const data = await response.json();
      dispatch(f_failure(data.Error));
      toast.error(
        data.Error,
        localStorage.getItem("theme") === "dark" && {
          style: {
            backgroundColor: "#333",
            color: "white",
          },
        }
      );
    } else {
      const data = await response.json();
      console.log(data);
      dispatch(f_success(data));
    }
  } catch (error) {
    dispatch(f_failure(error));
    console.log(error);
  }
}

export function addtocart(dispatch, product) {
  try {
    console.log("product", product);
    if (product) {
      dispatch(add_to_cart(product));
    }
  } catch (error) {
    console.log(error);
  }
}

export function decreaseQuan(dispatch, product) {
  try {
    if (product) {
      dispatch(decrease(product));
    }
  } catch (error) {
    console.log(error);
  }
}
export const confirmCart = async (patient_id, items) => {
  try {
    const response = await fetch("http://localhost:5000/addTocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patient_id, items }),
    });
    const data = await response.json();
    console.log(data)
    toast.success("Cart confirmed!", {
      style: localStorage.getItem("theme") === "dark" && {
        backgroundColor: "#333",
        color: "white",
      },
    });

  } catch (error) {
    toast.error("Error confirming cart!", {
      style: localStorage.getItem("theme") === "dark" && {
        backgroundColor: "#333",
        color: "white",
      },
    });
  }
};

export default get_prediction;
