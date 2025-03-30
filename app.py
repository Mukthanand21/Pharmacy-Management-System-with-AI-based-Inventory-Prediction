from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS

app = Flask(__name__)

# Configure the Database
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

db = SQLAlchemy(app)

# Define the User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

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

if __name__ == '__main__':
    app.run(debug=True)
