from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models import db
import models

get = Blueprint('get', __name__)

# Get all   

@get.route('/api/users', methods=['GET'])
@jwt_required()
def users():
    all_users = db.session.query(models.User).all()

    user_list = [{
            'id': u.id,
            'email': u.email,
            'username': u.username,
            'role': u.role
        } for u in all_users]  
    
    return jsonify(user_list), 200

@get.route('/api/people', methods=['GET'])
@jwt_required()
def people():
    all_people = db.session.query(models.Person).all()

    people_list = [{
            'id': p.id,
            'first_name': p.first_name,
            'last_name': p.last_name,
            'gender': p.gender.name,
            'date_of_birth': p.date_of_birth,
            'contact_no': p.contact_no,
            'address': p.address
        } for p in all_people]  
    
    return jsonify(people_list), 200

@get.route('/api/patients', methods=['GET'])
@jwt_required()
def patients():
    all_patients = db.session.query(models.Patient).all()

    patients_list = [{
        'id': p.id,
        'person_id': p.person_id,
        'height': p.height,
        'weight': p.weight,
        'blood_type': p.blood_type,
        'allergies': p.allergies,
        'medical_history': p.medical_history,
        'family_history': p.family_history,
        'emergency_contact_id': p.emergency_contact_id,
        'next_appointment_id': p.next_appointment_id
    } for p in all_patients]

    return jsonify(patients_list), 200

@get.route('/api/employees', methods=['GET'])
@jwt_required()
def employees():
    all_employees = db.session.query(models.Employee).all()

    employees_list = [{
        'id': e.id,
        'person_id': e.person_id,
        'occupation': e.occupation,
        'department': e.department,
        'schedule': e.shift_id
    } for e in all_employees]

    return jsonify(employees_list), 200

# Get by ID 

@get.route('/api/get-user-info', methods=['POST'])
@jwt_required()
def get_user_info():
    data = request.get_json()

    u = db.session.query(models.Person).filter_by(id=data['id']).first()
    if u is not None:
        return jsonify({
            'id': u.id,
            'email': u.email,
            'username': u.username,
            'role': u.role
        }), 200
    else:
        return jsonify({'message': f'user with id ({data['id']}) not found.'}), 200

@get.route('/api/get-person-info', methods=['POST'])
@jwt_required()
def get_person_info():
    data = request.get_json()

    p = db.session.query(models.Person).filter_by(id=data['id']).first()
    if p is not None:
        return jsonify({
            'id': p.id,
            'first_name': p.first_name,
            'last_name': p.last_name,
            'gender': p.gender.name,
            'date_of_birth': p.date_of_birth,
            'contact_no': p.contact_no,
            'address': p.address
        }), 200
    else:
        return jsonify({'message': f'person with id ({data['id']}) not found.'}), 200
    
@get.route('/api/get-patient-info', methods=['POST'])
@jwt_required()
def get_patient_info():
    data = request.get_json()

    p = db.session.query(models.Patient).filter_by(id=data['id']).first()
    if p is not None:
        return jsonify({
            'id': p.id,
            'person_id': p.person_id,
            'height': p.height,
            'weight': p.weight,
            'blood_type': p.blood_type,
            'allergies': p.allergies,
            'medical_history': p.medical_history,
            'family_history': p.family_history,
            'emergency_contact_id': p.emergency_contact_id,
            'next_appointment_id': p.next_appointment_id
        }), 200
    else:
        return jsonify({'message': f'patient with id ({data['id']}) not found.'}), 200
    
@get.route('/api/get-emergency-contact', methods=['POST'])
@jwt_required()
def get_emergency_contact():
    data = request.get_json()

    p = db.session.query(models.EmergencyContact).filter_by(id=data['id']).first()
    if p is not None:
        return jsonify({
            'patient_id': p.patient_id,
            'person_id': p.person_id,
            'relation': p.relation
        }), 200
    else:   
        return jsonify({'message': f'emergency contact with id ({data['id']}) not found.'}), 200
    
@get.route('/api/get-employee-info', methods=['POST'])
@jwt_required()
def get_employee_info():
    data = request.get_json()

    e = db.session.query(models.Employee).filter_by(id=data['id']).first()
    if e is not None:
        return jsonify({
            'id': e.id,
            'person_id': e.person_id,
            'occupation': e.occupation,
            'department': e.department,
            'schedule': e.shift_id
        }), 200
    else:
        return jsonify({'message': f'employee with id ({data['id']}) not found.'}), 200
    
@get.route('/api/get-shift-info', methods=['POST'])
@jwt_required()
def get_shift_info():
    data = request.get_json()

    s = db.session.query(models.EmployeeShift).filter_by(id=data['id']).first()
    if s is not None:
        return jsonify({
            'employee_id': s.employee_id,
            'schedule': s.schedule
        }), 200
    else:
        return jsonify({'message': f'employee_shift with id ({data['id']}) not found.'}), 200
