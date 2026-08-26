from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from extensions import db
from models import Exam, Question, ExamSession, Answer, User

exams_bp = Blueprint('exams', __name__)


@exams_bp.get('')
def list_exams():
    exams = Exam.query.order_by(Exam.exam_date.desc()).all()
    return jsonify({'exams': [e.to_dict() for e in exams]})


@exams_bp.get('/<int:exam_id>/questions')
@jwt_required()
def get_questions(exam_id):
    questions = Question.query.filter_by(exam_id=exam_id).all()
    return jsonify({'questions': [q.to_dict() for q in questions]})


@exams_bp.post('/<int:exam_id>/start')
@jwt_required()
def start_exam(exam_id):
    user_id = int(get_jwt_identity())
    exam = Exam.query.get_or_404(exam_id)

    existing = ExamSession.query.filter_by(exam_id=exam_id, user_id=user_id, status='in_progress').first()
    if existing:
        return jsonify({'session': existing.to_dict()})

    total_marks = db.session.query(db.func.sum(Question.marks)).filter_by(exam_id=exam_id).scalar() or 0
    session = ExamSession(exam_id=exam_id, user_id=user_id, total_marks=total_marks)
    db.session.add(session)
    db.session.commit()
    return jsonify({'session': session.to_dict()}), 201


@exams_bp.post('/sessions/<int:session_id>/submit')
@jwt_required()
def submit_exam(session_id):
    """Body: { answers: { "<question_id>": <selected_option>, ... } }"""
    user_id = int(get_jwt_identity())
    session = ExamSession.query.get_or_404(session_id)
    if session.user_id != user_id:
        return jsonify({'error': 'Not your session'}), 403
    if session.status == 'completed':
        return jsonify({'session': session.to_dict()})

    data = request.get_json(silent=True) or {}
    submitted_answers = data.get('answers', {})

    questions = Question.query.filter_by(exam_id=session.exam_id).all()
    score = 0
    for q in questions:
        selected = submitted_answers.get(str(q.id))
        db.session.add(Answer(session_id=session.id, question_id=q.id, selected_option=selected))
        if selected is not None and int(selected) == q.correct_option:
            score += q.marks

    session.score = score
    session.status = 'completed'
    session.submitted_at = datetime.utcnow()
    db.session.commit()

    return jsonify({'session': session.to_dict()})


@exams_bp.get('/results/me')
@jwt_required()
def my_results():
    user_id = int(get_jwt_identity())
    sessions = (ExamSession.query
                .filter_by(user_id=user_id, status='completed')
                .order_by(ExamSession.submitted_at.desc()).all())
    results = []
    for s in sessions:
        exam = Exam.query.get(s.exam_id)
        results.append({
            **s.to_dict(),
            'exam_title': exam.title if exam else 'Unknown',
            'exam_date': exam.exam_date.isoformat() if exam else None
        })
    return jsonify({'results': results})


@exams_bp.get('/results/all')
@jwt_required()
def all_results():
    """Faculty/Admin results table."""
    claims = get_jwt()
    if claims.get('role') not in ('faculty', 'admin'):
        return jsonify({'error': 'Forbidden'}), 403

    sessions = ExamSession.query.filter_by(status='completed').all()
    results = []
    for s in sessions:
        user = User.query.get(s.user_id)
        pct = round((s.score / s.total_marks) * 100) if s.total_marks else 0
        grade = 'A' if pct >= 80 else 'B' if pct >= 65 else 'C' if pct >= 50 else 'D' if pct >= 35 else 'F'
        results.append({
            **s.to_dict(),
            'student_name': user.name if user else 'Unknown',
            'percentage': pct,
            'grade': grade,
            'pass': pct >= 35
        })
    return jsonify({'results': results})
