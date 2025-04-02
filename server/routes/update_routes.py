from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models import db
import models
from datetime import datetime

update = Blueprint('update', __name__)

# Creation routes
@update.route('/api/update-person', methods=['PUT'])
# @jwt_required()
def update_person():
    data = request.get_json()

    # Find the person by ID
    p = db.session.query(models.Person).filter_by(id=data['id'])).first()
    
    if p is None:
        return jsonify({'message': f'Person with id ({data[id]}) not found.'}), 404

    try:
        if 'first_name' in data:
            p.first_name = data['first_name']

        if 'last_name' in data:
            p.last_name = data['last_name']

        if 'gender' in data:
            try:
                p.gender = models.Gender[data['gender']]
            except KeyError:
                return jsonify({'message': 'Invalid gender value'}), 400

        if 'date_of_birth' in data:
            try:
                p.date_of_birth = datetime.datetime.strptime(data['date_of_birth'], "%m-%d-%Y").date()
            except ValueError:
                return jsonify({'message': 'Invalid date format. Use MM-DD-YYYY'}), 400

        if 'contact_no' in data:
            p.contact_no = data['contact_no']

        if 'address' in data:
            p.address = data['address']

        db.session.commit()

        return jsonify({'message': 'Update successful!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Update failed: {str(e)}'}), 500
    
@update.route('/api/update-employee', methods=['PUT'])
# @jwt_required()
def update_employee():
    data = request.get_json()

    try:        
        employee = models.Employee(
            person_id = data['person_id'],
            occupation = data['occupation'],
            department = data['department']
        )

        if 'schedule' in data:
            employee.shift = models.EmployeeShift(
                schedule = data['schedule']
            )

        db.session.add(employee)
        db.session.commit()

        return jsonify(
            {"message": "employee updated successfully"}
        ), 201
    except:
        return jsonify(
            {"message": "failed to update employee..."}
        ), 500

@update.route('/api/update-patient', methods=['PUT'])
# @jwt_required()
def update_patient():
    data = request.get_json()

    try:
        patient = models.Patient(
            height = data['height'],
            weight = data['weight'],
            blood_type = data['blood_type'],
            allergies = data['allergies'],
            medical_history = data['medical_history'],
            family_history = data['family_history'],
            person_id = data['person_id'],
            next_appointment_id = data['next_appointment_id']
        )

        if 'emergency_contact_person_id' in data and 'emergency_contact_relation' in data:
            patient.emergency_contact = models.EmergencyContact(
                person_id = data['emergency_contact_person_id'],
                relation = data['emergency_contact_relation']
            )

        db.session.add(patient)
        db.session.commit()

        return jsonify(
            {"message": "patient updated successfully"}
        ), 201
    except:
        return jsonify(
            {"message": "failed to update patient..."}
        ), 500
    
@update.route('/api/update-appointment', methods=['PUT'])
# @jwt_required()
def update_appointment():
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
            {"message": "appointment updated successfully"}
        ), 201
    except:
        return jsonify(
            {"message": "failed to update appointment..."}
        ), 500
