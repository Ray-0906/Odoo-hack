// routes/answerRoutes.js
import express from "express";
import { isAuthenticated } from '../Middlewares/authMiddleware.js';
import { addAnswer, voteAnswer } from "../Controllers/ansController.js";
 // if you're using JWT

const router = express.Router();

router.post("/add", isAuthenticated, addAnswer);
router.patch("/vote/:id", isAuthenticated, voteAnswer);

export default router;
