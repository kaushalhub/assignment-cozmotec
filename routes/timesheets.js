const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { timesheets, users } = require('../models/data');
const { v4: uuidv4 } = require('uuid');
const { Parser } = require('json2csv');

router.post('/', authenticate, authorize('Contractor'), (req, res) => {
  const { project, hours, notes } = req.body;
  const timesheet = {
    id: uuidv4(),
    contractorId: req.user.id,
    project,
    hours,
    notes,
    status: 'Pending'
  };
  timesheets.push(timesheet);
  res.status(201).json(timesheet);
});

router.get('/', authenticate, (req, res) => {
  let result;
  if (req.user.role === 'Admin') {
    result = timesheets;
  } else if (req.user.role === 'Recruiter') {
    const contractors = users.filter(u => u.recruiterId === req.user.id).map(u => u.id);
    result = timesheets.filter(t => contractors.includes(t.contractorId));
  } else {
    result = timesheets.filter(t => t.contractorId === req.user.id);
  }
  res.json(result);
});

router.patch('/:id/status', authenticate, authorize('Recruiter'), (req, res) => {
  const timesheet = timesheets.find(t => t.id === req.params.id);
  if (!timesheet) return res.status(404).send('Not found');
  const contractor = users.find(u => u.id === timesheet.contractorId);
  if (contractor.recruiterId !== req.user.id) return res.status(403).send('Forbidden');
  timesheet.status = req.body.status;
  res.json(timesheet);
});

router.get('/export', authenticate, authorize('Admin'), (req, res) => {
  if (!timesheets.length) return res.status(404).send('No timesheets found');
  const parser = new Parser({
    fields: ['id', 'contractorId', 'project', 'hours', 'notes', 'status']
  });
  const csv = parser.parse(timesheets);
  res.header('Content-Type', 'text/csv');
  res.attachment('timesheets.csv');
  res.send(csv);
});

module.exports = router;