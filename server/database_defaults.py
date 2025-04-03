from flask_sqlalchemy import SQLAlchemy
import models
from randomuser import RandomUser
from random import choice
from dateutil.parser import parse
import random
from typing import List
import math

def populate_people(db):
    session = db.session
    for _ in range(25):
        user = RandomUser()
        random_person = models.Person(
            first_name = user.get_first_name(),
            last_name = user.get_last_name(),
            gender = random_gender(),
            date_of_birth = parse(user.get_dob()).date(),
            contact_no = user.get_phone(),
            address = f"{user.get_street()}, {user.get_city()}, {user.get_country()}"
        )

        session.add(random_person)
    
    session.commit()

clinic_products = [
    "MediCare Plus",
    "HealWell Essentials",
    "VitalCare Solutions",
    "PureSkin Derma",
    "OrthoFlex Support",
    "PainRelief Max",
    "ImmuneBoost Formula",
    "NutriLife Supplements",
    "AquaFresh Wound Wash",
    "RespiraEase Inhaler",
    "Dermacure Ointment",
    "CardioGuard Tablets",
    "VisionCare Drops",
    "JointEase Capsules",
    "GastroShield Pro",
    "FerroBoost Iron Syrup",
    "NeuroZen Relax",
    "SleepWell Melatonin",
    "BioHeal Wound Patches",
    "AllergyShield Antihistamine"
]

product_types = [
    "General Health",
    "First Aid",
    "Supplements",
    "Skincare",
    "Orthopedic",
    "Pain Management",
    "Supplements",
    "First Aid",
    "Respiratory Care",
    "Skincare"
]

suppliers = [
    "HealthTech Distributors",
    "MedSupply Co.",
    "PureWell Pharmaceuticals",
    "VitalCare Labs",
    "OrthoMed Solutions",
    "QuickRelief Supplies",
    "AquaHeal Medical",
    "NeuroPharm Industries",
    "BioMed Innovations",
    "GastroCare Global"
]

def populate_inventory(db):
    session = db.session
    for _ in range(25):
        user = RandomUser()
        random_inventory = models.Inventory(
            batch_id = str(random.randint(0, 2000)),
            name = random.choice(clinic_products),
            type = random.choice(product_types),
            quantity = random.randint(0, 50),
            expiration_date = parse(user.get_dob()).date(),
            supplier = random.choice(suppliers),
            supplier_contact = user.get_cell()
        )

        session.add(random_inventory)

    session.commit()

blood_types = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

allergies = [
    "Pollen", "Dust mites", "Pet dander", "Mold", "Insect stings",
    "Latex", "Certain medications", "Milk", "Eggs", "Peanuts",
    "Tree nuts", "Wheat", "Soy", "Fish", "Shellfish"
]

medical_histories = [
    "Chronic illnesses (e.g., diabetes, hypertension)",
    "Previous surgeries (e.g., appendectomy, knee replacement)",
    "Family medical history (e.g., heart disease, cancer)",
    "None"
]

family_history = [
    "Heart disease", 
    "Diabetes", 
    "Cancer", 
    "High blood pressure", 
    "Stroke", 
    "Mental health disorders", 
    "Autoimmune diseases", 
    "Genetic disorders", 
    "None"
]

relationship_types = [
    "Family", 
    "Friendship", 
    "Romantic", 
    "Professional", 
    "Acquaintance", 
    "Situational", 
    "None"
]

def populate_patients(db):
    session = db.session
    all_people: List = db.session.query(models.Person).all()
    for _ in range(10):
        person = random.choice(all_people)
        all_people.remove(person)
        random_patient = models.Patient(
            height = random.randint(1, 2),
            weight = random.randint(40, 200),
            blood_type = random.choice(blood_types),
            allergies = random.choice(allergies),
            medical_history = random.choice(medical_histories),
            family_history = random.choice(family_history),

            person_id = person.id
        )

        emergency_person = random.choice(all_people)
        all_people.remove(emergency_person)
        random_patient.emergency_contact = models.EmergencyContact(
            person_id = emergency_person.id,
            relation = random.choice(relationship_types)
        )
        session.add(random_patient)

    session.commit()

def random_gender():
    return choice(list(models.Gender)) 