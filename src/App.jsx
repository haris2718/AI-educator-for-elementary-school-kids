import React, { useState } from "react";
import { HashRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import SecondPage from "./SecondPage";
import Chat from "./Chat";
import Third from "./Third_page"
import Quiz_page from "./quiz/Quiz_page"
import Chat_teacher_Gemini from "./Chat_teacher_Gemini"
import Chat_teacher_Groq from "./Chat_teacher_Groq"
import './App.css';

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/second_page/:grade" element={<SecondPage />} />
        <Route path="/second_page/:grade/:subject" element={<Third />} /> {/* Διαδρομή για να επιλέξεις */}
        <Route path="/second_page/:grade/:subject/Chat" element={<Chat />} /> {/* Διαδρομή για Chat */}
        <Route path="/second_page/:grade/:subject/Multiple Choice Quiz" element={<Quiz_page />} /> {/* Διαδρομή για Chat */}
        <Route path="/second_page/:grade/:subject/Gemini Quiz" element={<Chat_teacher_Gemini />} /> {/* Διαδρομή για Chat */}
        <Route path="/second_page/:grade/:subject/Llama Quiz" element={<Chat_teacher_Groq />} /> {/* Διαδρομή για Chat */}
      </Routes>
    </Router>
  );
}

export default App;
