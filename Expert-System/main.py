from flask import request, jsonify  
import numpy as np
import pandas as pd
import pickle
from server import app
from app_routes import getDiagnosis,getProducts, register, login ,getDatafromDb,Confirm ,get_Chat_response,getSymptoms,check_out
import sqlite3
def getdbConnection():
    db = sqlite3.connect("Database.db", check_same_thread=False)
    return db


db = getdbConnection()

cursor = db.cursor()


sym_des = pd.read_csv("datasets/symtoms_df.csv")
precautions = pd.read_csv("datasets/precautions_df.csv")
workout = pd.read_csv("datasets/workout_df.csv")
description = pd.read_csv("datasets/description.csv")
medications = pd.read_csv("datasets/medications.csv")
diets = pd.read_csv("datasets/diets.csv")


svc = pickle.load(open("models/svc.pkl", "rb"))


def helper(dis):
    desc = description[description["Disease"] == dis]["Description"]
    desc = " ".join([w for w in desc])

    pre = precautions[precautions["Disease"] == dis][
        ["Precaution_1", "Precaution_2", "Precaution_3", "Precaution_4"]
    ]
    pre = [col for col in pre.values]

    med = medications[medications["Disease"] == dis]["Medication"]
    med = [med for med in med.values]

    die = diets[diets["Disease"] == dis]["Diet"]
    die = [die for die in die.values]

    wrkout = workout[workout["disease"] == dis]["workout"]

    return desc, pre, med, die, wrkout


symptoms_dict = {
    "itching": 0,
    "skin_rash": 1,
    "nodal_skin_eruptions": 2,
    "continuous_sneezing": 3,
    "shivering": 4,
    "chills": 5,
    "joint_pain": 6,
    "stomach_pain": 7,
    "acidity": 8,
    "ulcers_on_tongue": 9,
    "muscle_wasting": 10,
    "vomiting": 11,
    "burning_micturition": 12,
    "spotting_ urination": 13,
    "fatigue": 14,
    "weight_gain": 15,
    "anxiety": 16,
    "cold_hands_and_feets": 17,
    "mood_swings": 18,
    "weight_loss": 19,
    "restlessness": 20,
    "lethargy": 21,
    "patches_in_throat": 22,
    "irregular_sugar_level": 23,
    "cough": 24,
    "high_fever": 25,
    "sunken_eyes": 26,
    "breathlessness": 27,
    "sweating": 28,
    "dehydration": 29,
    "indigestion": 30,
    "headache": 31,
    "yellowish_skin": 32,
    "dark_urine": 33,
    "nausea": 34,
    "loss_of_appetite": 35,
    "pain_behind_the_eyes": 36,
    "back_pain": 37,
    "constipation": 38,
    "abdominal_pain": 39,
    "diarrhoea": 40,
    "mild_fever": 41,
    "yellow_urine": 42,
    "yellowing_of_eyes": 43,
    "acute_liver_failure": 44,
    "fluid_overload": 45,
    "swelling_of_stomach": 46,
    "swelled_lymph_nodes": 47,
    "malaise": 48,
    "blurred_and_distorted_vision": 49,
    "phlegm": 50,
    "throat_irritation": 51,
    "redness_of_eyes": 52,
    "sinus_pressure": 53,
    "runny_nose": 54,
    "congestion": 55,
    "chest_pain": 56,
    "weakness_in_limbs": 57,
    "fast_heart_rate": 58,
    "pain_during_bowel_movements": 59,
    "pain_in_anal_region": 60,
    "bloody_stool": 61,
    "irritation_in_anus": 62,
    "neck_pain": 63,
    "dizziness": 64,
    "cramps": 65,
    "bruising": 66,
    "obesity": 67,
    "swollen_legs": 68,
    "swollen_blood_vessels": 69,
    "puffy_face_and_eyes": 70,
    "enlarged_thyroid": 71,
    "brittle_nails": 72,
    "swollen_extremeties": 73,
    "excessive_hunger": 74,
    "extra_marital_contacts": 75,
    "drying_and_tingling_lips": 76,
    "slurred_speech": 77,
    "knee_pain": 78,
    "hip_joint_pain": 79,
    "muscle_weakness": 80,
    "stiff_neck": 81,
    "swelling_joints": 82,
    "movement_stiffness": 83,
    "spinning_movements": 84,
    "loss_of_balance": 85,
    "unsteadiness": 86,
    "weakness_of_one_body_side": 87,
    "loss_of_smell": 88,
    "bladder_discomfort": 89,
    "foul_smell_of urine": 90,
    "continuous_feel_of_urine": 91,
    "passage_of_gases": 92,
    "internal_itching": 93,
    "toxic_look_(typhos)": 94,
    "depression": 95,
    "irritability": 96,
    "muscle_pain": 97,
    "altered_sensorium": 98,
    "red_spots_over_body": 99,
    "belly_pain": 100,
    "abnormal_menstruation": 101,
    "dischromic _patches": 102,
    "watering_from_eyes": 103,
    "increased_appetite": 104,
    "polyuria": 105,
    "family_history": 106,
    "mucoid_sputum": 107,
    "rusty_sputum": 108,
    "lack_of_concentration": 109,
    "visual_disturbances": 110,
    "receiving_blood_transfusion": 111,
    "receiving_unsterile_injections": 112,
    "coma": 113,
    "stomach_bleeding": 114,
    "distention_of_abdomen": 115,
    "history_of_alcohol_consumption": 116,
    "fluid_overload.1": 117,
    "blood_in_sputum": 118,
    "prominent_veins_on_calf": 119,
    "palpitations": 120,
    "painful_walking": 121,
    "pus_filled_pimples": 122,
    "blackheads": 123,
    "scurring": 124,
    "skin_peeling": 125,
    "silver_like_dusting": 126,
    "small_dents_in_nails": 127,
    "inflammatory_nails": 128,
    "blister": 129,
    "red_sore_around_nose": 130,
    "yellow_crust_ooze": 131,
}
diseases_list = {
    15: "Fungal infection",
    4: "Allergy",
    16: "GERD",
    9: "Chronic cholestasis",
    14: "Drug Reaction",
    33: "Peptic ulcer diseae",
    1: "AIDS",
    12: "Diabetes ",
    17: "Gastroenteritis",
    6: "Bronchial Asthma",
    23: "Hypertension ",
    30: "Migraine",
    7:  "Cervical spondylosis",
    32: "Paralysis (brain hemorrhage)",
    28: "Jaundice",
    29: "Malaria",
    8: "Chicken pox",
    11: "Dengue",
    37: "Typhoid",
    40: "hepatitis A",
    19: "Hepatitis B",
    20: "Hepatitis C",
    21: "Hepatitis D",
    22: "Hepatitis E",
    3: "Alcoholic hepatitis",
    36: "Tuberculosis",
    10: "Common Cold",
    34: "Pneumonia",
    13: "Dimorphic hemmorhoids(piles)",
    18: "Heart attack",
    39: "Varicose veins",
    26: "Hypothyroidism",
    24: "Hyperthyroidism",
    25: "Hypoglycemia",
    31: "Osteoarthristis",
    5: "Arthritis",
    0: "(vertigo) Paroymsal  Positional Vertigo",
    2: "Acne",
    38: "Urinary tract infection",
    35: "Psoriasis",
    27: "Impetigo",
}


