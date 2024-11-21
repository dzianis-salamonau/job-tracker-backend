import { connectToDatabase } from '../../utils/mongodb';
import Job from '../../models/Job';

export default async function handler(req, res) {
  const { method } = req;

  // Use environment variable for allowed origin
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'; // Default to '*'
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return res.status(200).end(); // End the response for preflight requests
  }

  try {
    // Connect to the database
    await connectToDatabase();

    switch (method) {
      case 'GET':
        try {
          // Fetch all jobs
          const jobs = await Job.find();
          res.status(200).json(jobs);
        } catch (error) {
          console.error('Error fetching jobs:', error);
          res.status(500).json({ error: 'Failed to fetch jobs' });
        }
        break;

      case 'POST':
        try {
          // Create a new job
          const { company, position, salaryRange, status, notes } = req.body;
          const newJob = new Job({
            company,
            position,
            salaryRange,
            status,
            notes,
          });
          await newJob.save();
          res.status(201).json(newJob);
        } catch (error) {
          console.error('Error creating job:', error);
          res.status(500).json({ error: 'Failed to create job' });
        }
        break;

      case 'PUT':
        try {
          const { id } = req.query; // Assuming job ID is passed as a query parameter
          const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });

          if (!updatedJob) {
            return res.status(404).json({ error: 'Job not found' });
          }

          res.status(200).json(updatedJob);
        } catch (error) {
          console.error('Error updating job:', error);
          res.status(500).json({ error: 'Failed to update job' });
        }
        break;

      case 'DELETE':
        try {
          const { id } = req.query; // Assuming job ID is passed as a query parameter
          const deletedJob = await Job.findByIdAndDelete(id);

          if (!deletedJob) {
            return res.status(404).json({ error: 'Job not found' });
          }

          res.status(204).end(); // No content, successful deletion
        } catch (error) {
          console.error('Error deleting job:', error);
          res.status(500).json({ error: 'Failed to delete job' });
        }
        break;

      default:
        res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Unexpected server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}