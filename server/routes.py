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
def register():
    data = request.get_json()

    try:
        user = models.User(data['username'], data['password'], data['role'], data['person_id'])
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'Account successfully created!'})
    except:
        return jsonify({'message': 'Account creation failed...'})


@api.route("/api/people", methods=['GET'])
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

