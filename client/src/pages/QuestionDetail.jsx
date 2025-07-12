import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
  Clock,
  User,
  Tag,
  MessageCircle,
  Edit3,
  Send,
  AlertCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import Markdown from "react-markdown";

const QuestionPage = () => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { id: questionId } = useParams();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/ques/get/${questionId}`);
        const { question, answers } = res.data;

        setQuestion(question);
        setAnswers(
          answers.sort((a, b) => {
            if (a.isAccepted && !b.isAccepted) return -1;
            if (!a.isAccepted && b.isAccepted) return 1;
            return b.votes - a.votes;
          })
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionId]);

  const handleVote = async (answerId, voteType) => {
    if (!isLoggedIn) return;

    try {
      const res = await axiosInstance.patch(
        `/ans/vote/${answerId}`,
        {
          voteType: voteType === "up" ? "upvote" : "downvote",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedVotes = res.data.votes;

      setUserVotes((prev) => ({
        ...prev,
        [answerId]: voteType,
      }));

      setAnswers((prev) =>
        prev.map((a) =>
          a.id === answerId || a._id === answerId
            ? { ...a, votes: updatedVotes }
            : a
        )
      );
    } catch (err) {
      console.error("Voting error:", err);
      setError("Failed to vote");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !isLoggedIn) return;

    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/ans/add", {
        content: newAnswer,
        questionId: question.id,
      });

      const createdAnswer = res.data.answer;

      setAnswers((prev) => [...prev, createdAnswer]);
      setNewAnswer("");
      setQuestion((prev) => ({
        ...prev,
        answerCount: prev.answerCount + 1,
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-600">Loading question...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Question Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 mb-8"
        >
          <motion.h1
            whileHover={{ x: 2 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            {question.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium text-gray-700">
                {question.author.username || question.author}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>{formatDate(question.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-gray-500" />
              <span>{question.answerCount} answers</span>
            </div>
          </div>

          <div className="prose max-w-none mb-6 text-gray-800 leading-relaxed whitespace-pre-line">
            <Markdown>{question.description}</Markdown>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            {question.tags.map((tag) => (
              <motion.span
                key={typeof tag === "string" ? tag : tag._id || tag.id}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {typeof tag === "string" ? tag : tag.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Answers Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            {answers.length} Answer{answers.length !== 1 ? "s" : ""}
          </h2>

          {answers.map((answer) => (
            <motion.div
              key={answer._id || answer.id}
              variants={fadeIn}
              whileHover={{ y: -2 }}
              className={`bg-white rounded-2xl shadow-xs border p-6 transition-all ${
                answer.isAccepted
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-100"
              }`}
            >
              {answer.isAccepted && (
                <div className="flex items-center mb-4">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-600 font-medium text-sm">
                    Accepted Answer
                  </span>
                </div>
              )}

              <div className="flex gap-6">
                {/* Voting Section */}
                <div className="flex flex-col items-center">
                  <motion.button
                    onClick={() => handleVote(answer.id, "up")}
                    disabled={!isLoggedIn || userVotes[answer.id] === "up"}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg ${
                      userVotes[answer.id] === "up"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    } transition-colors ${
                      !isLoggedIn ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </motion.button>

                  <span className="text-lg font-semibold text-gray-900 my-1">
                    {answer.votes}
                  </span>

                  <motion.button
                    onClick={() => handleVote(answer.id, "down")}
                    disabled={!isLoggedIn || userVotes[answer.id] === "down"}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg ${
                      userVotes[answer.id] === "down"
                        ? "bg-red-50 text-red-600"
                        : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                    } transition-colors ${
                      !isLoggedIn ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Answer Content */}
                <div className="flex-1">
                  <div className="prose max-w-none mb-4 text-gray-800 leading-relaxed">
                    <Markdown>{answer.content}</Markdown>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                          {(answer.author.username || answer.author)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-700">
                          {answer.author.username || answer.author}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{formatDate(answer.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Answer Submission Form */}
        {isLoggedIn ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 mt-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Answer
            </h3>

            <div>
              <div className="mb-4">
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here... Markdown formatting is supported."
                  className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-xs hover:shadow-sm transition-all"
                  disabled={submitting}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-gray-500 flex items-center">
                  <Edit3 className="h-4 w-4 mr-2 text-gray-400" />
                  Markdown supported
                </p>

                <motion.button
                  onClick={handleSubmitAnswer}
                  disabled={!newAnswer.trim() || submitting}
                  whileHover={{ scale: submitting ? 1 : 1.03 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post Answer
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8"
          >
            <p className="text-blue-800 text-center">
              <strong>Want to contribute?</strong>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
              >
                Sign in
              </a>{" "}
              or{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                create an account
              </a>{" "}
              to post an answer.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
