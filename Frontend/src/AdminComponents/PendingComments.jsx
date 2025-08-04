import { useEffect, useState } from "react";
import {
  getPendingComments,
  approveComment,
  rejectComment,
} from "../utils/commentApi";
import {
  FiUser,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";

const PendingComments = ({ token }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const fetchPending = async () => {
    try {
      const data = await getPendingComments(token);
      setPending(data);
    } catch (err) {
      toast.error("Failed to load pending comments", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId, commentId) => {
    setApprovingId(commentId);
    try {
      await approveComment(postId, commentId, token);
      toast.success("Request has been approved", { position: "top-right" });
      setPending((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (err) {
      toast.error("Failed to approve comment", { position: "top-right" });
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (postId, commentId) => {
    setRejectingId(commentId);
    try {
      await rejectComment(postId, commentId, token);
      toast.info("Request has been rejected", { position: "top-right" });
      setPending((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (err) {
      toast.error("Failed to reject comment", { position: "top-right" });
    } finally {
      setRejectingId(null);
    }
  };

  useEffect(() => {
    if (token) fetchPending();
  }, [token]);

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl">
      <div className="mb-5">
        <div className="flex items-center justify-between text-gray-800">
          <div className="flex items-center gap-2">
            <FiMessageSquare className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold">Pending Comments</h2>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchPending();
            }}
            className="text-blue-600 hover:text-blue-800 hover:cursor-pointer transition"
            title="Refresh"
          >
            {loading ? (
              <ImSpinner2 className="animate-spin text-xl" />
            ) : (
              <FiRefreshCw className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
          <p className="text-gray-600 text-sm font-medium">
            Loading Requests...
          </p>
        </div>
      ) : pending.length === 0 ? (
        <p className="text-sm text-gray-500">No pending comments found.</p>
      ) : (
        <div className="space-y-5">
          {pending.map((comment) => (
            <div
              key={comment.commentId}
              className="p-5 rounded-xl border border-gray-200 bg-gray-50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
                  <FiUser className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {comment.name}
                  </p>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <FiClock />
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{comment.text}</p>

              <div className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                <FiFileText />
                <span>{comment.postTitle}</span>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() =>
                    handleReject(comment.postId, comment.commentId)
                  }
                  disabled={
                    rejectingId === comment.commentId ||
                    approvingId === comment.commentId
                  }
                  className="flex items-center gap-2 px-4 py-2 hover:cursor-pointer rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rejectingId === comment.commentId ? (
                    <ImSpinner2 className="animate-spin text-red-600 text-lg" />
                  ) : (
                    <>
                      <FiXCircle />
                      Reject
                    </>
                  )}
                </button>
                <button
                  onClick={() =>
                    handleApprove(comment.postId, comment.commentId)
                  }
                  disabled={
                    approvingId === comment.commentId ||
                    rejectingId === comment.commentId
                  }
                  className="flex items-center gap-2 px-4 py-2 hover:cursor-pointer rounded-md bg-green-100 text-green-700 hover:bg-green-200 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {approvingId === comment.commentId ? (
                    <ImSpinner2 className="animate-spin text-green-600 text-lg" />
                  ) : (
                    <>
                      <FiCheckCircle />
                      Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingComments;
