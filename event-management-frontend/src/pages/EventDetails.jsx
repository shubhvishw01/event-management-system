import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        const ev = res.data;

        // Safe JSON parse
        const parseJSON = (data) => {
          if (!data) return [];
          try {
            return JSON.parse(data);
          } catch (e) {
            return [];
          }
        };

        ev.photos = parseJSON(ev.photos);
        ev.mediaCoverage = parseJSON(ev.mediaCoverage);

        setEvent(ev);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return <p className="text-center mt-6 text-gray-700">लोड हो रहा है...</p>;
  if (!event)
    return <p className="text-center mt-6 text-gray-700">Event नहीं मिला।</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{event.name}</h1>

        <p className="mb-2 text-gray-700">
          <strong>तिथि:</strong>{" "}
          {new Date(event.start_datetime).toLocaleDateString()} -{" "}
          {new Date(event.end_datetime).toLocaleDateString()}
        </p>
        <p className="mb-2 text-gray-700">
          <strong>स्थान:</strong> {event.location}
        </p>
        <p className="mb-2 text-gray-700">
          <strong>प्रकार:</strong> {event.event_type}
        </p>
        <p className="mb-4 text-gray-700">{event.description}</p>

        {/* Photos */}
        {event.photos.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-gray-800">Photos</h2>
            <div className="flex gap-2 flex-wrap">
              {event.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000/${photo}`}
                  alt={`Photo ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded-md shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {event.video && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-gray-800">Video</h2>
            <video controls className="w-full rounded-md shadow-sm">
              <source
                src={`http://localhost:5000/${event.video}`}
                type="video/mp4"
              />
              आपका ब्राउज़र वीडियो टैग को सपोर्ट नहीं करता।
            </video>
          </div>
        )}

        {/* Media Coverage */}
        {event.mediaCoverage.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-gray-800">Media Coverage</h2>
            <ul className="list-disc list-inside text-gray-700">
              {event.mediaCoverage.map((media, idx) => (
                <li key={idx}>
                  <a
                    href={`http://localhost:5000/${media}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Media {idx + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
