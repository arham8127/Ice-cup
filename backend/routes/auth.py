from flask import Blueprint, request, jsonify
from config import db
import bcrypt
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)
SECRET_KEY = 'icecup_secret_key_2025'

# ===== SIGNUP =====
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    fname = data.get('fname')
    lname = data.get('lname')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    if not all([fname, lname, email, phone, password]):
        return jsonify({'error': 'All fields are required'}), 400

    # Check existing user
    if db.users.find_one({'email': email}):
        return jsonify({'error': 'Email already registered'}), 409

    # Hash password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Save user
    user = {
        'fname': fname,
        'lname': lname,
        'email': email,
        'phone': phone,
        'password': hashed,
        'created_at': datetime.datetime.utcnow()
    }
    db.users.insert_one(user)

    return jsonify({'message': 'Account created successfully!'}), 201


# ===== LOGIN =====
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Email and password required'}), 400

    user = db.users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    # Generate JWT token
    token = jwt.encode({
        'email': email,
        'name': f"{user['fname']} {user['lname']}",
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'name': f"{user['fname']} {user['lname']}",
        'email': email
    }), 200


# ===== GET PROFILE =====
@auth_bp.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token required'}), 401
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = db.users.find_one({'email': data['email']})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({
            'name': f"{user['fname']} {user['lname']}",
            'email': user['email'],
            'phone': user['phone']
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except:
        return jsonify({'error': 'Invalid token'}), 401