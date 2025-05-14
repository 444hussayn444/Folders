import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import LOGO from "./assets/img.png";
import "./styles/nav.css";
import { IoIosSearch } from "react-icons/io";
import { IoIosMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { CiShoppingCart } from "react-icons/ci";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, get_quantity } from "../redux/slices/CaritemsSlice";
const Navbar = () => {
  const [theme, setTheme] = useState("dark");
  const [realQuantity, setRealQuantiy] = useState(0);
  const { cartItems, user_quantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(get_quantity());
    setRealQuantiy(user_quantity);
  }, [cartItems, user]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handelTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [token, setToken] = useState(user?.userdata?.token);

  useEffect(() => {
    if (user) {
      setToken(user?.userdata?.token);
    } else {
      console.log("no user found");
    }
  }, [user, token]);

  function handel_open() {
    setIsOpen((prev) => !prev);
  }
  function handel_searhc() {
    setOpenSearch((prev) => !prev);
  }
  function logout() {
    localStorage.clear();
    setToken("");
    clearCart();
    setTimeout(() => {
      window.location.href = "/authantication/login";
    }, 500);
  }

  function handelSearchChange(e) {
    setSearch(e.target.value);
  }

  return (
    <>
      <div className="nav-container">
        <div className="left-section">
          <img src={LOGO} alt="img-logo" className="logoImg" />
          <ul className="links">
            <NavLink
              className={({ isActive }) => (isActive ? "link active" : "link")}
              to="/"
            >
              Home
            </NavLink>
            {/* it should be li to do list style none*/}
            <NavLink
              className={({ isActive }) => (isActive ? "link active" : "link")}
              to="/predict"
            >
              Predict
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "link active" : "link")}
              to="/pharmacy"
            >
              Pharmacy
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "link active" : "link")}
              to="/Chat-bot
"
            >
              Chat-bot
            </NavLink>
          </ul>
        </div>
        <div className="auth">
          {token ? (
            <Link to="/authantication" onClick={logout} className="authan">
              Log Out
            </Link>
          ) : (
            <Link to="/authantication" className="authan">
              Sign In
            </Link>
          )}
        </div>
        <div className="right-section">
          <input
            value={search}
            onChange={handelSearchChange}
            type="search"
            className={openSearch ? "search-bar opened" : "search-bar"}
            placeholder="Search"
          />
          <Link
            to="/pharmacy"
            state={{ state: search }}
            className={openSearch ? "search opened" : "search"}
          >
            Search
          </Link>
          <IoIosSearch
            onClick={handel_searhc}
            className="search-icon cartIcon"
          />
          <Link className="cart" to="/cart">
            <CiShoppingCart className="search-icon cartIcon" />
            <span className="quantity">{realQuantity}</span>
          </Link>
          <button className="theme-color" onClick={handelTheme}>
            {localStorage.getItem("theme") === "light" ? (
              <MdLightMode className="theme-icon" />
            ) : (
              <MdDarkMode className="theme-icon" />
            )}
          </button>
        </div>

        {isOpen && <IoIosMenu className="menu" onClick={handel_open} /> ? (
          <>
            <div
              className="respo"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginRight: "20px",
              }}
            >
              <Link className="cart" to="/cart">
                <CiShoppingCart className="search-icon cartIcon" />
                <span className="quantity">{realQuantity}</span>
              </Link>
              <button className="theme-color" onClick={handelTheme}>
                {localStorage.getItem("theme") === "light" ? (
                  <MdLightMode className="theme-icon" />
                ) : (
                  <MdDarkMode className="theme-icon" />
                )}
              </button>
            </div>
            <IoMdClose className="menu" onClick={handel_open} />
          </>
        ) : (
          <>
            <div
              className="respo"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginRight: "20px",
              }}
            >
              <Link className="cart" to="/cart">
                <CiShoppingCart className="search-icon cartIcon" />
                <span className="quantity">
                  {realQuantity ? realQuantity : 0}
                </span>
              </Link>
              <button className="theme-color" onClick={handelTheme}>
                {localStorage.getItem("theme") === "light" ? (
                  <MdLightMode className="theme-icon" />
                ) : (
                  <MdDarkMode className="theme-icon" />
                )}
              </button>
            </div>
            <IoIosMenu className="menu" onClick={handel_open} />
          </>
        )}
      </div>
      <div className={isOpen ? "right-section-res open" : "right-section-res"}>
        {isOpen ? (
          <>
            <ul className="links">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
                to="/"
              >
                Home
              </NavLink>
              {/* it should be li to do list style none*/}
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
                to="/predict"
              >
                Predict
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
                to="/pharmacy"
              >
                Pharmacy
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
                to="/chat-bot"
              >
                Chat-bot
              </NavLink>
            </ul>
            <div className="inputs is">
              <input
                value={search}
                onChange={handelSearchChange}
                type="search"
                className="search-bars"
                placeholder="Search"
              />
              <Link
                to="/pharmacy"
                state={{ state: search }}
                className="searchs"
              >
                Search
              </Link>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Navbar;
