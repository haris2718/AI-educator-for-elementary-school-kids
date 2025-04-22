import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header"
import Footer from "./Footer"
import "./Thirdpage.css"; // Το αρχείο CSS για styling
import chat from "../src/images/chat.jpg";
import kouiz_write from "../src/images/kouiz_write.webp";
import flash from "../src/images/flash.webp";
import kouiz from "../src/images/kouiz.webp";
import { motion } from "framer-motion";

function SecondPage() {
  const { grade } = useParams(); // Λαμβάνει το grade από τη δρομολόγηση
  const {subject} = useParams(); // Λαμβάνει το grade από τη δρομολόγηση
  const [selectedSubject, setSelectedSubject] = useState("");
  const navigate = useNavigate();

  const handleSubjectSelection = (component) => {
    setSelectedSubject(component);
    navigate(`/second_page/${grade}/${subject}/${component}`);
  };

  // Τα δεδομένα για τα μαθήματα και οι εικόνες
  const subjects = [
    { name: "Multiple Choice Quiz", image:kouiz },
    { name: "Gemini Quiz", image:flash   },
    { name: "Chat", image: chat },
    { name: "Llama Quiz", image: kouiz_write}
  ];

  return (
    <div className="second-page">
       <Header /> {/* Προσθήκη του Header */}
        <motion.h2
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
             >
               Επιλέξτε Δραστηριότητα  για το μάθημα  {subject}
             </motion.h2>
      
      <div className="subject-cards">
        {subjects.map((subject, index) => (
       <motion.div
                  key={index}
                  className="card"
                  onClick={() => handleSubjectSelection(subject.name)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.4 }}
                >
                  <img
                    src={subject.image}
                    alt={subject.name}
                    className="card-image"
                  />
                  <div className="card-content">
                    <h3>{subject.name}</h3>
                  </div>
                </motion.div>
        ))}
      </div>
      <Footer /> {/* Προσθήκη του Footer */}
    </div>
  );
}

export default SecondPage;
