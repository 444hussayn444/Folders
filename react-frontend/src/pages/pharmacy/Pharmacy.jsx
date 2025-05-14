import React, { useEffect, useMemo, useState } from "react";
import "./phr.css";
import { useSelector, useDispatch } from "react-redux";
import { PRODUCTS } from "../../redux/actions/actions";
import { FaGetPocket } from "react-icons/fa";
import { addtocart } from "../../redux/actions/actions";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { set_cart_items } from "../../redux/slices/CaritemsSlice";
const Pharmacy = () => {
  const { medicines, Loading, Error } = useSelector((state) => state.medicines);
  const { prediction, loading, error } = useSelector(function (state) {
    return state.predict;
  });

  const [specMed, setSpecMed] = useState([]);

  useEffect(() => {
    const formateMed = prediction.medications
      ?.toString()
      .trim()
      .replace(/[\[\]']+/g, "")
      .split(",");
    setSpecMed(formateMed);
  }, [prediction]);
  const dispatch = useDispatch();
  const location = useLocation();
  let state = location.state?.state;
  useEffect(() => {
    PRODUCTS(dispatch);
  }, []);

  const [page, setPage] = useState(0);
  const previewPages = 10;
  const [visiablePro, setVisiablePro] = useState([]);
  const [filterd, setFilterd] = useState([]);

  if (Error) {
    console.log("error: ", Error);
  }

  useEffect(() => {
    setPage(0);
    setVisiablePro([]);
    setFilterd([]);
  }, [state]);

  const filterdPorudcts = useMemo(() => {
    let start = page;
    let end = start + previewPages;
    if (state !== "" && Array.isArray(medicines?.data)) {
      return medicines?.data
        .filter((d) => {
          return d["Medicine Name"]
            ?.toLowerCase()
            .includes(state?.toLowerCase());
        })
        .slice(start, end);
    }
    return [];
  }, [medicines?.data, state, page]);

  useEffect(() => {
    if (Array.isArray(filterdPorudcts)) {
      if (filterdPorudcts) {
        setFilterd((prev) => [...prev, ...filterdPorudcts]);
      } else {
        console.log("error");
      }
    }
  }, [state, medicines?.data, page, filterdPorudcts]);

  useEffect(() => {
    if (medicines?.data?.length > 0) {
      let start = page;
      let end = start + previewPages;
      let items = medicines?.data.slice(start, end) || [];
      if (items && specMed?.length < 1) {
        setVisiablePro((prev) => [...prev, ...items]);
      } else if (specMed?.length > 0) {
        setVisiablePro([]);
        for (let i = 0; i < specMed.length; ++i) {
          const userMed = medicines?.data?.filter(
            (me) => me["Medicine Name"] === specMed[i].trim()
          );
          setVisiablePro((prev) => [...prev,...userMed]);
         console.log(userMed)
        }
      }
    }
  }, [page, medicines?.data, filterd, state,specMed]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  function handelAddToCart(product) {
    addtocart(dispatch, product);
    toast.success(
      "Added",
      localStorage.getItem("theme") === "dark" && {
        style: {
          backgroundColor: "#333",
          color: "white",
        },
      }
    );
  }

  return (
    <div className="Products-Container">
      {Loading ? (
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "40px",
            padding: "20px",
            textAlign: "center",
          }}
          className="loading"
        >
          Loading Products...
        </p>
      ) : (
        <div className="products">
          {visiablePro.length > 0 && filterd.length < 1
            ? visiablePro?.map((pro, index) => {
                return (
                  <div className="product" key={index} id={pro.Medication_ID}>
                    <div className="img">
                      <img src={pro["Image URL"]} alt="img" />
                    </div>
                    <div className="info">
                      <h3>{pro["Medicine Name"]}</h3>
                      <p>
                        <span style={{ color: "rgb(17, 147, 247)" }}>
                          Side Effects:{" "}
                        </span>
                        {pro["Side_effects"]}
                      </p>
                      <p>
                        <span style={{ color: "rgb(17, 147, 247)" }}>
                          Uses:{" "}
                        </span>
                        {pro["Uses"]}
                      </p>
                    </div>
                    <div className="price-add">
                      <p>
                        <span style={{ color: "rgb(17, 147, 247)" }}>
                          Price:{" "}
                        </span>
                        100$
                      </p>
                      <button
                        className="addtocart"
                        onClick={() => handelAddToCart(pro)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })
            : filterd?.map((pro, index) => {
                return (
                  <div className="product" key={index} id={pro.Medication_ID}>
                    <div className="img">
                      <img src={pro["Image URL"]} alt="img" />
                    </div>
                    <div className="info">
                      <h3>{pro["Medicine Name"]}</h3>
                      <p>
                        <span style={{ color: "rgb(17, 147, 247)" }}>
                          Side Effects:{" "}
                        </span>
                        {pro["Side_effects"]}
                      </p>
                      <p>
                        <span style={{ color: "rgb(17, 147, 247)" }}>
                          Uses:{" "}
                        </span>
                        {pro["Uses"]}
                      </p>
                    </div>
                    <div className="price-add">
                      <p>
                        <span style={{ color: "rgb(17, 147, 247)" }}>
                          Price:{" "}
                        </span>
                        100$
                      </p>
                      <button
                        className="addtocart"
                        onClick={() => handelAddToCart(pro)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
      )}
      {!Loading && visiablePro.length > 0 ? (
        visiablePro?.length > 20 && (
          <button className={`loadmore`} onClick={loadMore}>
            <FaGetPocket />
          </button>
        )
      ) : (
        <h2 style={{ textAlign: "center" }}>
          Please Refresh The Page, Or Revisit The Pharamcy
        </h2>
      )}
    </div>
  );
};

export default Pharmacy;
