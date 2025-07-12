import mongoose from 'mongoose';
const notiSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notices: [{
    kind: { type: String, required: true }, // e.g., "answer", "like", "vote"
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    answersId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' },
    notifier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }]
});

export const NoticeBox = mongoose.model('NoticeBox', notiSchema);