# Backend - Flask + MySQL

Implements the exact pipeline described in the project synopsis:

| Synopsis section | Implementation |
|---|---|
| 5.1 FaceNet for Authentication | `utils/vision.py::get_face_embedding` / `compare_embeddings`, exposed via `routes/face.py` (`/api/face/enroll`, `/api/face/verify`). Uses `face_recognition`'s 128-d ResNet embedding as the practical FaceNet-equivalent. |
| 5.2 Haar Cascade for Face Detection | `utils/vision.py::detect_faces_haar` (OpenCV's bundled `haarcascade_frontalface_default.xml`), exposed via `routes/proctor.py` (`POST /api/proctor/detect-frame`). |
| 5.3 Rule-Based Activity Monitoring | Same endpoint auto-logs a `MonitoringAlert` row when face count != 1; `POST /api/proctor/log-event` logs tab-switch events sent from the browser's Page Visibility API. |
| 5.4 Real-Time Monitoring & Reporting | `GET /api/proctor/alerts/<session_id>` and `/api/proctor/live-sessions` feed the Faculty/Admin dashboards; `/api/exams/results/*` generates the reports. |

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

This installs everything **except** face verification: login, exams, Haar
Cascade live monitoring, tab-switch detection, dashboards, and MySQL all work
immediately after this step.

> **Common Windows error:** if `pip install -r requirements.txt` previously
> included `face_recognition`/`dlib` and failed partway through (a
> `ModuleNotFoundError: No module named 'werkzeug'` when running `seed.py` is
> the telltale symptom - it means the install aborted before Flask's own
> deps landed), just re-run `pip install -r requirements.txt` now; the
> current `requirements.txt` has no C++-build dependencies and will install
> cleanly on any OS.

### Optional: enable real face verification (Sec 5.1)

`/api/face/enroll` and `/api/face/verify` need `face_recognition`, which
depends on `dlib` - a C++ extension that needs CMake + a compiler to build.
Once you have those set up:

```bash
pip install -r requirements-face.txt
```

See the comments inside `requirements-face.txt` for the Windows/macOS/Linux
build-tool setup. Until you install it, `/api/face/*` returns a clean error
instead of crashing the server - every other route works fine without it.

Create the database (matches `config.py`):

```bash
mysql -u root -p -e "CREATE DATABASE exam_surveillance CHARACTER SET utf8mb4;"
```

Copy `.env.example` to `.env` and fill in your MySQL credentials.

Create tables and demo accounts:

```bash
python seed.py
```

This prints three ready-to-use logins (password `Password123` for all):
- Student &mdash; `santosh.cs@college.edu`
- Faculty &mdash; `priya.sharma@college.edu`
- Admin &mdash; `admin@college.edu`

Run the API:

```bash
python app.py
```

Server listens on `http://localhost:5000`. Health check: `GET /api/health`.

## API summary

```
POST /api/auth/login          { email, password, role } -> { token, user }
GET  /api/auth/me             (Bearer token)

POST /api/face/enroll         { image: base64 } -> store embedding
POST /api/face/verify         { image: base64 } -> { match, distance }

POST /api/proctor/detect-frame  { image, session_id } -> { face_count, status }
POST /api/proctor/log-event     { session_id, alert_type, detail }
GET  /api/proctor/alerts/<id>
GET  /api/proctor/live-sessions

GET  /api/exams
GET  /api/exams/<id>/questions
POST /api/exams/<id>/start
POST /api/exams/sessions/<id>/submit   { answers: {qid: option} }
GET  /api/exams/results/me
GET  /api/exams/results/all   (faculty/admin only)

GET  /api/dashboard/faculty
GET  /api/dashboard/admin
```

All routes except `/auth/login`, `/auth/register`, `/exams` (list) require an
`Authorization: Bearer <token>` header issued by `/auth/login`.
