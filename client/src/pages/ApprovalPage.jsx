import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { CheckCircle, Loader2, User, Clock, AlertCircle } from "lucide-react";

const AnswerApprovalPage = () => {
  const { answerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/ans/get/${answerId}`,);

        setAnswer(res.data.answer);
        setQuestion(res.data.question);
      } catch (err) {
        console.error("Error loading answer:", err);
        setError("Could not load the answer.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [answerId]);

  const handleApprove = async () => {
    if (!answer) return;

    try {
      setApproving(true);
      await axiosInstance.patch(
        `/ans/approve/${answer._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setApproved(true);
    } catch (err) {
      console.error("Error approving answer:", err);
      alert("Failed to approve answer.");
    } finally {
      setApproving(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error || !answer || !question) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <AlertCircle className="text-red-500 w-10 h-10 mb-4" />
        <p className="text-gray-700">{error || "Something went wrong"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Review Answer for: <span className="text-blue-600">{question.title}</span>
      </h1>

      <div className="bg-white shadow-sm border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Question</h2>
        <p className="text-gray-700 whitespace-pre-line mb-2">{question.description}</p>
        <div className="flex gap-2 flex-wrap mt-4">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-sm border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Submitted Answer</h2>
        <div className="text-gray-800 whitespace-pre-line mb-4">
          {answer.content}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4" />
            <span>{answer.author.username || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatDate(answer.createdAt)}</span>
          </div>
        </div>

        {!approved ? (
          <button
            onClick={handleApprove}
            disabled={approving}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {approving ? "Approving..." : "Approve Answer"}
          </button>
        ) : (
          <div className="mt-6 flex items-center text-green-600 gap-2 font-semibold">
            <CheckCircle className="w-5 h-5" />
            Answer has been approved.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerApprovalPage;
