from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models import db
import models
from datetime import datetime

create = Blueprint('create', __name__)

# Creation routes
@create.route('/api/create-person', methods=['POST'])
# @jwt_required()
def create_person():
    data = request.get_json()

    try:
        p = models.Person(
            first_name = data['first_name'],
            last_name = data['last_name'],
            gender = models.Gender[data['gender']],
            date_of_birth = datetime.strptime(data['date_of_birth'], "%d-%m-%Y").date(),
            contact_no = data['contact_no'],
            address = data['address']
        )

        db.session.add(p)
        db.session.commit()

        return jsonify(
            {"message": "user created successfully"}
        ), 201
    except:
        return jsonify(
            {"message": "failed to create user..."}
        ), 500
    
@create.route('/api/create-employee', methods=['POST'])
# @jwt_required()
def create_employee():
    data = request.get_json()

    try:
        e = models.Employee(
            person_id = data['person_id'],
            occupation = data['occupation'],
            department = data['department'],
            shift_id = data['shift_id']
        )

        db.session.add(e)
        db.session.commit()

        return jsonify(
            {"message": "employee created successfully"}
        ), 201
    except:
        return jsonify(
            {"message": "failed to create employee..."}
        ), 500

@create.route('/api/create-patient', methods=['POST'])
# @jwt_required()
def create_patient():
    data = request.get_json()

    try:
        p = models.Patient(
            height = data['height'],
            weight = data['weight'],
            blood_type = data['blood_type'],
            allergies = data['allergies'],
            medical_history = data['medical_history'],
            family_history = data['family_history'],
            person_id = data['person_id'],
            emergency_contact_id = data['emergency_contact_id'],
            next_appointment_id = data['next_appointment_id']
        )

        db.session.add(p)
        db.session.commit()

        return jsonify(
            {"message": "patient created successfully"}
        ), 201
    except:
        return jsonify(
            {"message": "failed to create patient..."}
        ), 500
    
@create.route('/api/create-emergency-contact', methods=['POST'])
# @jwt_required()
def create_emergency_contact():
    data = request.get_json()

    try:
        e = models.EmergencyContact(
            patient_id = data['patient_id'],
            person_id = data['person_id'],
            relation = data['relation']
        )

        db.session.add(e)
        db.session.commit()

        return jsonify(
            {"message": "emergency contact created successfully"}
        ), 201
    except:
        return jsonify(
            {"message": "failed to create emergency contact..."}
        ), 500
    
@create.route('/api/create-appointment', methods=['POST'])
# @jwt_required()
def create_appointment():
    data = request.get_json()

    try:
        a = models.Appointment(
            type = data['type'],
            patient_id = data['patient_id'],
            doctor_id = data['doctor_id'],
            date_time = datetime.strptime(data['date_time'], '%m-%d-%Y-%H-%M'),
            status = data['status'],
            note = data['note']
        )

        db.session.add(a)
        db.session.commit()

        return jsonify(
            {"message": "appointment created successfully"}
        ), 201
    except:
        return jsonify(
            {"message": "failed to create appointment..."}
        ), 500

@create.route('/api/create-employee-shift', methods=['POST'])
# @jwt_required()
def create_employee_shift():
    data = request.get_json()

    try:
        es = models.EmployeeShift(
            employee_id = data['employee_id'],
            schedule = data['schedule']
        )

        db.session.add(es)
        db.session.commit()

        return jsonify(
            {"message": "employee shift created successfully"}
        ), 201
    except:
        return jsonify(
            {"message": "failed to create employee shift..."}
        ), 500

