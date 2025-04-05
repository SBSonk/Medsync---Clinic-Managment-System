from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from models import db
import models

auth = Blueprint('auth', __name__)

blacklist = set()

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

@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    blacklist.add(jti)
    return jsonify(msg="Logout successful. Token revoked."), 200


@auth.route('/recovery-get-user', methods=['POST'])
def recovery_get_user(): # email -> returns username, id, security_question
    data = request.get_json()
    user: models.User = models.User.query.filter(models.User.email == data['email']).first()

    if user:
        return jsonify({'username': user.username, 'security_question': user.security_question, 'id': user.id}), 200
    else: 
        return jsonify({'message': 'User not found...'}), 401
    
@auth.route('/recovery-set-password', methods=['POST']) # user.id, security_answer, new_password -> updates if passes security_hash
def recovery_set_password():
    data = request.get_json()
    user: models.User = models.User.query.filter(models.User.id == data['id']).first()

    try:
        if user and user.check_security_answer(data['security_answer']):
            user.set_password(data['new_password'])
            db.session.commit()
            return jsonify({'message': 'Password successfully updated!'}), 200
        else: 
            return jsonify({'message': 'User not found or incorrect security answer.'}), 401
    except:
        db.session.rollback()
        return jsonify({'message': 'Something went wrong with recovery...'}), 500

@auth.route('/register', methods=['POST'])
@jwt_required()
def register():
    data = request.get_json()

    try:
        user = models.User(data['email'], data['username'], data['password'], data['role'], data['person_id'], data['security_question'], data['security_answer'])
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'Account successfully created!'}), 201
    except Exception as err:
        print(err)
        db.session.rollback()
        return jsonify({'message': 'Account creation failed...'}), 500