"""
Populates the database with demo accounts and a sample exam so the frontend
can be exercised end-to-end immediately after setup.

Usage:
    python seed.py
"""
from datetime import date
from werkzeug.security import generate_password_hash

from app import create_app
from extensions import db
from models import User, Exam, Question

DEMO_PASSWORD = 'Password123'

app = create_app()

with app.app_context():
    db.create_all()

    if not User.query.filter_by(email='santosh.cs@college.edu').first():
        student = User(
            name='Santosh Reddy', email='santosh.cs@college.edu',
            password_hash=generate_password_hash(DEMO_PASSWORD), role='student',
            roll_no='STU-2025-118', course='B.Tech CSE, 6th Semester'
        )
        db.session.add(student)

    if not User.query.filter_by(email='priya.sharma@college.edu').first():
        faculty = User(
            name='Dr. Priya Sharma', email='priya.sharma@college.edu',
            password_hash=generate_password_hash(DEMO_PASSWORD), role='faculty',
            department='Computer Science'
        )
        db.session.add(faculty)

    if not User.query.filter_by(email='admin@college.edu').first():
        admin = User(
            name='Admin User', email='admin@college.edu',
            password_hash=generate_password_hash(DEMO_PASSWORD), role='admin'
        )
        db.session.add(admin)

    db.session.commit()

    if not Exam.query.filter_by(title='Data Structures and Algorithms').first():
        exam = Exam(
            title='Data Structures and Algorithms',
            subtitle='End Semester Exam',
            exam_date=date(2025, 5, 18),
            start_time='11:00 AM',
            end_time='01:00 PM',
            duration_min=120,
            status='upcoming'
        )
        db.session.add(exam)
        db.session.commit()

        questions = [
            ('What is the time complexity of binary search?', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1),
            ('Which data structure uses FIFO order?', ['Stack', 'Queue', 'Tree', 'Graph'], 1),
            ('What is the worst-case time complexity of Quick Sort?', ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], 2),
            ('A binary tree where every node has 0 or 2 children is called?', ['Full binary tree', 'Complete binary tree', 'Skewed tree', 'AVL tree'], 0),
            ('Which of the following is not a linear data structure?', ['Array', 'Linked List', 'Tree', 'Stack'], 2),
            ('What is the space complexity of merge sort?', ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], 2),
            ('Which traversal visits the root node first?', ['Inorder', 'Preorder', 'Postorder', 'Level order'], 1),
            ('A hash table resolves collisions using linked lists - this is called?', ['Open addressing', 'Chaining', 'Probing', 'Rehashing'], 1),
            ('Which sorting algorithm is stable?', ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], 2),
            ('The maximum number of children a node can have in a binary tree is?', ['1', '2', '3', 'Unlimited'], 1),
        ]
        for text, opts, correct in questions:
            db.session.add(Question(
                exam_id=exam.id, text=text,
                option_a=opts[0], option_b=opts[1], option_c=opts[2], option_d=opts[3],
                correct_option=correct, marks=1
            ))
        db.session.commit()

    print('Seed complete. Demo logins (password for all: %s):' % DEMO_PASSWORD)
    print('  Student  -> santosh.cs@college.edu')
    print('  Faculty  -> priya.sharma@college.edu')
    print('  Admin    -> admin@college.edu')
