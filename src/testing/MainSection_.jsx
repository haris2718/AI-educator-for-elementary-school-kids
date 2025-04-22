import React from 'react';
import './MainSection.css'; // Σιγουρέψου ότι το αρχείο CSS εισάγεται σωστά
import { useNavigate } from 'react-router-dom';



function MainSection() {
  const navigate = useNavigate();
  const handleSelection = (grade) => {
    navigate(`/second_page/${grade}`);
  };
  return (
    <main className="main-section">
      <div className="main-content">
        <h1>Discover a limitless world of learning</h1>
        <p>
          Review concepts and explore new topics with worksheets, hands-on activities, puzzles, 
          games, and more—the options are endless! Access our library of 37,000+ resources today.
        </p>
        <button className="cta-btn" onClick={() => handleSelection('1st Grade')}>Join for free</button>
      </div>

      <div className="illustration">
        <img src="/path/to/illustration.png" alt="Cartoon Characters" />
      </div>
    </main>
  );
}

export default MainSection;
