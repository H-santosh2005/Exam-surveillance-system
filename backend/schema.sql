-- Online Exam Surveillance System - MySQL schema
-- Matches backend/models.py

CREATE DATABASE IF NOT EXISTS exam_surveillance CHARACTER SET utf8mb4;
USE exam_surveillance;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','faculty','admin') NOT NULL,
  roll_no VARCHAR(40),
  course VARCHAR(120),
  department VARCHAR(120),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE face_embeddings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  embedding TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(200),
  exam_date DATE NOT NULL,
  start_time VARCHAR(20),
  end_time VARCHAR(20),
  duration_min INT NOT NULL,
  created_by INT,
  status ENUM('upcoming','live','completed') DEFAULT 'upcoming',
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_option TINYINT NOT NULL,
  marks INT DEFAULT 1,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

CREATE TABLE exam_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('in_progress','completed') DEFAULT 'in_progress',
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,
  score INT,
  total_marks INT,
  flagged BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_option TINYINT,
  marked_for_review BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE monitoring_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  alert_type ENUM('no_face','multiple_faces','tab_switch','face_mismatch') NOT NULL,
  detail VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id) ON DELETE CASCADE
);

-- Helpful indexes for the live faculty/admin dashboards
CREATE INDEX idx_sessions_exam ON exam_sessions(exam_id);
CREATE INDEX idx_alerts_session ON monitoring_alerts(session_id);
