const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const check = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (check.rows.length > 0) return res.status(401).json({ error: "Email sudah terdaftar!" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hash]
        );
        res.json({ message: "Register Berhasil", user: newUser.rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userRes.rows.length === 0) return res.status(401).json({ error: "Email/Password salah" });

        const validPass = await bcrypt.compare(password, userRes.rows[0].password);
        if (!validPass) return res.status(401).json({ error: "Email/Password salah" });

        const token = jwt.sign({ id: userRes.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: "Login Berhasil", token, user: { id: userRes.rows[0].id, name: userRes.rows[0].name } });
    } catch (err) { res.status(500).json({ error: err.message }); }
};