from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from models import Exam, ExamSession, User, MonitoringAlert

dashboard_bp = Blueprint('dashboard', __name__)


def _require_role(*roles):
    claims = get_jwt()
    return claims.get('role') in roles


@dashboard_bp.get('/faculty')
@jwt_required()
def faculty_dashboard():
    if not _require_role('faculty', 'admin'):
        return jsonify({'error': 'Forbidden'}), 403

    total_exams = Exam.query.count()
    live_exams = Exam.query.filter_by(status='live').count()
    completed_exams = Exam.query.filter_by(status='completed').count()
    total_students = User.query.filter_by(role='student').count()

    return jsonify({
        'total_exams': total_exams,
        'live_exams': live_exams,
        'completed_exams': completed_exams,
        'total_students': total_students
    })


@dashboard_bp.get('/admin')
@jwt_required()
def admin_dashboard():
    if not _require_role('admin'):
        return jsonify({'error': 'Forbidden'}), 403

    total_exams = Exam.query.count()
    live_exams = Exam.query.filter_by(status='live').count()
    completed_exams = Exam.query.filter_by(status='completed').count()
    flagged_sessions = ExamSession.query.filter_by(flagged=True).count()
    total_alerts = MonitoringAlert.query.count()

    return jsonify({
        'total_exams': total_exams,
        'live_exams': live_exams,
        'completed_exams': completed_exams,
        'flagged_sessions': flagged_sessions,
        'total_alerts': total_alerts
    })
