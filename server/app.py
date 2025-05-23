from flask import Flask, Response, request
from flask_cors import CORS
from models import db, bcrypt, User
from flask_jwt_extended import JWTManager
import database_defaults
import routes.auth
import routes.create_routes
import routes.delete_routes
import routes.get_routes
import routes.update_routes
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SECRET_KEY'] = 'uhm, i like corndogs?'
app.config['JWT_SECRET_KEY'] = 'i like eggs'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medsync.sqlite3'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

app.config["JWT_BLACKLIST_ENABLED"] = True
app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]

app.register_blueprint(routes.auth.auth)
app.register_blueprint(routes.create_routes.create)
app.register_blueprint(routes.get_routes.get)
app.register_blueprint(routes.delete_routes.delete)
app.register_blueprint(routes.update_routes.update)

CORS(app, origins=['*', 'http://localhost:5173'], methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])

jwt = JWTManager(app)
bcrypt.init_app(app)
db.init_app(app)
with app.app_context():
    inspector = db.inspect(db.engine)
    
    if "person" not in inspector.get_table_names():  # 🔹 Check for a specific table
        db.create_all()
        database_defaults.populate_people(db)
        database_defaults.populate_inventory(db)
        database_defaults.populate_patients(db)
        a = User('test@email.com', 'admin', 'tite', 'admin', 'why did the chicken cross the road?', 'to get to the other side!')
        b = User('test2@email.com', 'employee', 'tite', 'employee', 'marco', 'polo')
        db.session.add(a)
        db.session.add(b)
        
        db.session.commit()
        
@app.before_request # fixes cors error
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()

@jwt.token_in_blocklist_loader # token blocklist
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in routes.auth.blacklist

if __name__ == "__main__":
    app.run(debug=True, port=8080)