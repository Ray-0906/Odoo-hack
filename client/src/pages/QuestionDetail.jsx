import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, Check, Clock, User, Tag, MessageCircle, Edit3, Send, AlertCircle } from 'lucide-react';
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
const QuestionPage = () => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate login state
  const { id: questionId } = useParams(); // 👈 now questionId is accessible

  // Mock data - in a real app, this would come from an API
const mockQuestion = {
    id: 1,
    title: "How to implement efficient state management in React applications?",
    description: `I'm building a complex React application with multiple components that need to share state. I've been using useState and prop drilling, but it's becoming unwieldy as the app grows.

I'm looking for recommendations on:
- When to use Context API vs Redux vs Zustand
- Best practices for organizing state
- Performance considerations
- Examples of implementation

Any insights would be greatly appreciated!`,
    author: "alex_dev",
    createdAt: "2024-01-15T10:30:00Z",
    tags: ["react", "state-management", "javascript", "frontend"],
    answerCount: 3
  };

  const mockAnswers = [
    {
      id: 1,
      content: `For React state management, I recommend starting with the built-in options before reaching for external libraries:

**Context API + useReducer**: Perfect for medium-sized apps
- Great for avoiding prop drilling
- Built into React, no extra dependencies
- Use useReducer for complex state logic

**Redux Toolkit**: Best for large, complex applications
- Predictable state updates
- Excellent DevTools
- Great for team collaboration

**Zustand**: Modern, lightweight alternative
- Minimal boilerplate
- TypeScript friendly
- Great DX

Start simple and scale up based on your needs!`,
      author: "react_expert",
      createdAt: "2024-01-15T11:45:00Z",
      votes: 15,
      isAccepted: true
    },
    {
      id: 2,
      content: `I'd add that **performance** is crucial when choosing state management:

- Context API can cause unnecessary re-renders if not used carefully
- Use React.memo() and useMemo() to optimize
- Consider state colocation - keep state as close to where it's used as possible
- Tools like React DevTools Profiler can help identify performance bottlenecks

Also, don't forget about **server state** management with libraries like React Query or SWR for API data!`,
      author: "performance_guru",
      createdAt: "2024-01-15T14:20:00Z",
      votes: 8,
      isAccepted: false
    },
    {
      id: 3,
      content: `Here's a practical approach I use:

1. **Start with useState** for component-local state
2. **Lift state up** when multiple components need it
3. **Use Context** when prop drilling gets messy (3+ levels)
4. **Consider external libraries** when Context becomes complex

For your specific case, I'd recommend trying Context API first. Create separate contexts for different domains (user, theme, app data) to avoid the "everything re-renders" problem.`,
      author: "practical_dev",
      createdAt: "2024-01-15T16:10:00Z",
      votes: 12,
      isAccepted: false
    }
  ];

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/ques/get/${questionId}`); // Pass the actual ID from route or props
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
}, []);


const handleVote = async (answerId, voteType) => {
  if (!isLoggedIn) return;

  try {
    const res = await axiosInstance.patch(`/ans/vote/${answerId}`, {
      voteType: voteType === "up" ? "upvote" : "downvote"
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const updatedVotes = res.data.votes;

    setUserVotes((prev) => ({
      ...prev,
      [answerId]: voteType
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
      answerCount: prev.answerCount + 1
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Questions
            </button>
            <div className="text-gray-300">|</div>
            <h1 className="text-xl font-bold text-gray-900">StackIt</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Question Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {question.author.username || question.author}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDate(question.createdAt)}
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {question.answerCount} answers
            </div>
          </div>

          <div className="prose max-w-none mb-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{question.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <div className="flex space-x-2">
              {question.tags.map(tag => (
                <span key={typeof tag === "string" ? tag : tag._id || tag.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                  {typeof tag === "string" ? tag : tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
          </h2>

          {answers.map(answer => (
            <div key={answer._id || answer.id} className={`bg-white rounded-lg shadow-sm border p-6 ${
              answer.isAccepted ? 'border-green-200 bg-green-50' : ''
            }`}>
              {answer.isAccepted && (
                <div className="flex items-center mb-3">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-600 font-medium text-sm">Accepted Answer</span>
                </div>
              )}

              <div className="flex">
                {/* Voting Section */}
                <div className="flex flex-col items-center mr-4 space-y-2">
                  <button
                    onClick={() => handleVote(answer.id, 'up')}
                    disabled={!isLoggedIn}
                    className={`p-1 rounded ${
                      userVotes[answer.id] === 'up'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
                    } transition-colors ${!isLoggedIn ? 'cursor-not-allowed' : ''}`}
                  >
                    <ChevronUp className="h-6 w-6" />
                  </button>
                  
                  <span className="text-lg font-semibold text-gray-900">{answer.votes}</span>
                  
                  <button
                    onClick={() => handleVote(answer.id, 'down')}
                    disabled={!isLoggedIn}
                    className={`p-1 rounded ${
                      userVotes[answer.id] === 'down'
                        ? 'bg-red-100 text-red-600'
                        : 'text-gray-400 hover:text-red-600 hover:bg-gray-100'
                    } transition-colors ${!isLoggedIn ? 'cursor-not-allowed' : ''}`}
                  >
                    <ChevronDown className="h-6 w-6" />
                  </button>
                </div>

                {/* Answer Content */}
                <div className="flex-1">
                  <div className="prose max-w-none mb-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">{answer.content}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {answer.author.username || answer.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(answer.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Answer Submission Form */}
        {isLoggedIn && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
            
            <div>
              <div className="mb-4">
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here... You can use markdown for formatting."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={submitting}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <Edit3 className="h-4 w-4 inline mr-1" />
                  Markdown supported
                </p>
                
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!newAnswer.trim() || submitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
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
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-blue-800">
              <strong>Want to contribute?</strong> 
              <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Sign in</a> or 
              <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">create an account</a> to post an answer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;