const pool = require('../config/db');
const { Coordinates, CalculationMethod, PrayerTimes } = require('adhan');

exports.getFastingData = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date } = req.query;
        
        // Hitung Imsak/Maghrib
        const user = await pool.query("SELECT latitude, longitude FROM users WHERE id=$1", [userId]);
        const coords = new Coordinates(user.rows[0].latitude || -6.20, user.rows[0].longitude || 106.81);
        const pt = new PrayerTimes(coords, new Date(date), CalculationMethod.Singapore());
        
        // Stats
        const count = await pool.query("SELECT COUNT(*) FROM fasting_logs WHERE user_id=$1", [userId]);
        const streak = 7; // Logic streak kompleks, hardcode dulu biar jalan

        res.json({
            date,
            times: { imsak: pt.fajr.toLocaleTimeString(), maghrib: pt.maghrib.toLocaleTimeString() },
            stats: { completed_days: parseInt(count.rows[0].count), target_days: 8, streak },
            upcoming: [{date: '2025-11-17', name: 'Monday Sunnah'}] // Dummy generator
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.trackFasting = async (req, res) => {
    const { date, type, is_fasting } = req.body;
    if (is_fasting) {
        await pool.query("INSERT INTO fasting_logs (user_id, date, type) VALUES ($1, $2, $3) ON CONFLICT (user_id, date) DO NOTHING", [req.user.id, date, type]);
    } else {
        await pool.query("DELETE FROM fasting_logs WHERE user_id=$1 AND date=$2", [req.user.id, date]);
    }
    res.json({ msg: "Success" });
};