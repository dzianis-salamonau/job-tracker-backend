import { corsMiddleware } from '../../utils/cors';
import { connectToDatabase } from '../../utils/mongodb';
import Job from '../../models/Job';

export default async function handler(req, res) {
  const { method } = req;

  // Apply CORS middleware first
  if (corsMiddleware(req, res)) return;

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
        const newJob = new Job({ company, position, salaryRange, status, notes });
        await newJob.save();
        res.status(201).json(newJob);
      } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Failed to create job' });
      }
      break;
      
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
}