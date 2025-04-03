from flask import Blueprint, jsonify
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
            'role': u.role,
            'security_question': u.security_question
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
        # 'emergency_contact_id': p.emergency_contact_id,
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

@get.route('/api/appointments', methods=['GET'])
@jwt_required()
def appointments():
    all_appointments = db.session.query(models.Appointment).all()

    appointments_list = [{
        'id': e.id,
        'type': e.type,
        'patient_id': e.patient_id,
        'doctor_id': e.doctor_id,
        'date_time': e.date_time,
        'status': e.status,
        'note': e.note
    } for e in all_appointments]

    return jsonify(appointments_list), 200

@get.route('/api/inventory', methods=['GET'])
@jwt_required()
def inventory():
    all_inventory = db.session.query(models.Inventory).all()

    inventory_list = [{
        'id': e.id,
        'batch_id': e.batch_id,
        'name': e.name,
        'type': e.type,
        'quantity': e.quantity,
        'expiration_date': e.expiration_date,
        'supplier': e.supplier,
        'supplier_contact': e.supplier_contact
    } for e in all_inventory]

    return jsonify(inventory_list), 200

# Get by ID 

@get.route('/api/get-user-info/<id>', methods=['GET'])
@jwt_required()
def get_user_info(id):
    u = db.session.query(models.User).filter_by(id=id).first()
    if u is not None:
        return jsonify({
            'id': u.id,
            'email': u.email,
            'username': u.username,
            'role': u.role,
            'security_question': u.security_question
        }), 200
    else:
        return jsonify({'message': f'user with id ({id}) not found.'}), 404

@get.route('/api/get-person-info/<id>', methods=['GET'])
@jwt_required()
def get_person_info(id):
    p = db.session.query(models.Person).filter_by(id=id).first()
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
        return jsonify({'message': f'person with id ({id}) not found.'}), 404
    
@get.route('/api/get-patient-info/<id>', methods=['GET'])
@jwt_required()
def get_patient_info(id):
    p = db.session.query(models.Patient).filter_by(id=id).first()
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
            'next_appointment_id': p.next_appointment_id
        }), 200
    else:
        return jsonify({'message': f'patient with id ({id}) not found.'}), 404
    
@get.route('/api/get-emergency-contact/<patient_id>', methods=['GET'])
@jwt_required()
def get_emergency_contact(patient_id):
    p = db.session.query(models.EmergencyContact).filter_by(id=patient_id).first()
    if p is not None:
        return jsonify({
            'person_id': p.person_id,
            'relation': p.relation
        }), 200
    else:   
        return jsonify({'message': f'emergency contact with patient_id ({patient_id}) not found.'}), 404
    
@get.route('/api/get-employee-info/<id>', methods=['GET'])
@jwt_required()
def get_employee_info(id):
    e = db.session.query(models.Employee).filter_by(id=id).first()
    if e is not None:
        return jsonify({
            'id': e.id,
            'person_id': e.person_id,
            'occupation': e.occupation,
            'department': e.department,
        }), 200
    else:
        return jsonify({'message': f'employee with id ({id}) not found.'}), 404
    
@get.route('/api/get-shift-info/<employee_id>', methods=['GET'])
@jwt_required()
def get_shift_info(employee_id):
    s = db.session.query(models.EmployeeShift).filter_by(id=employee_id).first()
    if s is not None:
        return jsonify({
            'schedule': s.schedule
        }), 200
    else:
        return jsonify({'message': f'employee_shift with employee_id ({employee_id}) not found.'}), 404
