import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import imgurl from "../src/images/Aristotle.jpg";
import imgurl2 from "../src/images/geo.png";
import imgurl3 from "../src/images/logo2.jpg";
import "./SecondPage.css";
import { motion } from "framer-motion";
import EarthCanvasAnimation from "./animation/EarthCanvasAnimation";

function SecondPage() {
  const { grade } = useParams();
  const [selectedSubject, setSelectedSubject] = useState("");
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const canvasWrapperRef = useRef(null);

  const handleSubjectSelection = (subject) => {
    if (subject === "Γεωγραφία" || subject === "Αριστοτέλης") {
      setSelectedSubject(subject);
      navigate(`/second_page/${grade}/${subject}`);
    }
  };

  const subjects = [
    { name: "Γεωγραφία", image: imgurl2 },
    { name: "", image: imgurl3 },
    { name: "", image: imgurl3 },
    { name: "Αριστοτέλης", image: imgurl }
  ];

  useEffect(() => {
    const updateGlobePosition = () => {
      const page = pageRef.current;
      const wrapper = canvasWrapperRef.current;
      if (!page || !wrapper) return;
  
      const rect = page.getBoundingClientRect();
  
      const topPercent = 0.44;
      const leftPercent = 0.055;
  
      const topPx = rect.height * topPercent;
      const leftPx = rect.width * leftPercent;
  
      wrapper.style.top = `${topPx}px`;
      wrapper.style.left = `${leftPx}px`;
    };
  
    updateGlobePosition();
    window.addEventListener("resize", updateGlobePosition);
    return () => window.removeEventListener("resize", updateGlobePosition);
  }, []);
  

  return (
    <div className="second-page" ref={pageRef}>
      {/* 🟢 Η σφαίρα είναι relative στο .second-page */}
      <div className="canvas-wrapper" ref={canvasWrapperRef}>
        <EarthCanvasAnimation />
      </div>

      <Header />
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Επιλέξτε μάθημα για την τάξη: {grade}
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
            <img src={subject.image} alt={subject.name} className="card-image" />
            <div className="card-content">
              <h3>{subject.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default SecondPage;
