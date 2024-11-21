import { corsMiddleware } from '../../utils/cors';
import { connectToDatabase } from '../../utils/mongodb';
import Job from '../../models/Job';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // Get the job ID from the URL

  // Add detailed logging
  console.log('Request Method:', method);
  console.log('Full Query:', req.query); // Logs all query parameters, including id
  console.log('Request Body:', req.body); // Logs the body of the request

  // For GET request, we can log more details for debugging
  if (method === 'GET') {
    console.log('GET Request URL:', req.url);
    console.log('GET Request Query Parameters:', req.query);
  }

  // Add detailed logging
  console.log('Request Method:', method);
  console.log('Job ID:', id);
  console.log('Request Body:', req.body);

  // Apply CORS middleware first
  if (corsMiddleware(req, res)) return;

  // Connect to the database
  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        console.log('GET Request for Job ID:', id);
        // Fetch a specific job by ID
        const job = await Job.findById(id);
        if (!job) {
          console.log('Job not found for ID:', id);
          return res.status(404).json({ error: 'Job not found!', id });
        }
        res.status(200).json(job);
      } catch (error) {
        console.error('GET Error Details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        res.status(500).json({ error: 'Failed to retrieve job' });
      }
      break;
      
    case 'PUT':
      try {
        console.log('PUT Request Body:', req.body);
        console.log('PUT Request Query:', req.query);
        console.log('PUT Request Headers:', req.headers);

        // Update an existing job by ID
        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedJob) {
          console.log('Job not found for ID:', id);
          return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(updatedJob);
      } catch (error) {
        console.error('PUT Error Details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
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
