import React, { useState } from "react";
import "./MainSection_with_mountains.css";
import { useNavigate } from 'react-router-dom';
//import './MainSection.css';

export default function MainSection_with_mountains() {
    const navigate = useNavigate();
    const handleSelection = (grade) => {
      navigate(`/second_page/${grade}`);
    };

 

  return (
    <div className="learning-world">
      <div className="parallax parallax-bg" />
      <div className="parallax parallax-bg1" />
      <div className="parallax parallax-mg" />
      <div className="world-content">
      <div className="main-content animate-fade-in">
        <h1>Καλώς ήρθες στον μαγικό κόσμο της μάθησης!</h1>
        <p>
          Εξερεύνησε, παίξε, μάθε! Από ασκήσεις μέχρι γρίφους, σε περιμένουν πάνω από xxx δραστηριότητες!
        </p>
        <button className="cta-btn pulse" onClick={() => handleSelection('1st Grade')}>
          Ξεκίνησε Δωρεάν
        </button>
      </div>
      </div>

      
    </div>
  );
}
