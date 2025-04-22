import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import imgurl from "./images/logo.jpg"
import './Header.css'; // Σιγουρέψου ότι το αρχείο CSS εισάγεται σωστά

function Header() {
  const [isWorksheetMenuOpen, setIsWorksheetMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleWorksheetSelection = (path) => {
    navigate(path);
  };

  const handleSelection = (grade) => {
    navigate(`/second_page/${grade}`);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoClick = () => {
    navigate('/'); // Πηγαίνει στην αρχική σελίδα όταν το logo πατηθεί
  };

  return (
    <header className="header">
      <div className="navbar">
        <img src= {imgurl} alt="Education Logo" className="logo" onClick={handleLogoClick} // Προσθήκη του onClick
          style={{ cursor: 'pointer' }} // Προσθήκη του pointer για καλύτερο UX
          />

        {/* Navigation Links */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <div
            className="dropdown"
            onMouseEnter={() => setIsWorksheetMenuOpen(true)}
            onMouseLeave={() => setIsWorksheetMenuOpen(false)}
            onClick={() => setIsWorksheetMenuOpen(prev => !prev)} // <-- added click toggle
          >
            <span className="nav-item">Worksheets</span>
            {isWorksheetMenuOpen && (
              <div className="dropdown-content">
                <div className="dropdown-column">
                  <h4>By Grade</h4>
                  <ul>
                    <li onClick={() => handleSelection('1st Grade')}>1st Grade</li>
                    <li onClick={() => handleSelection('2st Grade')}>2st Grade</li>
                    <li onClick={() => handleWorksheetSelection('/worksheets/3rd-grade')}>3rd Grade</li>
                    <li onClick={() => handleWorksheetSelection('/worksheets/4th-grade')}>4th Grade</li>
                    <li onClick={() => handleWorksheetSelection('/worksheets/5th-grade')}>5th Grade</li>
                    <li onClick={() => handleWorksheetSelection('/worksheets/6th-grade')}>6th Grade</li>
                  </ul>
                </div>
                <div className="dropdown-column">
                  <h4>By Subject</h4>
                  <ul>
                    <li onClick={() => handleWorksheetSelection('/worksheets/math')}>Math</li>
                    <li onClick={() => handleWorksheetSelection('/worksheets/science')}>Science</li>
                    <li onClick={() => handleWorksheetSelection('/worksheets/english')}>English Language </li>
                    <li onClick={() => handleWorksheetSelection('/worksheets/social-studies')}>Social Studies</li>
                    <li onClick={() => handleWorksheetSelection('/worksheets/fine-arts')}>Fine Arts</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <a href="#">Games</a>
          <a href="#">Lesson Plans</a>
          <a href="#">Activities</a>
        </nav>
        <div className="menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />} {/* Εναλλαγή εικονιδίου */}
        </div>
      </div>
    </header>
  );
}

export default Header;
