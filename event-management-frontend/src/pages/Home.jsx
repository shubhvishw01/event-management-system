import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("ongoing"); // ✅ filter define
  const [loading, setLoading] = useState(true);
  const [lastVisit, setLastVisit] = useState(null);
  const [monthlyCount, setMonthlyCount] = useState(0);

  // Redirect if user not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchEvents();
    fetchUserStats();
  }, [filter]);

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/events?status=${filter}`
      );
      setEvents(res.data);
    } catch (err) {
      console.error("Events fetch error:", err);
    }
    setLoading(false);
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/${user.id}/stats`
      );
      setLastVisit(res.data.lastVisit);
      setMonthlyCount(res.data.monthlyCount);
    } catch (err) {
      console.error("User stats fetch error:", err);
    }
  };

  // Handle view event
  const handleViewEvent = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/view`, {
        user_id: user.id,
      });
      await fetchUserStats(); // Refresh stats after viewing
      navigate(`/event/${eventId}`);
    } catch (err) {
      console.error("View event error:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Logo & Title */}
      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-28 mb-3" />
        <h1 className="text-2xl font-bold text-gray-800">
          स्वागत है, {user?.name}
        </h1>

        {/* User Stats */}
        {lastVisit && (
          <p className="text-gray-700 mt-2">
            आखिरी विज़िट: {new Date(lastVisit).toLocaleString()}
          </p>
        )}
        <p className="text-gray-700">
          इस महीने देखे गए कार्यक्रम: {monthlyCount}
        </p>
      </div>

      {/* Filter Radio Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={filter === "ongoing"}
            onChange={() => setFilter("ongoing")}
            className="accent-blue-600"
          />
          <span className="font-medium text-gray-700">चालू कार्यक्रम</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={filter === "previous"}
            onChange={() => setFilter("previous")}
            className="accent-blue-600"
          />
          <span className="font-medium text-gray-700">पिछले कार्यक्रम</span>
        </label>
      </div>

      {/* Admin Add Event */}
      {user?.role === "admin" && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/add-event")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            ➕ Add Event
          </button>
        </div>
      )}

      {/* Events Table */}
      <div className="mt-8 overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">लोड हो रहा है...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">
            कोई कार्यक्रम उपलब्ध नहीं है
          </p>
        ) : (
          <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left text-gray-100">क्रमांक</th>
                <th className="py-3 px-4 text-left text-gray-100">
                  कार्यक्रम का नाम
                </th>
                <th className="py-3 px-4 text-left text-gray-100">तिथि</th>
                <th className="py-3 px-4 text-center text-gray-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={event.id}
                  className="border-b hover:bg-gray-100 transition text-gray-800"
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td
                    onClick={() => handleViewEvent(event.id)}
                    className="py-2 px-4 text-blue-600 font-medium cursor-pointer hover:underline"
                  >
                    {event.name}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(event.start_datetime).toLocaleDateString()} -{" "}
                    {new Date(event.end_datetime).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleViewEvent(event.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Show Details
                    </button>
                    {filter === "ongoing" && user?.role === "admin" && (
                      <button
                        onClick={() => navigate(`/event/${event.id}/update`)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Home;
