import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 150 },
  description: { type: String, required: true }, // Rich text content
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String, required: true }],
  likes:{type:Number,default:0},
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null }
}, { timestamps: true });

export const Question = mongoose.model('Question', questionSchema);
