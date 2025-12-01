const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// DAFTAR ROUTES
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/tracker', require('./src/routes/trackerRoutes'));
app.use('/api/calendar', require('./src/routes/calendarRoutes'));
app.use('/api/fasting', require('./src/routes/fastingRoutes'));
app.use('/api/qplan', require('./src/routes/qplanRoutes'));
app.use('/api/profile', require('./src/routes/profileRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server IbadahKu berjalan di Port ${PORT}`));