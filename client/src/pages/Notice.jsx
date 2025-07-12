import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  MessageCircle, 
  Heart, 
  ChevronUp, 
  Check, 
  CheckCheck,
  Filter,
  Clock,
  User,
  AlertCircle,
  X
} from 'lucide-react';
import axiosInstance from "../utils/axios";
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      notifier: "sarah_coder",
      type: "answer",
      action: "answered your question",
      questionTitle: "How to implement efficient state management in React applications?",
      questionId: 123,
      answerId: 456,
      timestamp: "2024-01-15T10:30:00Z",
      isRead: false,
      avatar: "SC"
    },
    {
      id: 2,
      notifier: "mike_dev",
      type: "like",
      action: "liked your question",
      questionTitle: "Best practices for API error handling in Node.js",
      questionId: 124,
      timestamp: "2024-01-15T09:15:00Z",
      isRead: false,
      avatar: "MD"
    },
    {
      id: 3,
      notifier: "alex_expert",
      type: "vote",
      action: "upvoted your answer",
      questionTitle: "Understanding JavaScript closures with practical examples",
      questionId: 125,
      timestamp: "2024-01-15T08:45:00Z",
      isRead: true,
      avatar: "AE"
    },
    {
      id: 4,
      notifier: "jane_frontend",
      type: "answer",
      action: "answered your question",
      questionTitle: "CSS Grid vs Flexbox: When to use which?",
      questionId: 126,
      answerId: 789,
      timestamp: "2024-01-14T16:20:00Z",
      isRead: true,
      avatar: "JF"
    },
    {
      id: 5,
      notifier: "react_guru",
      type: "like",
      action: "liked your answer",
      questionTitle: "How to optimize React component performance?",
      questionId: 127,
      timestamp: "2024-01-14T14:10:00Z",
      isRead: false,
      avatar: "RG"
    },
    {
      id: 6,
      notifier: "code_mentor",
      type: "vote",
      action: "upvoted your question",
      questionTitle: "Database indexing strategies for large datasets",
      questionId: 128,
      timestamp: "2024-01-14T12:05:00Z",
      isRead: true,
      avatar: "CM"
    },
    {
      id: 7,
      notifier: "ui_designer",
      type: "answer",
      action: "answered your question",
      questionTitle: "Implementing dark mode in React applications",
      questionId: 129,
      answerId: 101,
      timestamp: "2024-01-13T18:30:00Z",
      isRead: false,
      avatar: "UD"
    },
    {
      id: 8,
      notifier: "backend_pro",
      type: "like",
      action: "liked your answer",
      questionTitle: "RESTful API design best practices",
      questionId: 130,
      timestamp: "2024-01-13T15:45:00Z",
      isRead: true,
      avatar: "BP"
    }
  ];

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get('/auth/notifications',);

      console.log("Fetched notifications:", res.data);

      const notices = res.data.notifications || [];

      const formatted = notices.map((n, i) => ({
        id: n._id || i,
        notifier: n.notifier?.username || "Someone",
        type: n.kind,
        action:
          n.kind === "answer"
            ? "answered your question"
            : n.kind === "vote"
            ? "upvoted your answer"
            : "liked your question",
        questionTitle: n.questionId?.title || "Question",
        questionId: n.questionId?._id,
        answerId: n.answersId?._id,
        timestamp: n.createdAt || new Date().toISOString(),
        isRead: false,
        avatar: n.notifier?.username?.slice(0, 2).toUpperCase() || "US",
      }));

      setNotifications(formatted);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();
}, []);



  const getNotificationIcon = (type) => {
    switch (type) {
      case 'answer':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'vote':
        return <ChevronUp className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'answer':
        return 'bg-blue-100 border-blue-200';
      case 'like':
        return 'bg-red-100 border-red-200';
      case 'vote':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    // Navigate based on notification type
    if (notification.type === 'answer') {
      // Navigate to Answer Approval page
      console.log(`Navigating to Answer Approval page for answer ${notification.answerId}`);
      // In a real app: navigate(`/answer-approval/${notification.answerId}`);
    } else if (notification.type === 'like' || notification.type === 'vote') {
      // Navigate to Question Details page
      console.log(`Navigating to Question Details page for question ${notification.questionId}`);
      // In a real app: navigate(`/question/${notification.questionId}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAllRead(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      setError('Failed to mark all as read');
    } finally {
      setMarkingAllRead(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <div className="text-gray-300">|</div>
              <h1 className="text-xl font-bold text-gray-900">StackIt</h1>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <div className="text-gray-300">|</div>
              <h1 className="text-xl font-bold text-gray-900">StackIt</h1>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <div className="text-gray-300">|</div>
              <h1 className="text-xl font-bold text-gray-900">StackIt</h1>
            </div>
            
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                  <div className="py-2">
                    {[
                      { value: 'all', label: 'All notifications' },
                      { value: 'answer', label: 'Answers' },
                      { value: 'like', label: 'Likes' },
                      { value: 'vote', label: 'Votes' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilter(option.value);
                          setShowFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          filter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mark All as Read */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAllRead}
                className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {markingAllRead ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm font-medium">Marking...</span>
                  </>
                ) : (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    <span className="text-sm font-medium">Mark all read</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Filter indicator */}
        {filter !== 'all' && (
          <div className="mb-4 flex items-center space-x-2">
            <span className="text-sm text-gray-600">Showing:</span>
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full capitalize">
              {filter} notifications
            </span>
            <button
              onClick={() => setFilter('all')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You'll see notifications here when people interact with your questions and answers."
                : `You'll see ${filter} notifications here when they become available.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200
                  hover:shadow-md hover:border-gray-300
                  ${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : 'border-gray-200'}
                `}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {notification.avatar}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getNotificationIcon(notification.type)}
                      <span className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.notifier}
                      </span>
                      <span className={`text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.action}
                      </span>
                    </div>

                    <p className={`text-sm mb-2 ${!notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                      {notification.questionTitle}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(notification.timestamp)}</span>
                      </div>

                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {filteredNotifications.length >= 8 && (
          <div className="text-center mt-8">
            <button className="bg-white text-gray-700 px-6 py-2 rounded-lg border hover:bg-gray-50 transition-colors">
              Load More Notifications
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close filter */}
      {showFilter && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowFilter(false)}
        />
      )}
    </div>
  );
};

export default NotificationPage;