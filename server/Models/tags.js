import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, maxlength: 30 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

export const Tag = mongoose.model('Tag', tagSchema);
