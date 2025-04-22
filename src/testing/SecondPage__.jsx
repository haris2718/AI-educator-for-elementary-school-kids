import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import imgurl from "../src/images/Aristotle.jpg";
import imgurl2 from "../src/images/geo.png";
import imgurl3 from "../src/images/logo2.jpg";
import backgroundImage from "../src/images/second_page4.png";
import "./SecondPage.css";
import { motion } from "framer-motion";
import EarthCanvasAnimation from "./animation/EarthCanvasAnimation";

function SecondPage() {
  const { grade } = useParams();
  const [selectedSubject, setSelectedSubject] = useState("");
  const navigate = useNavigate();

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

  const imageRef = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    const updateGlobePosition = () => {
      const image = imageRef.current;
      const globe = globeRef.current;

      if (!image || !globe) return;

      const { width, height } = image.getBoundingClientRect();

      const offsetLeft = width * 0.055; // 5.5%
      const offsetTop = height * 0.44;  // 44%

      globe.style.left = `${offsetLeft}px`;
      globe.style.top = `${offsetTop}px`;
    };

    updateGlobePosition();
    window.addEventListener("resize", updateGlobePosition);

    return () => {
      window.removeEventListener("resize", updateGlobePosition);
    };
  }, []);

  return (
    <div className="second-page">
      <Header />

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Επιλέξτε μάθημα για την τάξη: {grade}
      </motion.h2>

      <div className="image-container">
        <img src={backgroundImage} alt="background" className="background-image" ref={imageRef} />
        <div className="earth-wrapper" ref={globeRef}>
          <EarthCanvasAnimation />
        </div>
      </div>

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

      <Footer />
    </div>
  );
}

export default SecondPage;
