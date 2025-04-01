from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from flask_cors import CORS
import jwt
import datetime
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# Configure the Database
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

db = SQLAlchemy(app)
#migrate = Migrate(app, db)

with app.app_context():
    db.drop_all()   # Drop all existing tables
    db.create_all() 
# Define the User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=True) 
# Create database tables
with app.app_context():
    db.create_all()

# Home Route (Loads the Frontend)
@app.route('/')
def home():
    return render_template('index.html')

# API Route to Add User
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    print("Received Data:", data)  # ✅ Debugging log

    try:
        new_user = User(name=data['name'], email=data['email'])
        db.session.add(new_user)
        db.session.commit()
        print("User added successfully!")  # ✅ Debugging log
        return jsonify({"message": "User added successfully!"})
    except Exception as e:
        print("Error:", e)  # ✅ Debugging log
        db.session.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 400

# Get All Users (Optional)
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [{"id": user.id, "name": user.name, "email": user.email} for user in users]
    return jsonify(users_list)


# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        token = jwt.encode({'email': user.email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'success': True, 'token': token})
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"success": False, "message": "Email already exists"}), 400

    new_user = User(name=data['name'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True, "message": "User registered successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
