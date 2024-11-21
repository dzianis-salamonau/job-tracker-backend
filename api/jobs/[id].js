import { connectToDatabase } from '../../utils/mongodb';
import Job from '../../models/Job';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // Get the job ID from the URL

  // Add CORS headers
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'; // Update this to your frontend URL in production
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return res.status(200).end(); // End preflight request
  }

  // Connect to the database
  await connectToDatabase();

  switch (method) {
    case 'PUT':
      try {
        // Update an existing job by ID
        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedJob) return res.status(404).json({ error: 'Job not found' });
        res.status(200).json(updatedJob);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update job' });
      }
      break;

    case 'DELETE':
      try {
        // Delete a job by ID
        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) return res.status(404).json({ error: 'Job not found' });
        res.status(204).end(); // No content, successful deletion
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete job' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
}
