import { Answer } from "../Models/answer.js";
import { Question } from "../Models/question.js";
import { User } from "../Models/user.js";

export const addAnswer = async (req, res) => {
  try {
    const { content, questionId } = req.body;
    const userId = req.user._id; // assuming JWT auth middleware

    if (!content || !questionId) {
      return res.status(400).json({ message: "Content and questionId are required." });
    }

    // Create the answer
    const newAnswer = await Answer.create({
      content,
      author: userId,
      question: questionId,
    });

    // Add answer to Question's answers array
    await Question.findByIdAndUpdate(
      questionId,
      { $addToSet: { answers: newAnswer._id } },
      { new: true }
    );

    // Add answer to User's answers array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { answers: newAnswer._id } },
      { new: true }
    );

    // Populate for frontend if needed
    const populatedAnswer = await Answer.findById(newAnswer._id).populate("author", "username");

    return res.status(201).json({
      message: "Answer posted successfully",
      answer: populatedAnswer,
    });
  } catch (err) {
    console.error("❌ Error adding answer:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const voteAnswer = async (req, res) => {
  try {
    const { id } = req.params; // answer ID
    const { voteType } = req.body; // "upvote" or "downvote"

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const increment = voteType === "upvote" ? 1 : -1;

    const updated = await Answer.findByIdAndUpdate(
      id,
      { $inc: { votes: increment } },
      { new: true }
    ).populate("author", "username");

    if (!updated) {
      return res.status(404).json({ message: "Answer not found" });
    }

    return res.status(200).json({
      message: `Answer ${voteType}d successfully`,
      votes: updated.votes,
      answer: updated,
    });
  } catch (err) {
    console.error("❌ Error voting answer:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
