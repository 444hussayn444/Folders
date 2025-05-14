import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import get_prediction from "../redux/actions/actions";
import { toast } from "react-toastify";
import { FaMicrophone } from "react-icons/fa";
import "./styles/predict.css";
import sym from "./sym.json"
const Predict = () => {
  const types = [
    "description",
    "medications",
    "predicted_disease",
    "precautions",
    "recommended_diet",
    "workout",
  ];
  const { prediction, loading, error } = useSelector(function (state) {
    return state.predict;
  });

  console.log(prediction);

  const [user, setUser] = useState()
  const userID = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    setUser(userID.userdata.id)
  }, [userID, prediction])




  useEffect(() => {
    if (Object.values(prediction).length > 0) {
      setIs_prediction_done(true);
    } else {
      setIs_prediction_done(false);
    }
  }, [prediction, error, loading]);

  const dispatch = useDispatch();

  const [symptoms, setSymptoms] = useState("");

  const [is_prediciton_done, setIs_prediction_done] = useState(false);

  async function CREATE_PREDICION() {
    const response = await fetch("http://127.0.0.1:5000/send_symptoms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
      ,
      body: JSON.stringify({
        Patient_ID: user,
        Symptom_Name: symptoms,
      }),
    })
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.message + "help", localStorage.getItem("theme") === "dark" && {
        style: {
          backgroundColor: "#333",
          color: "whitesmoke",
        },
      });
    } else {
      const data = await response.json();
      console.log(data.message);

    }
    const symptomsval = symptoms.trim();
    const splitedSymptoms = symptoms.split(" ");
    if (symptomsval) {
      get_prediction(dispatch, { symptoms: splitedSymptoms });
    } else {
      toast.error(
        "Please Enter Another Symptom",
        localStorage.getItem("theme") === "dark" && {
          style: {
            backgroundColor: "#333",
            color: "white",
          },
        }
      );
    }
  }

  if (error) {
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
  const btnRef = useRef({});


  useEffect(() => {
    if (is_prediciton_done) {
      async function sendDia() {
        const response = await fetch("http://127.0.0.1:5000/dia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }, body: JSON.stringify({
            Patient_ID: user,
            Diet: prediction.recommended_diet[0].replace("[]", "").toString(),
            Medication: prediction.medications[0].replace("[]", "").toString(),
            Precaution: prediction.precautions.split(",").toString(),
            Predicted_Disease: prediction.predicted_disease
          })
        })
        if (!response.ok) {
          const data = await response.json();
          console.log(data.message);
        } else {
          const data = await response.json();
          console.log(data.message);

        }
      }
      sendDia()
    }
  }, [is_prediciton_done, prediction, user])

  function get_btn_val(value) {
    const category = value;
    const thisCategory = prediction[category];
    if (prediction && thisCategory) {
      const data =
        thisCategory.length === 1 && typeof thisCategory[0] === "string"
          ? thisCategory[0].slice(1, -1).replace(/'/gi, "").split('","')
          : thisCategory;

      toast.success(
        <div className="toast-container">
          <div className="div toast-title" style={{ display: "flex", justifyContent: "center" }}>{category.toUpperCase()}</div>
          <div className="desc">
            {Array.isArray(data) ? (
              data?.map((c, index) => {
                return (
                  <ul className="list-c" key={index}>
                    <li
                      style={
                        localStorage.getItem("theme") === "dark"
                          ? { color: "white" }
                          : { color: "#333" }
                      }
                      key={index}
                    >
                      {c}
                    </li>
                  </ul>
                );
              })
            ) : (
              <h3 className="things">{prediction[category]}</h3>
            )}
          </div>
        </div>,
        localStorage.getItem("theme") === "dark"
          ? {
            position: "top-center",
            style: {
              width: "700px",
              color: "white",
              backgroundColor: "#333",
              boxShadow: "0px 0px 6px 0px rgb(23, 121, 234)",
              border: "1px solid rgb(23, 121, 234)",
            },
            hideProgressBar: true,
            icon: false,
            onOpen: () => {
              const overLay = document.createElement("div");
              overLay.id = "toast-id";
              overLay.style.position = "fixed";
              overLay.style.height = "100%";
              overLay.style.width = "100%";
              overLay.style.top = "0";
              overLay.style.left = "0";
              overLay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
              overLay.style.zIndex = "444";
              document.body.appendChild(overLay);
            },

            autoClose: true,

            onClose: () => {
              document.getElementById("toast-id").remove();
            },
          }
          : {
            position: "top-center",
            style: {
              width: "700px",
              color: "black",
              backgroundColor: "whitesmoke",
              boxShadow: "0px 0px 6px 0px rgb(23, 121, 234)",
              border: "1px solid rgb(23, 121, 234)",
            },
            hideProgressBar: true,
            icon: false,
            onOpen: () => {
              const overLay = document.createElement("div");
              overLay.id = "toast-id";
              overLay.style.position = "fixed";
              overLay.style.height = "100%";
              overLay.style.width = "100%";
              overLay.style.top = "0";
              overLay.style.left = "0";
              overLay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
              overLay.style.zIndex = "444";
              document.body.appendChild(overLay);
            },

            autoClose: true,

            onClose: () => {
              document.getElementById("toast-id").remove();
            },
          }
      );
    } else {
      toast.error("There is something wrong, sorry", {
        style: {
          backgroundColor: "#333",
          color: "whitesmoke",
        },
      });
    }

    console.log(category);
  }
  // render every thing to make sure everything going as well as i want

  const [recommenation, setRecommnedation] = useState([])

  function symptom_setters(e) {
    setSymptoms(e.target.value)
    if (e.target.value !== "") {
      let choosen = sym.filter((s) => s.Symptom.toLowerCase().includes(symptoms.toLowerCase()))
      setRecommnedation(choosen)
    }else{
      setRecommnedation("")

    }
  }

  function chooseSympo(symptom) {
    setSymptoms(symptom)
    setRecommnedation("")
  }


  console.log(recommenation)
  return (
    <div className="prediction-container">
      <h1
        style={{
          textAlign: "center",
          position: "relative",
          bottom: "30px",
          fontSize: "50px",
        }}
      >
        Prediction System
      </h1>
      <div className="form">
        <div className="prediction">
          <input
            value={symptoms}
            onChange={(e) => symptom_setters(e)}
            type="text"
            className="symptoms-text"
            placeholder="Type symptoms such as itching, sleeping, aching etc"
          />
          {
            recommenation?.length > 0 && recommenation?.map((reco) => {
              return <div className="recomendation">
                <h2 onClick={() => chooseSympo(reco.Symptom)}>{reco.Symptom}</h2>
              </div>
            })
          }
        </div>
        <div className="speech">
          <button className="start-speech">
            <FaMicrophone className="mic" />
            Start Speech Recogntion
          </button>
        </div>
        <div className="predict-btn">
          <button className="predict-click" onClick={CREATE_PREDICION}>
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>
      </div>
      <div className={!is_prediciton_done ? "btns hidden" : "btns"}>
        {types.map((ty, index) => {
          return (
            <button
              ref={(el) => (btnRef.current[ty] = el)}
              onClick={() => get_btn_val(ty)}
              className="Button"
              key={index}
            >
              {ty}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Predict;
