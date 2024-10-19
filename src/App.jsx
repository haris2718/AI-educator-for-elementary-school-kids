import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import SecondPage from "./SecondPage";
import Chat from "./Chat";

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/second_page/:grade" element={<SecondPage />} />
        <Route path="/chat/:grade/:subject" element={<Chat />} /> {/* Διαδρομή για Chat */}
      </Routes>
    </Router>
  );
}

export default App;
