from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import User, FaceEmbedding
from utils.vision import (
    decode_base64_image, get_face_embedding, compare_embeddings,
    embedding_to_json, embedding_from_json
)
from config import Config

face_bp = Blueprint('face', __name__)


@face_bp.post('/enroll')
@jwt_required()
def enroll():
    """Capture Live Image -> FaceNet Model -> Generate Embedding -> Store.
    Run once when a student is first registered (or re-run by an admin)."""
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    image_data = data.get('image')
    if not image_data:
        return jsonify({'error': 'image is required (base64 data URL)'}), 400

    try:
        _, rgb = decode_base64_image(image_data)
        embedding = get_face_embedding(rgb)
    except RuntimeError as e:
        return jsonify({'error': str(e)}), 500

    if embedding is None:
        return jsonify({'error': 'Could not find exactly one clear face in the frame.'}), 422

    existing = FaceEmbedding.query.filter_by(user_id=user_id).first()
    if existing:
        existing.embedding = embedding_to_json(embedding)
    else:
        db.session.add(FaceEmbedding(user_id=user_id, embedding=embedding_to_json(embedding)))
    db.session.commit()
    return jsonify({'status': 'enrolled'})


@face_bp.post('/verify')
@jwt_required()
def verify():
    """Live Capture -> FaceNet Model -> Generate Embedding -> Compare with
    Stored Embedding -> Match? -> Access Granted / Access Denied (Fig 5.1)."""
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    image_data = data.get('image')
    if not image_data:
        return jsonify({'error': 'image is required (base64 data URL)'}), 400

    stored = FaceEmbedding.query.filter_by(user_id=user_id).first()
    if not stored:
        return jsonify({'error': 'No enrolled face on file. Please enroll first.'}), 404

    try:
        _, rgb = decode_base64_image(image_data)
        live_embedding = get_face_embedding(rgb)
    except RuntimeError as e:
        return jsonify({'error': str(e)}), 500

    if live_embedding is None:
        return jsonify({'match': False, 'reason': 'no_single_face'}), 200

    is_match, distance = compare_embeddings(
        embedding_from_json(stored.embedding), live_embedding, Config.FACE_MATCH_TOLERANCE
    )
    return jsonify({'match': is_match, 'distance': round(distance, 4)})
