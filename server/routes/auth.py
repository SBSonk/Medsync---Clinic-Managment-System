from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required
from models import db
import models

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return jsonify({'message': 'Please use POST to login.'})
    
    data = request.get_json()
    user: models.User = models.User.query.filter_by(username=data['username']).first()

    if user and user.check_password(data['password']):
        return jsonify({'message': 'Authorization success!', 'access_token': create_access_token(identity=str(user.id)), 'role': user.role}), 200
    else: 
        return jsonify({'message': 'Authorization failed...'}), 401
    
@auth.route('/register', methods=['POST'])
@jwt_required()
def register():
    data = request.get_json()

    try:
        user = models.User(data['email'], data['username'], data['password'], data['role'], data['person_id'])
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'Account successfully created!'}), 201
    except:
        db.session.rollback()
        return jsonify({'message': 'Account creation failed...'}), 500