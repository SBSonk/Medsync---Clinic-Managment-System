from flask import Flask, render_template, abort, url_for, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import models
from models import db
import database_defaults

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medsync.sqlite3'

cors = CORS(app, origins='*')

db.init_app(app)
with app.app_context():
    db.create_all()

    database_defaults.populate_people(db)

@app.route("/api/people", methods=['GET'])
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


if __name__ == "__main__":
    app.run(debug=True, port=8080)