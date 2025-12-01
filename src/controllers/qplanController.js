const pool = require('../config/db');

exports.getQPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const plan = await pool.query("SELECT * FROM quran_plans WHERE user_id=$1 AND status='active' LIMIT 1", [userId]);
        
        if (plan.rows.length === 0) return res.json({ has_plan: false });
        const p = plan.rows[0];

        res.json({
            has_plan: true,
            plan_id: p.id,
            type: p.plan_type,
            stats: { current_page: p.current_page, total: p.total_pages, progress: Math.round(p.current_page/p.total_pages*100) },
            today_target: { amount: p.daily_target_pages }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateProgress = async (req, res) => {
    const { plan_id, pages_read } = req.body;
    await pool.query("UPDATE quran_plans SET current_page = current_page + $1 WHERE id=$2", [pages_read, plan_id]);
    res.json({ msg: "Updated" });
};