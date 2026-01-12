import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  userId: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required:  true
  },
  goal: {
    type: String,
    required: true
  },
  skillLevel: {
    type: String,
    required: true
  },
  timeCommitment:  {
    type: String,
    required: true
  },
  learningStyle: {
    type: String,
    required:  true
  },
  roadmapData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default:  Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

roadmapSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;