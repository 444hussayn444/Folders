import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Predict from "./pages/Predict.jsx";
import ShowNavBar from "./components/HideNavbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./index.css";
import Checkout from "./pages/Checkout"
import Authantication from "./components/Authantication";
// import Pharmacy from "./pages/pharmacy/Pharmacy.jsx";
import ProtectedCompontent from "./components/ProtectedRoutes";
import Cart from "./pages/Cart.jsx";
import { Suspense } from "react";
import ChatBox from "./pages/Chatbot.jsx";
const Pharmacy = React.lazy(() => import("././pages/pharmacy/Pharmacy.jsx"));
function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <ShowNavBar  />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedCompontent />}>
          <Route
            path="/pharmacy"
            element={
              <Suspense
                fallback={
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
                    Loading...
                  </p>
                }
              >
                <Pharmacy />
              </Suspense>
            }
          />
          <Route path="/predict" element={<Predict />} />
          <Route path="/chat-bot" element={<ChatBox />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/check-out" element={<Checkout/>}/>
        </Route>
        <Route
          path="/authantication"
          element={
            !user?.userdata?.token ? <Authantication /> : <Navigate to="/" />
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
