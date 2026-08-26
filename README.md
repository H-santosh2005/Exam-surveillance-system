# Online Exam Surveillance System

Full-stack implementation of the "Online Exam Surveillance System for College Students Using
Face Recognition and AI-Based Proctoring" synopsis (Dept. of CSE, RYMEC) - three separate,
login-gated portals (Student / Faculty / Admin), a React frontend, and a Flask + MySQL backend
that runs the actual FaceNet-style authentication + Haar Cascade monitoring + rule-based alert
pipeline described in Section 5 of the document.

```
Browser (React 18 + Vite)  --REST/JWT-->  Flask API  --SQLAlchemy-->  MySQL
        |                                     |
   getUserMedia (webcam)              OpenCV Haar Cascade
   canvas.toDataURL() frame           face_recognition (FaceNet-style embeddings)
        |                                     |
        +------------ periodic frame POST ----+
```

## What's real vs. what's simulated

**Real:**
- Login is real - three separate JWT-authenticated logins (Student/Faculty/Admin), each
  redirecting only to its own portal, backed by a MySQL `users` table with hashed passwords.
- Face **enrollment & verification** (Sec 5.1) - the browser captures a real webcam frame and
  POSTs it to Flask, which generates a 128-d embedding (`face_recognition`, the practical
  equivalent of FaceNet) and compares it against the stored one. Access is granted/denied based
  on a genuine distance calculation, exactly per Fig 5.1 in the synopsis.
- Live **Haar Cascade monitoring** (Sec 5.2) - every ~2 seconds during the exam, the browser
  sends a fresh webcam frame to Flask, which runs OpenCV's Haar Cascade classifier on it server
  side and returns the real face count. 0 faces or 2+ faces both raise a real alert row in MySQL.
- **Rule-based tab-switch detection** (Sec 5.3) - the Page Visibility API fires a real event to
  the backend the moment a student switches away from the exam tab.
- Real exam session lifecycle, timer, MCQ scoring, and results, all persisted in MySQL.

**Simulated (clearly labeled in the UI):** the Faculty/Admin "Live Monitoring" grids that show
*other* students' tiles - a frontend+single-Flask-instance demo has no WebRTC signalling layer to
receive live video from many devices at once, so those tiles animate on a real clock with a
seeded pattern. You can drop your own camera into that same grid to see genuinely live,
backend-verified detection sitting alongside them.

## Repository layout

```
backend/            Flask API (app.py, models.py, routes/, utils/vision.py, schema.sql, seed.py)
src/
  api/client.js      fetch wrapper -> Flask endpoints (JWT attached automatically)
  context/
    AuthContext.jsx  login/logout, current user, token persistence
    AppContext.jsx   exam-session UI state (answers, marked, alert feed)
  hooks/
    useWebcam.js     getUserMedia
    useProctoring.js captures frames + calls /api/proctor/detect-frame on an interval
  components/        Sidebar, LiveProctorPanel, ProtectedRoute, StudentFeedTile, ...
  pages/
    Login.jsx        shared login form, themed per role (:role route param)
    PortalSelect.jsx landing page -> /login/student | /login/faculty | /login/admin
    student/         Dashboard, SystemCheck, FaceVerification, ActiveExam, Results, ...
    faculty/         Dashboard, LiveMonitoring, ReviewGrade, Results, ...
    admin/           Dashboard, LiveMonitoring, Analytics (recharts), Results, ...
```

## Getting started

**1. Backend** (see `backend/README.md` for full detail)

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
mysql -u root -p -e "CREATE DATABASE exam_surveillance CHARACTER SET utf8mb4;"
cp .env.example .env   # fill in your MySQL credentials
python seed.py          # creates demo logins + the DSA exam
python app.py           # runs on http://localhost:5000
```

**2. Frontend**

```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api (default is already correct)
npm run dev             # runs on http://localhost:5173
```

**3. Log in**

Open `http://localhost:5173`, pick a portal, and sign in with one of the seeded accounts
(password `Password123` for all):

| Role | Email |
|---|---|
| Student | `santosh.cs@college.edu` |
| Faculty | `priya.sharma@college.edu` |
| Admin | `admin@college.edu` |

Each login only grants access to its matching portal - a student account cannot sign into the
faculty or admin routes, enforced both by the backend (`role` check on `/api/auth/login`) and the
frontend (`ProtectedRoute`).

## Portal flow (mirrors the reference dashboards)

- **Student**: Dashboard &rarr; System Check &rarr; Face Verification (real FaceNet-style match)
  &rarr; Active Exam (real Haar Cascade monitoring + tab-switch detection) &rarr; **Results**.
- **Faculty**: Dashboard &rarr; Live Monitoring &rarr; Review & Grade flagged sessions &rarr;
  **Results**.
- **Admin**: Dashboard &rarr; Live Monitoring &rarr; Reports & Analytics (charts) &rarr;
  **Results & Reports**.
