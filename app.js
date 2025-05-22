const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const timesheetRoutes = require('./routes/timesheets');

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/timesheets', timesheetRoutes);

module.exports = app;