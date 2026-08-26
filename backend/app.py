from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db, jwt

from routes.auth import auth_bp
from routes.face import face_bp
from routes.proctor import proctor_bp
from routes.exams import exams_bp
from routes.dashboard import dashboard_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(face_bp, url_prefix='/api/face')
    app.register_blueprint(proctor_bp, url_prefix='/api/proctor')
    app.register_blueprint(exams_bp, url_prefix='/api/exams')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    @app.get('/api/health')
    def health():
        return jsonify({'status': 'ok'})

    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):
        return jsonify({'error': 'Session expired, please log in again.'}), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({'error': 'Invalid session token.'}), 401

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
