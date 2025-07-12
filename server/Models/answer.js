import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  content:   { type: String, required: true }, // Rich text (HTML/Markdown)
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes:     { type: Number, default: 0 },
  isAccepted:{ type: Boolean, default: false },
  question:  { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }
}, { timestamps: true });

export const Answer = mongoose.model('Answer', answerSchema);
