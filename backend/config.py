import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MySQL connection - matches the synopsis's stated Software Requirements
    # (Database: MySQL, Programming Language: Python, Web server: Flask)
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'password')
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
    MYSQL_DB = os.getenv('MYSQL_DB', 'exam_surveillance')

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 8  # 8 hours

    # Haar Cascade rule thresholds (Sec 5.3 of the synopsis)
    NO_FACE_ALERT_AFTER_MISSES = 2       # consecutive failed checks before "Looking Away" alert
    MULTIPLE_FACE_CONFIDENCE = True       # any frame with >1 face raises an alert immediately
    FACE_MATCH_TOLERANCE = 0.5            # face_recognition embedding distance threshold (FaceNet-style)

    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
