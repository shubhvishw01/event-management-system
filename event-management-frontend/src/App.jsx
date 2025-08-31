import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import UpdateEvent from "./pages/UpdateEvent";
import AddEvent from "./pages/AddEvent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/event/:id/update" element={<UpdateEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
