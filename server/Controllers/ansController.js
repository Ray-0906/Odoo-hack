import { Answer } from "../Models/answer.js";
import { Question } from "../Models/question.js";
import { User } from "../Models/user.js";
import { pushNotification } from "./NotificationBox.js";

export const addAnswer = async (req, res) => {
  try {
    const { content, questionId } = req.body;
    const userId = req.user._id; // assuming JWT auth middleware

    if (!content || !questionId) {
      return res.status(400).json({ message: "Content and questionId are required." });
    }

    // Get the question to get the author (for notification)
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
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

    // 🔔 Send notification to question owner
    if (String(question.author) !== String(userId)) {
      await pushNotification({
        userId: question.author,
        notifierId: userId,
        kind: "answer",
        questionId: question._id,
        answersId: newAnswer._id
      });
    }

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
    const { id } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id; // assumed from auth middleware

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const increment = voteType === "upvote" ? 1 : -1;
    const newVoteCount = Math.max(answer.votes + increment, 0);
    answer.votes = newVoteCount;
    await answer.save();

    // Fetch the question (for questionId)
    const question = await Question.findById(answer.question);

    // ✅ Send notification only for upvotes, and only if not self-voting
    if (
      voteType === "upvote" &&
      String(answer.author) !== String(userId)
    ) {
      await pushNotification({
        userId: answer.author,          // answer's author
        notifierId: userId,             // who voted
        kind: "vote",                   // vote type
        questionId: answer.question,    // question associated
        answersId: answer._id
      });
    }

    return res.status(200).json({
      message: `Answer ${voteType}d successfully`,
      votes: newVoteCount,
      answer,
    });
  } catch (err) {
    console.error("❌ Error voting answer:", err);
    return res.status(500).json({ message: "Server error" });
  }
};




export const approveAnswer = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware
    const { id: answerId } = req.params;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (String(question.author) !== String(userId)) {
      return res.status(403).json({ message: "You are not authorized to approve this answer" });
    }

    // Unapprove any previously accepted answer
    if (question.acceptedAnswer && question.acceptedAnswer.toString() !== answerId) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, {
        $set: { isAccepted: false }
      });
    }

    // Mark the new one as accepted
    await Answer.findByIdAndUpdate(answerId, {
      $set: { isAccepted: true }
    });

    question.acceptedAnswer = answerId;
    await question.save();

    return res.status(200).json({
      message: "Answer approved successfully",
      acceptedAnswerId: answerId,
    });
  } catch (err) {
    console.error("❌ Error approving answer:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /ans/get-detail/:answerId


export const getAnswerDetail = async (req, res) => {
  try {
    const { answerId } = req.params;

    const answer = await Answer.findById(answerId)
      .populate("author", "username")
      .lean();

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const question = await Question.findById(answer.question)
      .select("title description tags author")
      .lean();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Optional: check if the user requesting is the author of the question
    // const userId = req.user._id;
    // if (!question.author.equals(userId)) {
    //   return res.status(403).json({ message: "You are not allowed to view this." });
    // }

    res.status(200).json({ answer, question });
  } catch (err) {
    console.error("❌ Error loading answer details:", err);
    res.status(500).json({ message: "Server error" });
  }
};