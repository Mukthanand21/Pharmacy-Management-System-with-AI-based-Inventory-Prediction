from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ✅ PostgreSQL Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Mukthu%4021@localhost:5432/pharmacy_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ✅ Define the User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # ✅ Storing password in plain text (Not for production)

# ✅ Create database tables (if not exists)
with app.app_context():
    db.create_all()

# ✅ Home Route (Optional)
@app.route('/')
def home():
    return jsonify({"message": "Pharmacy Management System API is running!"})

# ✅ Signup API (Register New User)
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"success": False, "message": "Email already exists"}), 400

    new_user = User(name=data['name'], email=data['email'], password=data['password'])  # Storing plain text password
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True, "message": "User registered successfully!"})

# ✅ Login API (Authenticate User)
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], password=data['password']).first()  # Direct password check
    if user:
        return jsonify({"success": True, "message": "Login successful!"})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

# ✅ Get All Users (Optional - For Testing)
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [{"id": user.id, "name": user.name, "email": user.email} for user in users]
    return jsonify(users_list)

# ✅ Run Flask App
if __name__ == '__main__':
    app.run(debug=True)
