const pool = require('../config/db');

exports.getTrackerPage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date } = req.query;

        // Prayers
        const pLog = await pool.query("SELECT prayer_name, is_completed FROM prayer_logs WHERE user_id=$1 AND date=$2", [userId, date]);
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(name => {
            const f = pLog.rows.find(l => l.prayer_name === name);
            return { name, is_completed: f ? f.is_completed : false };
        });

        // Habits
        const hLog = await pool.query(`
            SELECT m.id, m.name, m.target_label, m.weekly_target_count, COALESCE(h.is_completed, false) as is_completed
            FROM master_habits m LEFT JOIN habit_logs h ON m.id = h.habit_id AND h.user_id=$1 AND h.date=$2`, [userId, date]);

        // Quran Widget
        const qLog = await pool.query("SELECT pages_read, daily_target FROM quran_daily_logs WHERE user_id=$1 AND date=$2", [userId, date]);
        const qData = qLog.rows[0] || { pages_read: 0, daily_target: 10 };

        res.json({
            date,
            prayers,
            habits: hLog.rows,
            quran: { pages_read: qData.pages_read, target: qData.daily_target }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.togglePrayer = async (req, res) => {
    const { date, prayer_name, status } = req.body;
    await pool.query("INSERT INTO prayer_logs (user_id, date, prayer_name, is_completed) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, date, prayer_name) DO UPDATE SET is_completed=$4", [req.user.id, date, prayer_name, status]);
    res.json({ msg: "Success" });
};

exports.toggleHabit = async (req, res) => {
    const { date, habit_id, status } = req.body;
    await pool.query("INSERT INTO habit_logs (user_id, habit_id, date, is_completed) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, habit_id, date) DO UPDATE SET is_completed=$4", [req.user.id, habit_id, date, status]);
    res.json({ msg: "Success" });
};

exports.updateQuran = async (req, res) => {
    const { date, pages_read } = req.body;
    await pool.query("INSERT INTO quran_daily_logs (user_id, date, pages_read) VALUES ($1, $2, $3) ON CONFLICT (user_id, date) DO UPDATE SET pages_read=$3", [req.user.id, date, pages_read]);
    res.json({ msg: "Success" });
};

// Tambahkan endpoint untuk Custom Amalan (Create)
exports.addAmalan = async (req, res) => {
    const { title, note, date, start_time, end_time, is_repeat } = req.body;
    const newTask = await pool.query("INSERT INTO custom_tasks (user_id, title, note, date, start_time, end_time, is_repeat) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [req.user.id, title, note, date, start_time, end_time, is_repeat]);
    res.json(newTask.rows[0]);
};