from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import firebase_admin
from firebase_admin import credentials, firestore
import os

# ===============================
# APP INIT
# ===============================
app = Flask(__name__)
CORS(app)

# ===============================
# FIREBASE INIT (CORRECT PATH)
# ===============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FIREBASE_KEY_PATH = os.path.join(
    BASE_DIR,
    "firebase",
    "ruralmedicare-7c398-firebase-adminsdk-fbsvc.json"
)

if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_KEY_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ===============================
# LOAD ML FILES
# ===============================
model = pickle.load(open(os.path.join(BASE_DIR, "model.pkl"), "rb"))
scaler = pickle.load(open(os.path.join(BASE_DIR, "scaler.pkl"), "rb"))
le_gender = pickle.load(open(os.path.join(BASE_DIR, "gender_encoder.pkl"), "rb"))
risk_mapping = pickle.load(open(os.path.join(BASE_DIR, "risk_mapping.pkl"), "rb"))

NUMERIC_FEATURES = [
    "Heart Rate",
    "Body Temperature",
    "Oxygen Saturation",
    "Age"
]

# ===============================
# RISK UI CONFIG
# ===============================
def get_risk_ui(risk):
    return {
        "Normal": {
            "color": "#10B981",
            "message": "All vitals are within normal range"
        },
        "Caution": {
            "color": "#F59E0B",
            "message": "Minor deviation detected – monitor closely"
        },
        "Moderate Risk": {
            "color": "#F97316",
            "message": "Requires medical attention soon"
        },
        "High Risk": {
            "color": "#EF4444",
            "message": "Urgent medical care needed"
        },
        "Critical": {
            "color": "#DC2626",
            "message": "🚨 EMERGENCY – Immediate intervention required"
        }
    }.get(risk, {
        "color": "#10B981",
        "message": "Vitals normal"
    })

# ===============================
# FETCH LATEST VITALS FROM FIREBASE
# ===============================
def fetch_latest_vitals(patient_id):
    docs = (
        db.collection("patients")
        .document(patient_id)
        .collection("vitals")
        .order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(1)
        .get()
    )

    if not docs:
        return None

    return docs[0].to_dict()

# ===============================
# API: FIREBASE → ML → UI
# ===============================

@app.route('/ping')
def ping():
    return "ML API is running"

@app.route("/api/patient/<patient_id>/predict", methods=["GET"])
def predict_from_firebase(patient_id):
    try:
        patient_doc = db.collection("patients").document(patient_id).get()
        if not patient_doc.exists:
            return jsonify({"error": "Patient not found"}), 404

        patient = patient_doc.to_dict()
        vitals = fetch_latest_vitals(patient_id)

        if not vitals:
            return jsonify({"error": "No vitals found"}), 404

        gender = patient.get("gender", "Male")
        age = patient.get("age", 45)

        gender_encoded = le_gender.transform([gender])[0]

        df = pd.DataFrame([{
            "Heart Rate": vitals["heartRate"],
            "Body Temperature": vitals["temperature"],
            "Oxygen Saturation": vitals["spo2"],
            "Age": age,
            "Gender": gender_encoded
        }])

        df[NUMERIC_FEATURES] = scaler.transform(df[NUMERIC_FEATURES])

        proba = model.predict_proba(df)[0]
        pred = model.predict(df)[0]

        risk = risk_mapping[pred]
        ui = get_risk_ui(risk)

        return jsonify({
            "patientId": patient_id,
            "risk": risk,
            "confidence": float(proba[pred]),
            "color": ui["color"],
            "message": ui["message"],
            "vitals": vitals,
            "probabilities": {
                risk_mapping[i]: float(p)
                for i, p in enumerate(proba)
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===============================
# SERVER
# ===============================
if __name__ == "__main__":
    print("🚀 Rural Medicare ML API Running")
    app.run(host="0.0.0.0", port=8000, debug=True)
