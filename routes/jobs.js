const express = require('express');
const Job = require('../models/Job');

const router = express.Router();

// Utility function for handling errors
const handleError = (res, error, message = 'Internal Server Error', statusCode = 500) => {
  console.error(error); // Log error for debugging
  res.status(statusCode).json({ error: message });
};

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    handleError(res, error, 'Failed to fetch jobs.', 500);
  }
});

// Create a new job
router.post('/', async (req, res) => {
  const { company, position, salaryRange, status, notes } = req.body;

  // Check for required fields
  if (!company || !position) {
    return res.status(400).json({ error: 'Company and Position are required.' });
  }

  try {
    const newJob = new Job({ company, position, salaryRange, status, notes });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    handleError(res, error, 'Failed to save job.', 500);
  }
});

// Update a job
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });

    // Check if job was found and updated
    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    res.json(updatedJob);
  } catch (error) {
    handleError(res, error, 'Failed to update job.', 500);
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(id);

    // Check if job was found and deleted
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    res.status(204).send(); // No content, successful deletion
  } catch (error) {
    handleError(res, error, 'Failed to delete job.', 500);
  }
});

module.exports = router;
