from flask import Flask
from flask_cors import CORS
from models import db, bcrypt
from routes import api
from flask_jwt_extended import JWTManager
import database_defaults

app = Flask(__name__)
app.config['SECRET_KEY'] = 'uhm, i like corndogs?'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medsync.sqlite3'
app.register_blueprint(api)

cors = CORS(app, origins='*')

jwt = JWTManager(app)
bcrypt.init_app(app)
db.init_app(app)
with app.app_context():
    db.create_all()

    database_defaults.populate_people(db)

if __name__ == "__main__":
    app.run(debug=True, port=8080)