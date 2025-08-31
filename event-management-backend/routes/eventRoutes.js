const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../db"); // MySQL connection

// ========== Multer setup ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    ),
});

const upload = multer({ storage });

// ========== Add Event ==========
router.post(
  "/add",
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "mediaCoverage", maxCount: 5 },
  ]),
  (req, res) => {
    try {
      const {
        name,
        description,
        start_datetime,
        end_datetime,
        issue_date,
        event_type,
        location,
      } = req.body;

      // Handle files
      const photos = req.files.photos
        ? req.files.photos.map((f) => f.path)
        : [];
      const video = req.files.video ? req.files.video[0].path : null;
      const mediaCoverage = req.files.mediaCoverage
        ? req.files.mediaCoverage.map((f) => f.path)
        : [];

      // Issue date null if empty
      const issueDateValue = issue_date && issue_date.trim() !== "" ? issue_date : null;

      const sql = `
        INSERT INTO events
        (name, description, start_datetime, end_datetime, issue_date, event_type, location, photos, video, mediaCoverage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          name,
          description,
          start_datetime,
          end_datetime,
          issueDateValue,
          event_type,
          location,
          JSON.stringify(photos),
          video,
          JSON.stringify(mediaCoverage),
        ],
        (err, result) => {
          if (err) {
            console.error("DB Error:", err);
            return res
              .status(500)
              .json({ message: "Database Error", error: err });
          }
          res.json({ message: "✅ कार्यक्रम सफलतापूर्वक जोड़ दिया गया" });
        }
      );
    } catch (err) {
      console.error("Server Error:", err);
      res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
  }
);

// ========== Get Events ==========
router.get("/", (req, res) => {
  const { status } = req.query;
  let sql = "SELECT * FROM events";

  if (status === "ongoing") {
    sql =
      "SELECT * FROM events WHERE start_datetime <= NOW() AND end_datetime >= NOW() ORDER BY start_datetime DESC";
  } else if (status === "previous") {
    sql =
      "SELECT * FROM events WHERE end_datetime < NOW() ORDER BY start_datetime DESC";
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json(results);
  });
});

// ========== Get Single Event ==========
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM events WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    if (results.length === 0)
      return res.status(404).json({ message: "Event not found" });
    res.json(results[0]);
  });
});

// ========== Increase View Count ==========
router.post("/:id/view", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE events SET views = IFNULL(views,0) + 1 WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json({ message: "👀 View recorded" });
  });
});

module.exports = router;
