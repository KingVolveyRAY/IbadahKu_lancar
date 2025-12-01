const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
    try {
        const user = await pool.query("SELECT name, email, location, created_at FROM users WHERE id=$1", [req.user.id]);
        // Simple Stats
        const prayed = await pool.query("SELECT COUNT(*) FROM prayer_logs WHERE user_id=$1 AND is_completed=true", [req.user.id]);
        
        res.json({
            user: user.rows[0],
            stats: { days_prayed: parseInt(prayed.rows[0].count) }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.changePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const user = await pool.query("SELECT password FROM users WHERE id=$1", [req.user.id]);
        
        const valid = await bcrypt.compare(current_password, user.rows[0].password);
        if (!valid) return res.status(400).json({ error: "Password lama salah" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(new_password, salt);
        await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hash, req.user.id]);
        
        res.json({ msg: "Password updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};