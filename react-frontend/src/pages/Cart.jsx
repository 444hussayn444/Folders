import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addtocart, decreaseQuan, PRODUCTS } from "../redux/actions/actions.js";
import { confirmCart } from "../redux/actions/actions.js";
import "./styles/cart.css";
import { set_cart_items } from "../redux/slices/CaritemsSlice.js";
import getFromDb from "../redux/slices/getData.js";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, isLoading } = useSelector((state) => state.cart);
  const { medicines } = useSelector((state) => state.medicines);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const patientId = user?.userdata.id;

  useEffect(() => {
    async function fetchData() {
      const data = await getFromDb();
      if (data) {
        dispatch(set_cart_items(data));
      }
    }
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    PRODUCTS(dispatch);
  }, [dispatch]);

  function decreaseQuantity(item) {
    decreaseQuan(dispatch, item);
  }

  function handelAddToCart(item) {
    const updatedCartItems = [...cartItems, item];
    dispatch(set_cart_items(updatedCartItems));
    addtocart(dispatch, item);
  }

  function handelConfirm(patientId, cartItems) {
    confirmCart(patientId, cartItems);
  }
  const grouped = {};

  const displayItems = [];

  cartItems.forEach((cartItem) => {
    const med = medicines?.data?.find(
      (med) => med.Medication_ID === cartItem.Medication_ID
    );
    if (med) {
      if (!grouped[cartItem.Medication_ID]) {
        grouped[cartItem.Medication_ID] = {
          ...med,
          ...cartItem,
        };
      } else {
        grouped[cartItem.Medication_ID].quantity += cartItem.quantity;
      }
    }
  });

  for (let key in grouped) {
    displayItems.push(grouped[key]);
  }
  console.log(displayItems);
  console.log(patientId);
  return (
    <div className="Cart-container">
      <h2 style={{ padding: "20px" }} className="loading">
        All Items - Confirm To See Your Data
      </h2>
      {displayItems?.length > 0 ? (
        displayItems.map((item, index) => (
          <div className="pro" key={index} id={item.Medication_ID}>
            <img src={item["Image URL"]} alt="" />
            <div className="info">
              <p>
                <span className="effects">Name: </span>
                {item["Medicine Name"]}
              </p>
              <p>
                <span className="effects">Side Effects: </span>
                {item["Side_effects"]}
              </p>
              <p style={{ color: "lightgreen" }}>
                <span className="effects">Average Review %: </span>
                {item["Average Review %"]}
              </p>
              <p style={{ color: "gold" }}>
                <span className="effects">Poor Review %: </span>
                {item["Poor Review %"]}
              </p>
            </div>
            <div className="btns">
              <div className="price">100$</div>
              <button className="delete" onClick={() => decreaseQuantity(item)}>
                -
              </button>
              <p className="qunatity">{item?.quantity}</p>
              <button className="delete" onClick={() => handelAddToCart(item)}>
                +
              </button>
            </div>
          </div>
        ))
      ) : (
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "40px",
            padding: "20px",
            textAlign: "center",
            color: "#ccc",
          }}
        >
          Your Cart Is Empty.
        </p>
      )}
      <div className="div">
        <Link
          className="confirm"
          onClick={() => handelConfirm(patientId, cartItems)}
        >
          {isLoading ? "Loading.." : "Confirm Changes"}
        </Link>
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        <Link to="/check-out" className="confirm">
          {isLoading ? "Loading.." : "Check Out"}
        </Link>
      </div>
    </div>
  );
};

export default Cart;
