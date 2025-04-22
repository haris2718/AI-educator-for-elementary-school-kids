import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header"
import Footer from "./Footer"
import imgurl from "../src/images/Aristotle.jpg"
import imgurl2 from "../src/images/geo.png"
import imgurl3 from "../src/images/logo2.jpg"
import "./SecondPage.css"; // Το αρχείο CSS για styling
import { motion } from "framer-motion";


function SecondPage() {
  const { grade } = useParams(); // Λαμβάνει το grade από τη δρομολόγηση
  const [selectedSubject, setSelectedSubject] = useState("");
  const navigate = useNavigate();

  const handleSubjectSelection = (subject) => {
    if ( subject === "Γεωγραφία" || subject === "Αριστοτέλης" ){
      setSelectedSubject(subject);
      navigate(`/second_page/${grade}/${subject}`);
    }
  };

  // Τα δεδομένα για τα μαθήματα και οι εικόνες
  const subjects = [
    { name: "Γεωγραφία", image: imgurl2 },
    { name: "", image: imgurl3 },
    { name: "", image: imgurl3 },
    { name: "Αριστοτέλης", image: imgurl}
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
