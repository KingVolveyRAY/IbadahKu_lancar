const pool = require('../config/db');

exports.getDailyTimeline = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date } = req.query;

        // Ambil Sholat (Kita hardcode jam dummy krn di log ga ada jam, idealnya ambil dari adhan)
        // Di sini saya pakai query simpel gabungan
        const prayers = await pool.query("SELECT prayer_name as title, is_completed, 'prayer' as type FROM prayer_logs WHERE user_id=$1 AND date=$2", [userId, date]);
        
        // Ambil Custom Tasks
        const tasks = await pool.query("SELECT title, start_time as time, is_completed, 'task' as type FROM custom_tasks WHERE user_id=$1 AND date=$2", [userId, date]);

        // Gabung (Simplifikasi: Asumsi sholat punya jam default di FE atau BE hitung via adhan lagi)
        // Untuk sekarang kirim raw data biar ga error
        res.json({ prayers: prayers.rows, tasks: tasks.rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
};