from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from models import db
import models

api = Blueprint('api', __name__)

@api.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return jsonify({'message': 'Please use POST to login.'})
    
    data = request.get_json()
    user: models.User = models.User.query.filter_by(username=data['username']).first()

    if user and user.check_password(data['password']):
        return jsonify({'message': 'Authorization success!', 'access_token': create_access_token(identity=str(user.id))})
    else: 
        return jsonify({'message': 'Authorization failed...'})
    
@api.route('/register', methods=['POST'])
@jwt_required()
def register():
    data = request.get_json()

    try:
        user = models.User(data['username'], data['password'], data['role'], data['person_id'])
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'Account successfully created!'})
    except:
        return jsonify({'message': 'Account creation failed...'})

# Get all

@api.route('/api/people', methods=['GET'])
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
    
    return jsonify(people_list)

@api.route('/api/patients', methods=['GET'])
@jwt_required
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

    return jsonify(patients_list)

@api.route('api/employees', methods=['GET'])
@jwt_required
def employees():
    all_employees = db.session.query(models.Employee).all()

    employees_list = [{
        'id': e.id,
        'person_id': e.person_id,
        'occupation': e.occupation,
        'department': e.department,
        'schedule': e.shift_id
    } for e in all_employees]

    return jsonify(employees_list)

# Get by ID 

@api.route('/api/get-person-info', methods=['POST'])
@jwt_required   
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
        })
    else:
        return jsonify({'message': f'person with id ({data['id']}) not found.'})
    
@api.route('/api/get-patient-info', methods=['POST'])
@jwt_required
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
        })
    else:
        return jsonify({'message': f'patient with id ({data['id']}) not found.'})
    
@api.route('/api/get-emergency-contact', methods=['POST'])
@jwt_required
def get_emergency_contact():
    data = request.get_json()

    p = db.session.query(models.EmergencyContact).filter_by(id=data['id']).first()
    if p is not None:
        return jsonify({
            'patient_id': p.patient_id,
            'person_id': p.person_id,
            'relation': p.relation
        })
    else:   
        return jsonify({'message': f'emergency contact with id ({data['id']}) not found.'})
    