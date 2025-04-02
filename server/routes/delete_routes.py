from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models import db
import models
from datetime import datetime

delete = Blueprint('delete', __name__)

# Creation routes
@delete.route('/api/delete-person', methods=['POST'])
# @jwt_required()
def delete_person():
    data = request.get_json()
    p_id = data['id']

    try:
        p = db.session.query(models.Person).filter_by(id=p_id).first()

        if p is not None:
            db.session.remove(p)
            db.session.commit()
            return jsonify(
                {"message": "user deleted successfully"}
            ), 200

        return jsonify(
            {f"message": "user with id {p_id} does not exist."}
        ), 200
    except:
        return jsonify(
            {"message": "failed to delete user..."}
        ), 500
    
@delete.route('/api/delete-employee', methods=['POST'])
# @jwt_required()
def delete_employee():
    data = request.get_json()
    e_id = data['id']

    try:
        employee = db.session.query(models.Employee).filter_by(id=e_id).first()

        if employee is not None:
            db.session.remove(employee)
            db.session.commit()
            return jsonify(
                {"message": "employee deleted successfully"}
            ), 200

        return jsonify(
            {f"message": "employee with id {e_id} does not exist."}
        ), 200
    except:
        return jsonify(
            {"message": "failed to delete employee..."}
        ), 500

@delete.route('/api/delete-patient', methods=['POST'])
# @jwt_required()
def delete_patient():
    data = request.get_json()
    p_id = data['id']

    try:
        patient = db.session.query(models.Patient).filter_by(id=p_id).first()

        if patient is not None:
            db.session.remove(patient)
            db.session.commit()
            return jsonify(
                {"message": "patient deleted successfully"}
            ), 200

        return jsonify(
            {f"message": "patient with id {p_id} does not exist."}
        ), 200
    except:
        return jsonify(
            {"message": "failed to delete patient..."}
        ), 500
    
@delete.route('/api/delete-appointment', methods=['POST'])
# @jwt_required()
def delete_appointment():
    data = request.get_json()
    a_id = data['id']

    try:
        appointment = db.session.query(models.Appointment).filter_by(id=a_id).first()

        if appointment is not None:
            db.session.remove(appointment)
            db.session.commit()
            return jsonify(
                {"message": "appointment deleted successfully"}
            ), 200

        return jsonify(
            {f"message": "appointment with id {a_id} does not exist."}
        ), 200
    except:
        return jsonify(
            {"message": "failed to delete appointment..."}
        ), 500