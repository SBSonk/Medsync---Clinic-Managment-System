from flask import Flask, Response, request
from flask_cors import CORS
from models import db, bcrypt, User
from routes import api
from flask_jwt_extended import JWTManager
import database_defaults

app = Flask(__name__)
app.config['SECRET_KEY'] = 'uhm, i like corndogs?'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medsync.sqlite3'

CORS(app, origins=['http://localhost:5173'], methods=["GET", "POST", "OPTIONS"])

app.register_blueprint(api)

jwt = JWTManager(app)
bcrypt.init_app(app)
db.init_app(app)
with app.app_context():
    inspector = db.inspect(db.engine)
    
    if "person" not in inspector.get_table_names():  # 🔹 Check for a specific table
        db.create_all()
        database_defaults.populate_people(db)
        default_admin = User('test@email.com', 'admin', 'tite', 'master betlog', 2)
        db.session.add(default_admin)
        db.session.commit()
        
@app.before_request # fixes cors error
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()

if __name__ == "__main__":
    app.run(debug=True, port=8080)