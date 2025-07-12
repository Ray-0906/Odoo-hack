import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../utils/axios";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  X,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  Tag,
  ArrowRight,
  TrendingUp,
  Eye,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const StackItHomepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const questionsPerPage = 10;

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/ques/get");
        const data = response.data;

        const formattedQuestions = data.questions.map((q) => ({
          ...q,
          author: {
            ...q.author,
            reputation: q.author.rank === "newbie" ? 100 : 500,
          },
        }));

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Dynamically generate allTags from fetched questions
  const allTags = useMemo(() => {
    const tags = new Set();
    questions.forEach((q) =>
      q.tags.forEach((tag) => tags.add(tag.toLowerCase()))
    );
    return Array.from(tags);
  }, [questions]);

  // Filter and search questions
  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((q) =>
        selectedTags.some((selected) =>
          q.tags?.some((tag) => tag.toLowerCase() === selected.toLowerCase())
        )
      );
    }

    switch (sortBy) {
      case "votes":
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case "answers":
        filtered.sort((a, b) => b.answers - a.answers);
        break;
      case "views":
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [searchQuery, selectedTags, sortBy, questions]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const currentQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleLike = async (questionId) => {
    try {
      const res = await axiosInstance.patch(`/ques/like/${questionId}/`, {});
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, votes: res.data.likes } : q
        )
      );
    } catch (error) {
      console.error("Error liking question:", error);
    }
  };

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

  const LoadingSkeleton = () => (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          variants={fadeIn}
          className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all duration-300 border border-gray-100"
        >
          <div className="h-6 bg-gray-100 rounded-lg mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded-lg mb-4 w-3/4 animate-pulse"></div>
          <div className="flex space-x-2 mb-4">
            <div className="h-6 bg-gray-100 rounded-full w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-100 rounded-full w-20 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="h-4 bg-gray-100 rounded-lg w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-16 animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const EmptyState = () => (
    <motion.div 
      className="text-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <MessageCircle className="w-12 h-12 text-blue-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        No questions found
      </h3>
      <p className="text-gray-500 mb-6">
        {searchQuery || selectedTags.length > 0
          ? "Try adjusting your search or filters"
          : "Be the first to ask a question!"}
      </p>
      <motion.button 
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
      >
        <Link to={'/add'} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Ask the First Question
        </Link>
      </motion.button>
    </motion.div>
  );

  const ErrorState = () => (
    <motion.div 
      className="text-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <X className="w-12 h-12 text-red-400" />
      </div>
      <h3 className="text-2xl font-semibold text-red-600 mb-2">Error</h3>
      <p className="text-gray-600 mb-6">
        {error || "Something went wrong while fetching questions."}
      </p>
      <motion.button
        onClick={() => window.location.reload()}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
      >
        Try Again
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  All Questions
                </h1>
                <p className="text-gray-500">
                  {filteredQuestions.length} questions found
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <Link to={"/add"}>
                  <span>Ask Question</span>
                </Link>
              </motion.button>
            </div>

            <div className="relative mb-6 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-xs transition-all duration-200 hover:shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative">
                <motion.button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-xs"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Filter by tags</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isFilterOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4"
                    >
                      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                        {allTags.map((tag) => (
                          <motion.button
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              selectedTags.includes(tag)
                                ? "bg-blue-100 text-blue-700 border border-blue-300 shadow-inner"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {tag}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 shadow-xs hover:shadow-sm transition-all"
                >
                  <option value="recent">Most Recent</option>
                  <option value="votes">Most Voted</option>
                  <option value="answers">Most Answered</option>
                  <option value="views">Most Viewed</option>
                </select>
              </motion.div>
            </div>

            {selectedTags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {selectedTags.map((tag) => (
                  <motion.span
                    key={tag}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-200"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-blue-900 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {isLoading ? (
                <LoadingSkeleton />
              ) : error ? (
                <ErrorState />
              ) : currentQuestions.length === 0 ? (
                <EmptyState />
              ) : (
                <motion.div 
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {currentQuestions.map((question) => (
                    <motion.div
                      key={question.id}
                      variants={fadeIn}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <Link to={`/que/${question.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
                              {question.title}
                            </h3>
                          </Link>
                          <Link to={`/que/${question.id}`}>
                            <p className="text-gray-500 text-sm line-clamp-2">
                              {question.excerpt}
                            </p>
                          </Link>
                        </div>
                        {question.hasAcceptedAnswer && (
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className="flex-shrink-0 ml-2"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </motion.div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag) => (
                          <motion.span
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 cursor-pointer transition-all"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4 sm:gap-0">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <motion.button
                              onClick={() => handleLike(question.id)}
                              whileTap={{ scale: 0.9 }}
                              title="Like this question"
                              className="p-1 rounded-full hover:bg-blue-50 transition-colors"
                            >
                              <ThumbsUp className="w-4 h-4 text-gray-500 hover:text-blue-600 transition" />
                            </motion.button>
                            <span className="text-gray-700 font-medium">
                              {question.votes}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <Link to={`/que/${question.id}`}>
                              <span className="text-gray-700 font-medium">
                                {question.answers}
                              </span>
                            </Link>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-gray-700 font-medium">
                              {question.views}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {question.author.avatar}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                              {question.author.name}
                            </span>
                          </div>
                          <span className="text-gray-400 hidden sm:inline">•</span>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-xs">{question.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {!isLoading &&
                !error &&
                filteredQuestions.length > questionsPerPage && (
                  <motion.div 
                    className="mt-8 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex space-x-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <motion.button
                          key={i + 1}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            currentPage === i + 1
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-xs"
                          }`}
                        >
                          {i + 1}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Community Stats
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Total Questions", value: questions.length },
                      { label: "Active Users", value: 2 },
                      { label: "Answers Given", value: 14 },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-600">{stat.label}</span>
                        <span className="font-semibold text-gray-900">
                          {stat.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 15).map((tag) => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-blue-100 text-blue-700 border border-blue-300 shadow-inner"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-lg font-semibold mb-3">
                    Got a Question?
                  </h3>
                  <p className="text-blue-100 mb-5 text-sm">
                    Share your knowledge and help others learn.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-blue-600 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <Link to={'/add'}>Ask Question</Link>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackItHomepage;