-- 1. USERS (Akun & Lokasi)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    location VARCHAR(100) DEFAULT 'Jakarta',
    latitude DECIMAL DEFAULT -6.200000,
    longitude DECIMAL DEFAULT 106.816666,
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRAYER LOGS (Checklist Sholat Wajib)
CREATE TABLE prayer_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    prayer_name VARCHAR(20) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, date, prayer_name)
);

-- 3. MASTER HABITS (List Sunnah & Target Mingguan)
CREATE TABLE master_habits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    target_label VARCHAR(50), 
    weekly_target_count INT DEFAULT 7
);
-- Seeding Data Awal
INSERT INTO master_habits (name, target_label, weekly_target_count) VALUES 
('Sholat Dhuha', '2/4 Rakaat', 3), ('Read the Hadith', '1 Hadith', 7),
('Shubuh Donation', 'Nominal Bebas', 7), ('Alms', 'Sedekah', 7);

-- 4. HABIT LOGS (Checklist Sunnah Harian)
CREATE TABLE habit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    habit_id INT REFERENCES master_habits(id),
    date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, habit_id, date)
);

-- 5. CUSTOM TASKS (Amalan Harian & Repeat)
CREATE TABLE custom_tasks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    note TEXT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    is_repeat BOOLEAN DEFAULT FALSE, -- Fitur Repeat
    is_completed BOOLEAN DEFAULT FALSE -- Untuk yg tidak repeat
);

-- 6. TASK LOGS (Log Harian untuk Task Repeat)
CREATE TABLE task_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    task_id INT REFERENCES custom_tasks(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, task_id, date)
);

-- 7. QURAN PLANS (Target Khatam)
CREATE TABLE quran_plans (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) DEFAULT 'Khatam Quran',
    total_pages INT DEFAULT 604,
    current_page INT DEFAULT 0,
    daily_target_pages INT DEFAULT 10,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
);

-- 8. QURAN LOGS (History Bacaan & Widget Harian)
CREATE TABLE quran_logs ( -- History untuk Streak
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT REFERENCES quran_plans(id),
    date DATE NOT NULL,
    pages_read INT DEFAULT 0,
    UNIQUE(user_id, date)
);
CREATE TABLE quran_daily_logs ( -- Widget +/- Harian
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    pages_read INT DEFAULT 0,
    daily_target INT DEFAULT 10,
    UNIQUE(user_id, date)
);

-- 9. FASTING LOGS (Puasa)
CREATE TABLE fasting_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type VARCHAR(50),
    UNIQUE(user_id, date)
);
CREATE TABLE fasting_goals (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    month INT, year INT, target_days INT DEFAULT 8,
    UNIQUE(user_id, month, year)
);

-- 10. ISLAMIC EVENTS (Kalender)
CREATE TABLE islamic_events (
    id SERIAL PRIMARY KEY, date DATE, name VARCHAR(100), description TEXT
);