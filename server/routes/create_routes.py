from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models import db
import models
from datetime import datetime


create = Blueprint('create', __name__)

# Creation routes
@create.route('/api/create-person', methods=['POST'])
@jwt_required()
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
            {"message": "person created successfully"}
        ), 201
    except:
        db.session.rollback()
        return jsonify(
            {"message": "failed to create person..."}
        ), 500
    
@create.route('/api/create-employee', methods=['POST'])
@jwt_required()
def create_employee():
    data = request.get_json()

    try:        
        employee = models.Employee(
            person_id = data['person_id'],
            occupation = data['occupation'],
            department = data['department']
        )

        if 'schedule' in data:
            shift = models.EmployeeShift(
                employee_id = employee.person_id, 
                schedule = data['schedule']
            )
            employee.shift = shift

        
        db.session.add(employee)
        db.session.commit()
        return jsonify(
            {"message": "employee created successfully"}
        ), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(
            {"message": "failed to create employee..."}
        ), 500

@create.route('/api/create-patient', methods=['POST'])
@jwt_required()
def create_patient():
    data = request.get_json()

    try:
        patient = models.Patient(
            height = data['height'],
            weight = data['weight'],
            blood_type = data['blood_type'],
            allergies = data['allergies'],
            medical_history = data['medical_history'],
            family_history = data['family_history'],
            person_id = data['person_id']
        )

        if 'emergency_contact_person_id' in data and 'emergency_contact_relation' in data:
            emergency_contact = models.EmergencyContact(
                person_id = data['emergency_contact_person_id'],
                relation = data['emergency_contact_relation']
            )
            patient.emergency_contact = emergency_contact

        if 'next_appointment_id' in data:
            patient.next_appointment_id = data['next_appointment_id']

        db.session.add(patient)
        db.session.commit()

        return jsonify(
            {"message": "patient created successfully"}
        ), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(
            {"message": "failed to create patient..."}
        ), 500
    
@create.route('/api/create-appointment', methods=['POST'])
@jwt_required()
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
        db.session.rollback()
        return jsonify(
            {"message": "failed to create appointment..."}
        ), 500

@create.route('/api/create-inventory', methods=['POST'])
@jwt_required()
def create_inventory():
    data = request.get_json()

    try:
        i = models.Inventory(
            batch_id = data['batch_id'],
            name = data['name'],
            type = data['type'],
            quantity = data['quantity'],
            expiration_date = datetime.strptime(data['expiration_date'], "%d-%m-%Y").date(),
            supplier = data['supplier'],
            supplier_contact = data['supplier_contact']
        )

        db.session.add(i)
        db.session.commit()
        return jsonify({'message': 'inventory item created successfully.'}), 201
    except:
        db.session.rollback()
        return jsonify({'message': 'failed to create inventory item...'}), 500