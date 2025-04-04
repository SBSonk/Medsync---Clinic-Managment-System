from flask import Blueprint, jsonify
from models import db
import models

delete = Blueprint('delete', __name__)

# Creation routes
@delete.route('/api/user/<id>', methods=['DELETE'])
# @jwt_required()
def delete_user(id):
    u = db.session.query(models.User).filter_by(id=id).first()

    if u is not None:
        try:
            db.session.delete(u)
            db.session.commit()
            return jsonify(
                {"message": "user deleted successfully"}
            ), 200
        except:
            db.session.rollback()
            return jsonify({"message": "failed to delete user..."}), 500
        
    return jsonify({f"message": "user with id {id} does not exist."}), 404 

@delete.route('/api/delete-person/<id>', methods=['DELETE'])
# @jwt_required()
def delete_person(id):

    p = db.session.query(models.Person).filter_by(id=id).first()

    if p is not None:
        try:
            db.session.delete(p)
            db.session.commit()
            return jsonify(
                {"message": "person deleted successfully"}
            ), 200
        except:
            db.session.rollback()
            return jsonify({"message": "failed to delete person..."}), 500
        
    return jsonify({f"message": "person with id {id} does not exist."}), 404 
    
@delete.route('/api/delete-employee/<id>', methods=['DELETE'])
# @jwt_required()
def delete_employee(id):
    employee = db.session.query(models.Employee).filter_by(id=id).first()

    if employee is not None:
        try:
            db.session.delete(employee)
            db.session.commit()
            return jsonify({"message": "employee deleted successfully"}), 200
        except:
            db.session.rollback()
            return jsonify({"message": "failed to delete employee..."}), 500

    return jsonify({f"message": "employee with id {id} does not exist."}), 404
    
@delete.route('/api/delete-patient/<id>', methods=['DELETE'])
# @jwt_required()
def delete_patient(id):
    patient = db.session.query(models.Patient).filter_by(id=id).first()

    if patient is not None:
        try:
            db.session.delete(patient)
            db.session.commit()
            return jsonify({"message": "patient deleted successfully"}), 200
        except:
            db.session.rollback()
            return jsonify({"message": "failed to delete patient..."}), 500
    return jsonify({f"message": "patient with id {id} does not exist."}), 404

@delete.route('/api/delete-appointment/<id>', methods=['DELETE'])
# @jwt_required()
def delete_inventory(id):
    appointment = db.session.query(models.Appointment).filter_by(id=id).first()

    if appointment is not None:
        try:
            db.session.delete(appointment)
            db.session.commit()
            return jsonify({"message": "appointment deleted successfully"}), 200
        except:
            db.session.rollback()
            return jsonify({"message": "failed to delete appointment..."}), 500
    return jsonify({f"message": "appointment with id {id} does not exist."}), 404
    

@delete.route('/api/delete-inventory/<id>', methods=['DELETE'])
# @jwt_required()
def delete_inventory(id):
    inventory_item = db.session.query(models.Inventory).filter_by(id=id).first()

    if inventory_item is not None:
        try:
            db.session.remove(inventory_item)
            db.session.commit()
            return jsonify({"message": "inventory item deleted successfully"}), 200
        except:
            db.session.rollback()
            return jsonify({"message": "failed to delete inventory item..."}), 500
    return jsonify({f"message": "inventory item with id {id} does not exist."}), 404
    