def get_predicted_value(patient_symptoms):
    input_vector = np.zeros(len(symptoms_dict))
    for item in patient_symptoms:
        input_vector[symptoms_dict[item]] = 1
    return diseases_list[svc.predict([input_vector])[0]]


@app.route("/get-products", methods=["GET"])
def get_products():
    try:
        return getProducts()
    except Exception as e:
        return jsonify({"error": str(e)})
    

@app.route("/get-products-cart", methods=["GET"])
def get_data_from_db():
    try:
        return getDatafromDb()
    except Exception as e:
        return jsonify({"error": str(e)})
    

@app.route("/dia", methods=["POST"])
def Diagnosis_Route():
    try:
        return getDiagnosis()
    except Exception as e:
        return jsonify({"error": str(e)})
    

@app.route("/check-out",methods=["POST"])
def check_out_route():
    try:
        return check_out()
    except Exception as e:
        return jsonify({"error": str(e)})   


@app.route("/addTocart", methods=["POST"])
def addToCart_route():
    try:
        return Confirm()
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/register", methods=["POST"])
def register_route():
    try:
        return register()
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/send_symptoms", methods=["POST"])
def send_symptoms_route():
    try:
        return getSymptoms()
    except Exception as e:
        return jsonify({"message":str(e)})    


@app.route("/login", methods=["POST"])
def login_route():
    try:
        return login()
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/get", methods=["POST"])
def chat():
    try:
        if request.is_json:
            data = request.get_json()
            msg = data.get("msg")
        else:
            return jsonify({"error": "Request must be JSON"}), 400

        if not msg:
            return jsonify({"error": "No message provided"}), 400

        response = get_Chat_response(msg)
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error in chat route: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        symptoms = data.get("symptoms")

        if not symptoms:
            return jsonify({"error": "Missing symptoms data"}), 400

        if isinstance(symptoms, str):
            user_symptoms = [s.strip("[]' ") for s in symptoms.split(",")]
        elif isinstance(symptoms, list):
            user_symptoms = [s.strip() for s in symptoms]
        else:
            return jsonify({"error": "Invalid format for symptoms"}), 400

        predicted_disease = get_predicted_value(user_symptoms)

        try:
            dis_des, precautions, medications, rec_diet, workout = helper(
                predicted_disease
            )
        except Exception as e:
            return jsonify({"error": f"Error fetching details: {str(e)}"}), 500

        my_precautions = precautions[0] if precautions else ["No precautions available"]

        if isinstance(precautions, np.ndarray):
            precautions = precautions.tolist()

        if isinstance(medications, np.ndarray):
            medications = medications.tolist()

        if isinstance(rec_diet, np.ndarray):
            rec_diet = rec_diet.tolist()
        if isinstance(workout, np.ndarray):
            workout = workout.tolist()

        if isinstance(dis_des, np.ndarray):
            dis_des = dis_des.tolist()
        return (
            jsonify(
                {
                    "predicted_disease": predicted_disease,
                    "description": dis_des,
                    "precautions": (
                        my_precautions[0]
                        if precautions
                        else ["No precautions available"]
                    ),
                    "medications": list(medications),
                    "recommended_diet": list(rec_diet),
                    "workout": list(workout),
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
