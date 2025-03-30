from flask import Flask, render_template, abort, url_for, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medsync.db'

cors = CORS(app, origins='*')

db.init_app(app)
with app.app_context():
    db.create_all()

@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'noah',
                'lloyd',
                'matthew',
                'stanley'
            ]
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=8080)