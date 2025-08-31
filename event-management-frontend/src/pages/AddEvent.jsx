import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_datetime: "",
    end_datetime: "",
    issue_date: "",
    event_type: "",
    location: "",
  });

  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);
  const [mediaCoverage, setMediaCoverage] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDateTime = (dt) => (dt ? dt.replace("T", " ") + ":00" : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("start_datetime", formatDateTime(formData.start_datetime));
      data.append("end_datetime", formatDateTime(formData.end_datetime));
      data.append("issue_date", formData.issue_date);
      data.append("event_type", formData.event_type);
      data.append("location", formData.location);

      photos.forEach((file) => data.append("photos", file));
      if (video) data.append("video", video);
      mediaCoverage.forEach((file) => data.append("mediaCoverage", file));

      const res = await axios.post(
        "http://localhost:5000/api/events/add",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message || "✅ कार्यक्रम सफलतापूर्वक जोड़ा गया");
      navigate("/home");
    } catch (err) {
      console.error(err.response || err);
      alert(
        "❌ त्रुटि: कार्यक्रम जोड़ने में समस्या हुई\n" +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          नया कार्यक्रम जोड़ें
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              कार्यक्रम का नाम
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              विवरण
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              प्रारंभ तिथि और समय
            </label>
            <input
              type="datetime-local"
              name="start_datetime"
              value={formData.start_datetime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              समाप्ति तिथि और समय
            </label>
            <input
              type="datetime-local"
              name="end_datetime"
              value={formData.end_datetime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              कार्यक्रम का प्रकार
            </label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">कृपया प्रकार चुनें</option>
              <option value="रैली">रैली</option>
              <option value="बैठक">बैठक</option>
              <option value="सम्मेलन">सम्मेलन</option>
              <option value="जुलूस">जुलूस</option>
              <option value="अन्य">अन्य</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              स्थान
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              फोटो अपलोड करें (अधिकतम 10)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotos([...e.target.files])}
            />
          </div>

          {/* Video */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              वीडियो अपलोड करें (1)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>

          {/* Media Coverage */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              मीडिया कवरेज अपलोड करें (अधिकतम 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => setMediaCoverage([...e.target.files])}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "लोड हो रहा है..." : "कार्यक्रम जोड़ें"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              रद्द करें
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
