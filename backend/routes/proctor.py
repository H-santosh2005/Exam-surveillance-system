from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import ExamSession, MonitoringAlert
from utils.vision import decode_base64_image, detect_faces_haar

proctor_bp = Blueprint('proctor', __name__)


@proctor_bp.post('/detect-frame')
@jwt_required()
def detect_frame():
    """Webcam Feed -> Haar Cascade Classifier -> Detection Result (Fig 5.2).
    Body: { image: <base64 data URL>, session_id: <int> }
    Returns face_count + a status the frontend maps straight to the
    'AI Monitoring Status' panel, and auto-logs an alert when the rule is
    broken (0 or >1 faces), per Sec 5.3.
    """
    data = request.get_json(silent=True) or {}
    image_data = data.get('image')
    session_id = data.get('session_id')
    if not image_data:
        return jsonify({'error': 'image is required'}), 400

    bgr, _ = decode_base64_image(image_data)
    face_count, boxes = detect_faces_haar(bgr)

    if face_count == 0:
        status = 'no_face'
    elif face_count > 1:
        status = 'multiple_faces'
    else:
        status = 'ok'

    alert_logged = False
    if session_id and status != 'ok':
        session = ExamSession.query.get(session_id)
        if session:
            alert = MonitoringAlert(
                session_id=session_id,
                alert_type=status,
                detail=f'{face_count} face(s) detected'
            )
            db.session.add(alert)
            if status == 'multiple_faces':
                session.flagged = True
            db.session.commit()
            alert_logged = True

    return jsonify({
        'face_count': face_count,
        'status': status,
        'boxes': boxes,
        'alert_logged': alert_logged
    })


@proctor_bp.post('/log-event')
@jwt_required()
def log_event():
    """Rule-based activity monitoring (Sec 5.3) for events the browser can
    detect directly, e.g. tab switching via the Page Visibility API.
    Body: { session_id, alert_type: 'tab_switch', detail }
    """
    data = request.get_json(silent=True) or {}
    session_id = data.get('session_id')
    alert_type = data.get('alert_type')
    detail = data.get('detail', '')

    if not session_id or alert_type not in ('tab_switch', 'no_face', 'multiple_faces', 'face_mismatch'):
        return jsonify({'error': 'session_id and a valid alert_type are required'}), 400

    session = ExamSession.query.get(session_id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404

    alert = MonitoringAlert(session_id=session_id, alert_type=alert_type, detail=detail)
    session.flagged = True
    db.session.add(alert)
    db.session.commit()
    return jsonify({'status': 'logged', 'alert': alert.to_dict()})


@proctor_bp.get('/alerts/<int:session_id>')
@jwt_required()
def get_alerts(session_id):
    """Used by the Faculty/Admin 'Live Monitoring' and 'Review & Grade' pages."""
    alerts = (MonitoringAlert.query
              .filter_by(session_id=session_id)
              .order_by(MonitoringAlert.created_at.desc())
              .limit(50).all())
    return jsonify({'alerts': [a.to_dict() for a in alerts]})


@proctor_bp.get('/live-sessions')
@jwt_required()
def live_sessions():
    """Faculty/Admin: all currently in-progress sessions with their latest
    flag status, for the 'Live Monitoring' dashboard grid."""
    sessions = ExamSession.query.filter_by(status='in_progress').all()
    return jsonify({'sessions': [s.to_dict() for s in sessions]})
