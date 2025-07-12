// routes/questionRoutes.js
import express from 'express';
import { addQuestion, getAllQuestions, getAllTags, getQuestionDetail, likeQuestion } from '../Controllers/queController.js';
import { isAuthenticated } from '../Middlewares/authMiddleware.js';


// import { verifyAuth } from '../middleware/auth.js'; // if using JWT or session auth

const router = express.Router();

router.post('/add', isAuthenticated, addQuestion);
router.get('/tags', getAllTags);
router.get('/get', getAllQuestions);
router.get('/get/:id', getQuestionDetail);
router.patch("/like/:id", isAuthenticated, likeQuestion);
export default router;
