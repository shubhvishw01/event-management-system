import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [event, setEvent] = useState({});
  const [location, setLocation] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);
  const [mediaCoverage, setMediaCoverage] = useState([]);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(res.data);
      setLocation(res.data.location);
      setStartDatetime(res.data.start_datetime);
      setEndDatetime(res.data.end_datetime);
      setAttendees(res.data.attendees);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("location", location);
    formData.append("start_datetime", startDatetime);
    formData.append("end_datetime", endDatetime);
    formData.append("attendees", attendees);

    photos.forEach((photo) => formData.append("photos", photo));
    if (video) formData.append("video", video);
    mediaCoverage.forEach((m) => formData.append("mediaCoverage", m));

    try {
      await axios.put(
        `http://localhost:5000/api/events/${id}/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Event updated successfully!");
      navigate(`/event/${id}`);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>कार्यक्रम अपडेट करें</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>स्थान:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>शुरुआत तारीख/समय:</label>
          <input
            type="datetime-local"
            value={startDatetime}
            onChange={(e) => setStartDatetime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>समाप्ति तारीख/समय:</label>
          <input
            type="datetime-local"
            value={endDatetime}
            onChange={(e) => setEndDatetime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>उपस्थित लोग:</label>
          <input
            type="number"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Photos (max 10):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setPhotos([...e.target.files])}
          />
        </div>
        <div>
          <label>Video (min 10MB):</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>
        <div>
          <label>Media Coverage Photos (max 5):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setMediaCoverage([...e.target.files])}
          />
        </div>
        <button type="submit">Update Event</button>
        <button
          type="button"
          onClick={() => navigate(`/event/${id}`)}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default UpdateEvent;
