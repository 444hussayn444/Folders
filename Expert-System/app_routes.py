import sqlite3
from flask import jsonify, request
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import check_password_hash, generate_password_hash
import re
import uuid
from server import app
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import datetime


JWTManager(app=app)


def getdbConnection():
    db = sqlite3.connect("Database.db", check_same_thread=False)
    return db

db = getdbConnection()

cursor = db.cursor()

email_verify = r"^[a-zA-Z0-9_&#-/+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

def register():
    db = None
    try:
        userID = str(uuid.uuid4())
        data = request.get_json()
        firstname = data.get("First_name")
        lastname = data.get("Last_name")
        email = data.get("Email")
        age = data.get("Birth_Date")
        gender = data.get("Sex")
        state = data.get("State")
        city = data.get("City")
        streetName = data.get("ST_name")
        house_num  = data.get("House_number")
        card_num = data.get("Card_number")
        password = data.get("Password")
       

        if not all([firstname, lastname, email, password, age, gender,state,city,streetName,house_num,card_num]):
            return jsonify({"Error": "Please fill all the feilds"}), 404
        if not re.match(email_verify, email):
            return jsonify({"Error": "Please enter a valid email address"}), 400
        if len(password) < 8:
            return jsonify({"Error": "Please enter a strong password"}), 400
        try:
            age = int(age)
        except ValueError:
            return jsonify({"Error": "Age must be a number"}), 400
        if age < 18:
            return jsonify({"Error": "you have to be at least 18"}), 400
        db = getdbConnection()

        cursor = db.cursor()
        isExisist = cursor.execute(
            "SELECT * FROM Patient WHERE Email = ?", (email,)
        ).fetchone()
        if isExisist:
            return jsonify({"Error": "you have to login not register"}), 400

        hashedPass = generate_password_hash(str(password), salt_length=10)
        print(f"type: {type(hashedPass)}")
        db = getdbConnection()
        cursor = db.cursor()
        cursor.execute(
            """
            INSERT INTO Patient(ID, First_name, Last_name, Birth_Date, State, City, ST_name, House_number, Sex, Email, Card_number, Password) VALUES(?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)
            """,
            (userID, firstname, lastname, age, state, city, streetName, house_num,gender,email ,card_num,hashedPass),
        )
        db.commit()
        token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=24))
        return (
            jsonify(
                {
                    "userdata": {
                        "token": token,
                        "id": userID,
                        "firstname": firstname,
                        "email": email,
                    }
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"Error": str(e)}), 500
    finally:
        if db is not None:
            db.close()

def login():
    db = None
    try:
        data = request.get_json()
        email = data.get("Email")
        password = data.get("Password")
        if not all([ email , password]):
            return jsonify({"Error": "Please fill all the feilds"}), 404
        if not re.match(email_verify, email):
            return jsonify({"Error": "Please enter a valid email address"}), 400
        if len(password) < 8:
            return jsonify({"Error": "Please enter a valid password"}), 400
        db = getdbConnection()
        cursor = db.cursor()
        user = cursor.execute(
            """
               SELECT * FROM Patient WHERE Email = ?
               """,
            (email,),
        )
        user = user.fetchone()
        if not user:
            return jsonify({"Error" : "Please enter a valid Email or password"})
        userpassword = user[11]
        checkPassword = check_password_hash(userpassword, str(password))
        if not checkPassword:
            return jsonify({"Error": "Please enter a valid Email or password"}), 400
        token = create_access_token(identity=email, expires_delta=datetime.timedelta(hours=24))
        return jsonify(
                {
                    "userdata": {
                        "token": token,
                        "id": user[0],
                        "firstname": user[1],
                        "email": user[3],
                    }
                }
            ),200
        
    except Exception as e:
        print(str(e))
        return jsonify({"Error": str(e)}), 500
    finally:
        if db is not None:
           db.close()

def getProducts():
   try: 
        db = getdbConnection()
        cursro = db.cursor()
        cursro.execute("SELECT * FROM Medications")
        data = cursro.fetchall()

        culomns = [desc[0] for desc in cursro.description]
        formatedData = [dict(zip(culomns,row)) for row in data]
        for i,d in enumerate(formatedData,start=1):
            d["id"] = str(uuid.uuid4())

        if not data:
           return jsonify({"Error":"No Data."}),404
       
        return jsonify({"data":formatedData}),200
   except Exception as error:
        return jsonify({"Error": str(error)}),500
   finally:
       if db is not None:
           db.close()


def Confirm():
    db = None
    try:
        db = getdbConnection()
        cursor = db.cursor()

        data = request.get_json()
        patient_id = data.get("patient_id")
        cartItems = data.get("items")
        if not patient_id:
            return jsonify({"Error": "No Data."}), 404

        cursor.execute("SELECT ID FROM Cart WHERE Patient_ID = ?", (patient_id,))
        cart_row = cursor.fetchone()

        if not cart_row:
            currentT = datetime.datetime.now().isoformat()
            cart_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO Cart(ID, Patient_ID, Created_At) VALUES(?, ?, ?)
            """, (cart_id, patient_id, currentT))
            db.commit()
        else:
            cart_id = cart_row[0]

        print(f"Cart ID: {cart_id}")

        cursor.execute("DELETE FROM In_Cart WHERE Cart_ID = ?", (patient_id,))
        db.commit()
        print(f"Deleted all items from Cart_ID: {cart_id}")

        for item in cartItems:
            product_id = item["Medication_ID"]
            new_quantity = int(item["quantity"])
            print(f"Adding item: {product_id} with quantity: {new_quantity}")

            cursor.execute("""
                INSERT INTO In_Cart (Cart_ID, Medication_ID, quantity)
                VALUES (?, ?, ?)
            """, (patient_id, product_id, new_quantity))

        db.commit()
        print("Added all new items to the cart successfully.")

        return jsonify({"Success": True, "Cart_ID": cart_id}), 200

    except Exception as e:
        if db:
            db.rollback()
        print(str(e))
        return jsonify({"Error": str(e)}), 500

    finally:
        if db:
            db.close()

def getDatafromDb():
    db = None
    try:
        db = getdbConnection()
        cursor = db.cursor()

        
        cursor.execute("SELECT * FROM In_Cart")
        cart_data = cursor.fetchall()

        if not cart_data:
            return jsonify({"Error": "No cart data found for this user."}), 404

        col = [d[0] for d in cursor.description]
        cartdata = [dict(zip(col, row)) for row in cart_data]


        return jsonify({"Success": True, "cart_data": cartdata}), 200

    except Exception as e:
        return jsonify({"ERROR__TO__FIX__": str(e)}), 500

    finally:
        if db is not None:
            db.close()


def getSymptoms():
    db= None
    try:
        db = getdbConnection()
        cursor = db.cursor()
        
        data = request.get_json()
        patient_id = data.get("Patient_ID")
        symptom_name = data.get("Symptom_Name")


        if not patient_id or not symptom_name:
            return jsonify({"message": "No Data."}), 404
        if not patient_id:
            return jsonify({"message": "No Data."}), 404
        cursor.execute("INSERT OR IGNORE INTO Patient_Symptom (Patient_ID, Symptom_Name)  VALUES(? , ?)",(patient_id, symptom_name))

        db.commit()

        return jsonify({"message":"Prediction success", "Symptom": symptom_name}), 200       


    except Exception as error:
        return jsonify({"message": str(error)}), 500  
    finally:
        if db is not None:
            db.close()          



def getDiagnosis():
    db = None
    try:
        db = getdbConnection()
        cursor = db.cursor()

        data = request.get_json()
        patient_id = data.get("Patient_ID")
        dite = data.get("Diet")
        time = datetime.datetime.now().isoformat()
        medication = data.get("Medication")
        diseaseName = data.get("Predicted_Disease")
        precaution = data.get("Precaution")
        date = datetime.datetime.today().date()
        cursor.execute("""
         SELECT ID FROM Disease WHERE Name = ?
        """,(diseaseName,)) 

        diseaseRow = cursor.fetchone()
        diseaseID = diseaseRow[0]
        
        if not diseaseName:
            return jsonify({"message" : "There is no Disease have been sent"})
        if not all([patient_id, time, date, dite, medication, precaution]):
            return jsonify({"message": "No Data."}), 404
        cursor.execute("""

        INSERT INTO Diagnosis (Patient_ID, Disease_ID, Time, Date, Diet, Medication, Precaution)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (patient_id, diseaseID, time, date, dite, medication, precaution))
        db.commit()

        if not patient_id :
            return jsonify({"message": "No Data."}), 404
    
        return jsonify({"message": "Prediction success", "ID": patient_id}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500  
    finally:
        if db is not None:
            db.close()


def check_out():
   db = None
   try: 
    db = getdbConnection()
    cursor = db.cursor()

    data = request.get_json()
    Patient_ID= data.get("Patient_ID")
    print("data : ",Patient_ID)

    if not data:
        return jsonify({"Error":"Please fill all the feilds"}),404
    
    print(Patient_ID,"aa")
  
    
    cursor.execute("DELETE FROM In_Cart WHERE Cart_ID = ?",(Patient_ID,))
    db.commit()

    return jsonify({"Success","Done"}) ,200   
   except Exception as e :
        return jsonify({"message": str(e)}), 500  
   finally:
        if db is not None:
            db.close()



tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")

model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")


def get_Chat_response(text):

    for step in range(5):

        new_user_input_ids = tokenizer.encode(str(text) + tokenizer.eos_token, return_tensors='pt')

        bot_input_ids = torch.cat([chat_history_ids, new_user_input_ids], dim=-1) if step > 0 else new_user_input_ids

        chat_history_ids = model.generate(bot_input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)

        return tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)