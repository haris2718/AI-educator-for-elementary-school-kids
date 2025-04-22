import React from 'react';
import './MainSection.css';
import { useNavigate } from 'react-router-dom';
import landing_image from './images/landing_image2.png'; // Εικόνα για το background
function MainSection() {
  const navigate = useNavigate();
  const handleSelection = (grade) => {
    navigate(`/second_page/${grade}`);
  };

  return (
    <main className="main-section">
      <div className="main-bg-animation"></div>
      <div className="main-content animate-fade-in">
        <h1>Καλώς ήρθες στον μαγικό κόσμο της μάθησης!</h1>
        <p>
          Εξερεύνησε, παίξε, μάθε! Από ασκήσεις μέχρι γρίφους, σε περιμένουν πάνω από 37.000 δραστηριότητες!
        </p>
        <button className="cta-btn pulse" onClick={() => handleSelection('1st Grade')}>
          Ξεκίνησε Δωρεάν
        </button>
      </div>

      <div className="illustration animate-slide-in">
        <img src= { landing_image }  alt="Kids learning" />
      </div>
    </main>
  );
}

export default MainSection;
