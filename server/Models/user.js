import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  rank:{ type: String, default: 'newbie' },
  role: { type: String, default: 'user' },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
});

export const User = mongoose.model('User', userSchema);