const pool = require('../config/db');
const { Coordinates, CalculationMethod, PrayerTimes } = require('adhan');

exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        // 1. User & Lokasi
        const user = await pool.query("SELECT name, latitude, longitude FROM users WHERE id=$1", [userId]);
        const { name, latitude, longitude } = user.rows[0];

        // 2. Jadwal Sholat
        const coords = new Coordinates(latitude || -6.20, longitude || 106.81);
        const params = CalculationMethod.Singapore();
        const pt = new PrayerTimes(coords, new Date(), params);
        const fmt = (t) => t.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:false});
        
        // 3. Stats
        const pDone = await pool.query("SELECT COUNT(*) FROM prayer_logs WHERE user_id=$1 AND date=$2 AND is_completed=true", [userId, today]);
        const hDone = await pool.query("SELECT COUNT(*) FROM habit_logs WHERE user_id=$1 AND date=$2 AND is_completed=true", [userId, today]);
        const habits = await pool.query("SELECT COUNT(*) FROM master_habits");
        
        // Total Reminder = 5 Sholat + Total Habits
        const total = 5 + parseInt(habits.rows[0].count);
        const done = parseInt(pDone.rows[0].count) + parseInt(hDone.rows[0].count);

        res.json({
            user_name: name,
            date: today,
            prayer_schedule: { Fajr: fmt(pt.fajr), Dhuhr: fmt(pt.dhuhr), Asr: fmt(pt.asr), Maghrib: fmt(pt.maghrib), Isha: fmt(pt.isha) },
            stats: { total_reminders: total, completed: done, pending: total - done }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};