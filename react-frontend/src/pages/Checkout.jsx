import React, { useEffect, useState } from "react";
import "./styles/check.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const Checkout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const Patient_ID = user?.userdata?.id;
  const [formData, setFormData] = useState({
    name: "",
    Email: "",
    Phone: null,
    Address: "",
    Patient_ID,
  });

  console.log(formData);

  async function send_data(Patient_ID) {
    try {
      const response = await fetch("http://127.0.0.1:5000/check-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Patient_ID: Patient_ID }),
      });
      if (!response.ok) {
        const erro_data = await response.json();
        console.log(erro_data.Error);
      } else {
        const data = await response.json();
        toast.success(
          "done",
          localStorage.getItem("user") && {
            style: {
              backgroundColor: "#333",
              color: "white",
            },
          }
        );
        setTimeout(() => {
          window.location.href = "/cart";
        }, 2000);

        console.log(data.Success);
      }
    } catch (error) {
      console.log("Error from check out", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const [loading, setLoading] = useState(false);
  const h = async () => {
    if (formData) {
      setLoading(true);
      await send_data(Patient_ID);
      toast.success("Payment Successed");
      setTimeout(() => {
        window.location.reload();
        window.location.href = "/cart";
      }, 2000);

      setLoading(false);

      console.log("sent");
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>Checkout</h2>

        <form onSubmit={(e) => handleSubmit(e)}>
          <h3>Patient Information</h3>
          <input
            type="text"
            name="name"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Name"
            value={formData.name}
          />
          <input
            type="email"
            name="Email"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Email: e.target.value }))
            }
            placeholder="Email"
            value={formData.Email}
          />
          <input
            type="tel"
            name="Phone"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Phone: e.target.value }))
            }
            placeholder="Phone"
            value={formData.Phone}
          />
          <input
            type="text"
            name="Address"
            value={formData.Address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Address: e.target.value }))
            }
            placeholder="Address"
          />

          <h3>Payment Method</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirction: "row",
            }}
          >
            <label htmlFor="credit">
              <input type="radio" value="credit" name="credit" />
              Credit Card
            </label>
            <label>
              <input type="radio" value="cash" name="credit" />
              Cash on Delivery
            </label>
          </div>

          <div className="checkout-summary">
            <Link onClick={h} type="submit" className="submit-btn">
              {loading ? "Loading" : "Complete Order"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
