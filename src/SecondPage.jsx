import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header"
import Footer from "./Footer"
import "./SecondPage.css"; // Το αρχείο CSS για styling


function SecondPage() {
  const { grade } = useParams(); // Λαμβάνει το grade από τη δρομολόγηση
  const [selectedSubject, setSelectedSubject] = useState("");
  const navigate = useNavigate();

  const handleSubjectSelection = (subject) => {
    setSelectedSubject(subject);
    navigate(`/chat/${grade}/${subject}`);
  };

  // Τα δεδομένα για τα μαθήματα και οι εικόνες
  const subjects = [
    { name: "Γεωγραφία", image: "/images/geo.png" },
    { name: "Γλώσσα", image: "/path/to/language-image.png" },
    { name: "Ιστορία", image: "/path/to/history-image.png" },
    { name: "Αριστοτέλης", image: "/images/Aristotle.jpg" }
  ];

  return (
    <div className="second-page">
       <Header /> {/* Προσθήκη του Header */}
      <h2>Επιλέξτε μάθημα για την τάξη: {grade}</h2>
      <div className="subject-cards">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="card"
            onClick={() => handleSubjectSelection(subject.name)}
          >
            <img src={subject.image} alt={subject.name} className="card-image" />
            <div className="card-content">
              <h3>{subject.name}</h3>
            </div>
          </div>
        ))}
      </div>
      <Footer /> {/* Προσθήκη του Footer */}
    </div>
  );
}

export default SecondPage;
