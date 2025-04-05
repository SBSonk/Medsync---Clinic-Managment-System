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
    p = db.session.get(models.Person, data['id'])
    
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
                p.date_of_birth = datetime.strptime(data['date_of_birth'], "%d-%m-%Y").date()
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
    employee = db.session.get(models.Employee, data['person_id'])
    
    if not employee:
        return jsonify({"message": f"Employee with ID {data['person_id']} not found."}), 404

    try:
        if 'person_id' in data:
            employee.person_id = data['person_id']
        if 'occupation' in data:
            employee.occupation = data['occupation']
        if 'department' in data:
            employee.department = data['department']

        # Update shift schedule if provided
        if 'schedule' in data:
            if employee.shift:
                employee.shift.schedule = data['schedule']  # Update existing shift
            else:
                employee.shift = models.EmployeeShift(schedule=data['schedule'])  # Create new shift

        db.session.commit()
        return jsonify({"message": "Employee updated successfully"}), 200

    except Exception as e:
        db.session.rollback() 
        return jsonify({"message": f"Failed to update employee with id: {data['id']}"}), 500

@update.route('/api/update-patient', methods=['PUT'])
# @jwt_required()
def update_patient():
    data = request.get_json()
    patient = db.session.get(models.Patient, data['id'])
    
    if not patient:
        return jsonify({"message": f"Patient with ID {data['id']} not found."}), 404

    try:
        if 'height' in data:
            patient.height = data['height']
        if 'weight' in data:
            patient.weight = data['weight']
        if 'blood_type' in data:
            patient.blood_type = data['blood_type']
        if 'allergies' in data:
            patient.allergies = data['allergies']
        if 'medical_history' in data:
            patient.medical_history = data['medical_history']
        if 'family_history' in data:
            patient.family_history = data['family_history']

        # Update emergency contact if pos
        if patient.emergency_contact:
            if 'emergency_contact_person_id' in data:
                patient.emergency_contact.person_id = data['emergency_contact_person_id']
            
            if 'emergency_contact_relation' in data:
                patient.emergency_contact.relation = data['emergency_contact_relation']
        elif 'emergency_contact_person_id' in data and 'emergency_contact_relation' in data:
            patient.emergency_contact = models.EmergencyContact(
                person_id = data['emergency_contact_person_id'],
                relation = data['emergency_contact_relation']
            )

        db.session.commit()
        return jsonify({"message": "Patient updated successfully"}), 200

    except Exception as e:
        db.session.rollback() 
        return jsonify({"message": f"Failed to update patient with id: {data['id']}"}), 500
    
@update.route('/api/update-appointment', methods=['PUT'])
# @jwt_required()
def update_appointment():
    data = request.get_json()
    appointment = db.session.get(models.Appointment, data['id'])
    
    if not appointment:
        return jsonify({"message": f"Appointment with ID {data['id']} not found."}), 404
    try:
        if 'type' in data:
            appointment.type = data['type']
        if 'patient_id' in data:
            appointment.patient_id = data['patient_id']
        if 'doctor_id' in data:
            appointment.doctor_id = data['doctor_id']
        if 'date_time' in data:
            try:
                appointment.date_time = datetime.strptime(data['date_time'], '%m-%d-%Y-%H-%M')
            except ValueError:
                return jsonify({"message": "Invalid date format. Use MM-DD-YYYY-HH-MM"}), 400
        if 'status' in data:
            appointment.status = data['status']
        if 'note' in data:
            appointment.note = data['note']
        db.session.commit()
        return jsonify({"message": "Appointment updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to update appointment with id {data['id']}"}), 500

@update.route('/api/update-user', methods=['PUT'])
# @jwt_required()
def update_user():
    data = request.get_json()

    # Find the user by ID
    user = db.session.get(models.User, data['id'])
    
    if user is None:
        return jsonify({'message': f'User with id ({data["id"]}) not found.'}), 404

    try:
        if 'email' in data:
            user.email = data['email']

        if 'username' in data:
            user.username = data['username']

        if 'password' in data:
            user.set_password(data['password'])

        if 'role' in data:
            user.role = data['role']

        if 'security_question' in data:
            user.security_question = data['security_question']

        if 'security_answer' in data:
            user.set_security_answer(data['security_answer'])

        db.session.commit()

        return jsonify({'message': 'Update successful!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Update failed: {str(e)}'}), 500
    
@update.route('/api/update-inventory', methods=['PUT'])
# @jwt_required()
def update_inventory():
    data = request.get_json()

    # Find the inventory item by ID
    item = db.session.get(models.Inventory, data['id'])

    if item is None:
        return jsonify({'message': f'Inventory item with id ({data["id"]}) not found.'}), 404

    try:
        if 'batch_id' in data:
            item.batch_id = data['batch_id']

        if 'name' in data:
            item.name = data['name']

        if 'type' in data:
            item.type = data['type']

        if 'quantity' in data:
            item.quantity = data['quantity']

        if 'expiration_date' in data:
            # expects date in ISO format like "2025-05-01"
            item.expiration_date = datetime.strptime(data['date_of_birth'], "%d-%m-%Y").date()

        if 'supplier' in data:
            item.supplier = data['supplier']

        if 'supplier_contact' in data:
            item.supplier_contact = data['supplier_contact']

        db.session.commit()

        return jsonify({'message': 'Inventory update successful!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Inventory update failed: {str(e)}'}), 500
