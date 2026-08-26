from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

from extensions import db
from models import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.post('/login')
def login():
    """Body: { email, password, role }.
    `role` must match the account's stored role - a student cannot log into
    the faculty portal with correct credentials for a different role.
    """
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    role = data.get('role')

    if not email or not password or role not in ('student', 'faculty', 'admin'):
        return jsonify({'error': 'email, password and a valid role are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    if user.role != role:
        return jsonify({'error': f'This account is not registered as {role}.'}), 403

    token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role, 'name': user.name}
    )
    return jsonify({'token': token, 'user': user.to_dict()})


@auth_bp.get('/me')
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()})


@auth_bp.post('/register')
def register():
    """Simple self-service registration, primarily used by seed.py / admin
    onboarding. In production this would be gated behind an admin-only route."""
    data = request.get_json(silent=True) or {}
    required = ['name', 'email', 'password', 'role']
    if not all(data.get(f) for f in required):
        return jsonify({'error': 'name, email, password and role are required'}), 400
    if data['role'] not in ('student', 'faculty', 'admin'):
        return jsonify({'error': 'Invalid role'}), 400
    if User.query.filter_by(email=data['email'].strip().lower()).first():
        return jsonify({'error': 'Email already registered'}), 409

    user = User(
        name=data['name'],
        email=data['email'].strip().lower(),
        password_hash=generate_password_hash(data['password']),
        role=data['role'],
        roll_no=data.get('roll_no'),
        course=data.get('course'),
        department=data.get('department')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'user': user.to_dict()}), 201
