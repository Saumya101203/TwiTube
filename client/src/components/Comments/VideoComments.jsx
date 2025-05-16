import React, { useEffect, useState } from "react";
import axios from "axios";

const VideoComment = ({ videoId, userToken }) => {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments for the video
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASEURL;
      const response = await axios.get(`${backendBaseUrl}/api/v1/comments/${videoId}`, {
  headers: { Authorization: `Bearer ${userToken}` },
});

      const data = response.data.data;
      setComments(data.comments);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load comments");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

  // Add new comment
  const handleAddComment = async () => {
    if (!newCommentContent.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    setLoading(true);
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASEURL;
    try {
      await axios.post(
  `${backendBaseUrl}/api/v1/comments/${videoId}`,
  { content: newCommentContent },
  { headers: { Authorization: `Bearer ${userToken}` } }
);
      setNewCommentContent("");
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Comments</h2>

      <div>
        <textarea
  rows="3"
  placeholder="Add a comment..."
  value={newCommentContent}
  onChange={(e) => setNewCommentContent(e.target.value)}
  disabled={loading}
  style={{ width: "100%", marginBottom: "0.5rem", backgroundColor: "#333333", color: "white" }}
/>

        <button onClick={handleAddComment} disabled={loading}>
          Post Comment
        </button>
      </div>

      {loading && <p>Loading comments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {comments.map(({ _id, content, owner }) => (
          <li
            key={_id}
            style={{
              borderBottom: "1px solid #ddd",
              marginBottom: "0.5rem",
              paddingBottom: "0.5rem",
            }}
          >
            <p>
              <strong>{owner?.name || "Unknown User"}</strong>
            </p>
            <p>{content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoComment;
