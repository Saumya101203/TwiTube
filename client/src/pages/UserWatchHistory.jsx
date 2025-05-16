import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/users/watch-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Sort by watch time descending (latest first)
        const sortedHistory = response.data.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setWatchHistory(sortedHistory);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load watch history");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, []);

  if (loading) return <div className="text-white p-4">Loading watch history...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (watchHistory.length === 0) return <div className="text-white p-4">No watch history found.</div>;

  return (
    <div className="pl-60 pt-6">
      <h2 className="text-xl font-bold text-white mb-4">Your Watch History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchHistory.map((video) => (
          <Link
  key={video._id}
  to={`/video/${video._id}`}
  className="bg-gray-800 hover:bg-gray-700 rounded-lg overflow-hidden shadow-md transition duration-300"
>
  <img
    src={video.thumbnail || "/default-thumbnail.jpg"}
    alt={video.title}
    className="w-full h-48 object-cover"
  />
  <div className="p-2 text-white">
    <h3 className="text-md font-semibold truncate">{video.title}</h3>
    <p className="text-sm text-gray-400">
      By: {video.owner?.fullName || "Unknown"}
    </p>
    <p className="text-sm text-gray-400">{video.views} views</p>
    <p className="text-xs text-gray-500">
      Watched on: {new Date(video.updatedAt).toLocaleDateString()}
    </p>
  </div>
</Link>

        ))}
      </div>
    </div>
  );
};

export default UserHistory;
