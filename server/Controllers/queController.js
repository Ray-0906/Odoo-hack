import { Answer } from "../Models/answer.js";
import { Question } from "../Models/question.js";
import { Tag } from "../Models/tags.js";
import { User } from "../Models/user.js";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime)

export const addQuestion = async (req, res) => {
  try {
    let { title, description, tags } = req.body;
    console.log("Request body:", req.body);
    const userId = req.user._id;
    

    if (!title || !description || !tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ message: 'Title, description, and at least one tag are required.' });
    }

    // Normalize tags to lowercase
    //         

    // Validate tags
    const existingTags = await Tag.find({ name: { $in: tags } });
    if (existingTags.length !== tags.length) {
      return res.status(400).json({ message: 'One or more tags are invalid.' });
    }

    // Create question
    const newQuestion = await Question.create({
      title,
      description,
      tags, // string array
      author: userId,
      answers: [],
      acceptedAnswer: null
    });

    // Update Tag -> add question ID
    await Tag.updateMany(
      { name: { $in: tags } },
      { $addToSet: { questions: newQuestion._id } }
    );

    // Update User -> add question ID (optional)
    await User.updateOne(
      { _id: userId },
      { $addToSet: { questions: newQuestion._id } }
    );

    // Populate author
    const populated = await Question.findById(newQuestion._id)
      .populate('author');

    res.status(201).json({
      message: 'Question created successfully',
      question: populated
    });

  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "username rank") // ✅ Make sure these fields exist
      .populate("answers") // optional if you just want count
      .sort({ createdAt: -1 });

    console.log("Fetched questions count:", questions.length);

    const formatted = questions.map((q, index) => {
      console.log(`\n--- Question ${index + 1} ---`);
      console.log("Raw Author:", q.author);
      console.log("Likes:", q.likes);
      console.log("Answers Length:", q.answers.length);
      console.log("CreatedAt:", q.createdAt);

      const username = q.author?.username || "Unknown";
      const initials = username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      const votes = typeof q.likes === "number" ? q.likes : 0;
      const answersCount = Array.isArray(q.answers) ? q.answers.length : 0;

      return {
        id: q._id,
        title: q.title,
        excerpt: stripHtml(q.description).slice(0, 180),
        tags: q.tags,
        author: {
          name: username,
          avatar: initials || "UN",
          rank: q.author?.rank || "newbie",
        },
        answers: answersCount,
        votes,
        views: answersCount + votes,
        createdAt: dayjs(q.createdAt).fromNow(),
        hasAcceptedAnswer: !!q.acceptedAnswer,
      };
    });

    return res.status(200).json({ questions: formatted });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

function stripHtml(html) {
  return html?.replace(/<[^>]+>/g, "").trim() || "";
}

export const getAllTags= async (req, res) => {
  try {
    const tags = await Tag.find().select('name'); // Fetch only tag names
    res.status(200).json({
      message: 'Tags fetched successfully',
      tags
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const getQuestionDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the question and populate author
    const question = await Question.findById(id)
      .populate("author", "username")
      .lean(); // use .lean() for plain JS object

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Fetch all answers related to the question
    const answers = await Answer.find({ question: id })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .lean();

    // Format the question
    const formattedQuestion = {
      id: question._id,
      title: question.title,
      description: stripHtml(question.description),
      author: question.author?.username || "Unknown",
      createdAt: question.createdAt,
      tags: question.tags,
      answerCount: answers.length,
    };

    // Format answers
    const formattedAnswers = answers.map((ans) => ({
      id: ans._id,
      content: stripHtml(ans.content),
      author: ans.author?.username || "Unknown",
      createdAt: ans.createdAt,
      votes: ans.votes,
      isAccepted: ans.isAccepted,
    }));

    return res.status(200).json({
      question: formattedQuestion,
      answers: formattedAnswers,
    });
  } catch (error) {
    console.error("❌ Error fetching question detail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};