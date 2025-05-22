const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { users } = require('../models/data');
const { v4: uuidv4 } = require('uuid');

router.post('/register', (req, res) => {
  const { name, role, recruiterId } = req.body;
  const id = uuidv4();
  const user = { id, name, role, recruiterId: recruiterId || null };
  users.push(user);
  const token = jwt.sign(user, process.env.JWT_SECRET);
  res.json({ token });
});

router.post('/login', (req, res) => {
  const { name } = req.body;
  const user = users.find(u => u.name === name);
  if (!user) return res.status(400).send('User not found');
  const token = jwt.sign(user, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;