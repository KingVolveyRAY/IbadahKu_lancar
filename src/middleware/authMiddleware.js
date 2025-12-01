const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Akses ditolak. Butuh token!' });

    try {
        const cleanToken = token.replace('Bearer ', '');
        const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token tidak valid' });
    }
};