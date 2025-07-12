import React, { useState, useEffect, useMemo } from 'react';
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
  Calendar
} from 'lucide-react';

const StackItHomepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const questionsPerPage = 10;

  // Mock data for questions
  const mockQuestions = [
    {
      id: 1,
      title: "How to implement React hooks effectively in a large application?",
      excerpt: "I'm working on a large React application and struggling with state management using hooks. What are the best practices for organizing and implementing hooks in a scalable way?",
      tags: ["react", "javascript", "hooks", "state-management"],
      author: { name: "Sarah Chen", avatar: "SC", reputation: 1250 },
      answers: 8,
      votes: 23,
      views: 156,
      createdAt: "2 hours ago",
      hasAcceptedAnswer: true
    },
    {
      id: 2,
      title: "Best practices for database indexing in PostgreSQL",
      excerpt: "What are the most effective indexing strategies for PostgreSQL databases to optimize query performance?",
      tags: ["postgresql", "database", "indexing", "performance"],
      author: { name: "Mike Johnson", avatar: "MJ", reputation: 892 },
      answers: 5,
      votes: 17,
      views: 89,
      createdAt: "4 hours ago",
      hasAcceptedAnswer: false
    },
    {
      id: 3,
      title: "Understanding Python decorators and their use cases",
      excerpt: "I'm trying to understand how decorators work in Python and when to use them. Can someone explain with practical examples?",
      tags: ["python", "decorators", "functions", "advanced"],
      author: { name: "Alex Rodriguez", avatar: "AR", reputation: 567 },
      answers: 12,
      votes: 31,
      views: 234,
      createdAt: "6 hours ago",
      hasAcceptedAnswer: true
    },
    {
      id: 4,
      title: "CSS Grid vs Flexbox: When to use which?",
      excerpt: "I'm confused about when to use CSS Grid versus Flexbox for layout. What are the key differences and use cases?",
      tags: ["css", "layout", "grid", "flexbox"],
      author: { name: "Emma Wilson", avatar: "EW", reputation: 1456 },
      answers: 15,
      votes: 42,
      views: 312,
      createdAt: "8 hours ago",
      hasAcceptedAnswer: true
    },
    {
      id: 5,
      title: "Docker containerization for Node.js applications",
      excerpt: "Looking for best practices when containerizing Node.js applications with Docker. What should I include in my Dockerfile?",
      tags: ["docker", "nodejs", "containerization", "devops"],
      author: { name: "David Kim", avatar: "DK", reputation: 743 },
      answers: 7,
      votes: 19,
      views: 127,
      createdAt: "12 hours ago",
      hasAcceptedAnswer: false
    },
    {
      id: 6,
      title: "Machine Learning model deployment strategies",
      excerpt: "What are the different approaches for deploying ML models in production? Looking for scalable solutions.",
      tags: ["machine-learning", "deployment", "python", "mlops"],
      author: { name: "Dr. Lisa Park", avatar: "LP", reputation: 2134 },
      answers: 9,
      votes: 38,
      views: 203,
      createdAt: "1 day ago",
      hasAcceptedAnswer: true
    },
    {
      id: 7,
      title: "Vue.js 3 Composition API vs Options API",
      excerpt: "Should I migrate from Options API to Composition API in Vue 3? What are the benefits and drawbacks?",
      tags: ["vue", "javascript", "composition-api", "vue3"],
      author: { name: "James Thompson", avatar: "JT", reputation: 689 },
      answers: 6,
      votes: 14,
      views: 98,
      createdAt: "1 day ago",
      hasAcceptedAnswer: false
    },
    {
      id: 8,
      title: "Optimizing SQL queries for better performance",
      excerpt: "My SQL queries are running slow on large datasets. What are some techniques to optimize query performance?",
      tags: ["sql", "performance", "optimization", "database"],
      author: { name: "Maria Garcia", avatar: "MG", reputation: 1021 },
      answers: 11,
      votes: 27,
      views: 189,
      createdAt: "2 days ago",
      hasAcceptedAnswer: true
    }
  ];

  // All available tags
  const allTags = [
    "react", "javascript", "python", "css", "html", "nodejs", "vue", "angular",
    "database", "sql", "postgresql", "mongodb", "docker", "kubernetes",
    "machine-learning", "ai", "data-science", "backend", "frontend",
    "mobile", "ios", "android", "web-development", "devops", "aws", "azure",
    "git", "testing", "security", "performance", "optimization"
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and search questions
  const filteredQuestions = useMemo(() => {
    let filtered = mockQuestions;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(q => 
        selectedTags.some(tag => q.tags.includes(tag))
      );
    }

    // Sort questions
    switch (sortBy) {
      case 'votes':
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case 'answers':
        filtered.sort((a, b) => b.answers - a.answers);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default: // recent
        filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
  }, [searchQuery, selectedTags, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const currentQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const removeTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="flex space-x-2 mb-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <MessageCircle className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">No questions found</h3>
      <p className="text-gray-600 mb-6">
        {searchQuery || selectedTags.length > 0 
          ? "Try adjusting your search or filters" 
          : "Be the first to ask a question!"
        }
      </p>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
        Ask the First Question
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Main Content */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  All Questions
                </h1>
                <p className="text-gray-600">
                  {filteredQuestions.length} questions found
                </p>
              </div>
              
              {/* Ask Question Button */}
              <button className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Ask Question</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Tag Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter by tags</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4">
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="votes">Most Voted</option>
                <option value="answers">Most Answered</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-300"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Questions List */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <LoadingSkeleton />
              ) : currentQuestions.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-6">
                  {currentQuestions.map(question => (
                    <div
                      key={question.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                            {question.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {question.excerpt}
                          </p>
                        </div>
                        {question.hasAcceptedAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Question Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{question.votes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{question.answers}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{question.views}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {question.author.avatar}
                            </div>
                            <span className="text-sm text-gray-600">{question.author.name}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span>{question.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && filteredQuestions.length > questionsPerPage && (
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Quick Stats */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Questions</span>
                      <span className="font-semibold">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Users</span>
                      <span className="font-semibold">567</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Answers Given</span>
                      <span className="font-semibold">2,891</span>
                    </div>
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 15).map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Got a Question?</h3>
                  <p className="text-blue-100 mb-4">
                    Share your knowledge and help others learn.
                  </p>
                  <button className="w-full bg-white text-blue-600 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors">
                    Ask Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackItHomepage;