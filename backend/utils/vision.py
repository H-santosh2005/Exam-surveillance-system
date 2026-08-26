import base64
import io
import json

import cv2
import numpy as np
from PIL import Image

try:
    import face_recognition
    FACE_RECOGNITION_AVAILABLE = True
except ImportError:
    # face_recognition (dlib-based ResNet embeddings, the FaceNet-equivalent
    # described in Sec 5.1) requires a compiled dlib. If it isn't installed,
    # the app still runs - enrollment/verification endpoints return a clear
    # error instead of crashing the whole server.
    FACE_RECOGNITION_AVAILABLE = False

# Haar Cascade classifier bundled with OpenCV - Sec 5.2
_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')


def decode_base64_image(data_url: str) -> np.ndarray:
    """Accepts a `data:image/jpeg;base64,...` string from the browser canvas
    capture and returns a BGR numpy array (OpenCV format)."""
    if ',' in data_url:
        data_url = data_url.split(',', 1)[1]
    raw = base64.b64decode(data_url)
    pil_img = Image.open(io.BytesIO(raw)).convert('RGB')
    rgb = np.array(pil_img)
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    return bgr, rgb


def detect_faces_haar(bgr_image: np.ndarray):
    """Sec 5.2 - Haar Cascade for Real-Time Face Detection.
    Returns (face_count, boxes) where boxes are (x, y, w, h) in pixel coords.
    Rules: 1 face -> OK, 0 faces -> alert (no_face), >1 faces -> alert (multiple_faces).
    """
    gray = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    faces = _face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=6, minSize=(60, 60)
    )
    return len(faces), faces.tolist() if len(faces) else []


def get_face_embedding(rgb_image: np.ndarray):
    """Sec 5.1 - FaceNet-style embedding generation.
    Uses face_recognition's 128-d ResNet embedding as the practical
    equivalent of a FaceNet embedding described in the synopsis.
    Returns None if zero or more than one face is found in the enrollment shot.
    """
    if not FACE_RECOGNITION_AVAILABLE:
        raise RuntimeError('face_recognition is not installed on this server.')

    locations = face_recognition.face_locations(rgb_image, model='hog')
    if len(locations) != 1:
        return None
    encodings = face_recognition.face_encodings(rgb_image, known_face_locations=locations)
    if not encodings:
        return None
    return encodings[0].tolist()  # 128 floats


def compare_embeddings(stored_embedding: list, live_embedding: list, tolerance: float = 0.5):
    """Sec 5.1 - Compare with Stored Embedding -> Match? decision.
    Returns (is_match, distance). Lower distance = more similar.
    """
    if not FACE_RECOGNITION_AVAILABLE:
        raise RuntimeError('face_recognition is not installed on this server.')
    stored = np.array(stored_embedding)
    live = np.array(live_embedding)
    distance = float(np.linalg.norm(stored - live))
    return distance <= tolerance, distance


def embedding_to_json(embedding: list) -> str:
    return json.dumps(embedding)


def embedding_from_json(text: str) -> list:
    return json.loads(text)
