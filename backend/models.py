from datetime import datetime
from extensions import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('student', 'faculty', 'admin', name='user_role'), nullable=False)
    roll_no = db.Column(db.String(40))          # students only
    course = db.Column(db.String(120))          # students only
    department = db.Column(db.String(120))      # faculty only
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'email': self.email, 'role': self.role,
            'roll_no': self.roll_no, 'course': self.course, 'department': self.department
        }


class FaceEmbedding(db.Model):
    """Stores the FaceNet-style 128-d embedding captured at enrollment (Sec 5.1)."""
    __tablename__ = 'face_embeddings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    embedding = db.Column(db.Text, nullable=False)  # JSON-encoded list of 128 floats
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Exam(db.Model):
    __tablename__ = 'exams'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subtitle = db.Column(db.String(200))
    exam_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.String(20))
    end_time = db.Column(db.String(20))
    duration_min = db.Column(db.Integer, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    status = db.Column(db.Enum('upcoming', 'live', 'completed', name='exam_status'), default='upcoming')

    def to_dict(self):
        return {
            'id': self.id, 'title': self.title, 'subtitle': self.subtitle,
            'date': self.exam_date.isoformat() if self.exam_date else None,
            'start_time': self.start_time, 'end_time': self.end_time,
            'duration_min': self.duration_min, 'status': self.status
        }


class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(255), nullable=False)
    option_b = db.Column(db.String(255), nullable=False)
    option_c = db.Column(db.String(255), nullable=False)
    option_d = db.Column(db.String(255), nullable=False)
    correct_option = db.Column(db.Integer, nullable=False)  # 0=A,1=B,2=C,3=D
    marks = db.Column(db.Integer, default=1)

    def to_dict(self, include_answer=False):
        d = {
            'id': self.id, 'text': self.text,
            'options': [self.option_a, self.option_b, self.option_c, self.option_d],
            'marks': self.marks
        }
        if include_answer:
            d['correct_option'] = self.correct_option
        return d


class ExamSession(db.Model):
    """One student's attempt at one exam - tracks live proctoring status."""
    __tablename__ = 'exam_sessions'
    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum('in_progress', 'completed', name='session_status'), default='in_progress')
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    submitted_at = db.Column(db.DateTime)
    score = db.Column(db.Integer)
    total_marks = db.Column(db.Integer)
    flagged = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id, 'exam_id': self.exam_id, 'user_id': self.user_id,
            'status': self.status,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'score': self.score, 'total_marks': self.total_marks, 'flagged': self.flagged
        }


class Answer(db.Model):
    __tablename__ = 'answers'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('exam_sessions.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    selected_option = db.Column(db.Integer)  # nullable -> unattempted
    marked_for_review = db.Column(db.Boolean, default=False)


class MonitoringAlert(db.Model):
    """Rule-based activity log (Sec 5.3): no_face, multiple_faces, tab_switch."""
    __tablename__ = 'monitoring_alerts'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('exam_sessions.id'), nullable=False)
    alert_type = db.Column(db.Enum('no_face', 'multiple_faces', 'tab_switch', 'face_mismatch', name='alert_type'), nullable=False)
    detail = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id, 'session_id': self.session_id, 'alert_type': self.alert_type,
            'detail': self.detail, 'created_at': self.created_at.isoformat()
        }
