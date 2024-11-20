import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  salaryRange: { type: String },
  status: { type: String, enum: ['Applied', 'Interview', 'Offer', 'Rejected'], default: 'Applied' },
  notes: { type: String },
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job;
