import React from 'react';
import Header from './Header'; // Εισαγωγή του Header component
import MainSection from './MainSection'; // Εισαγωγή του MainSection component
import Footer from './Footer'; // Εισαγωγή του Footer component
import './LandingPage.css'; // CSS

function LandingPage() {
  return (
    <div className="landing-page">
      <Header /> {/* Χρήση του Header component */}
      <MainSection /> {/* Χρήση του MainSection component */}
      <Footer /> {/* Προσθήκη του Footer στο τέλος της σελίδας */}
    </div>
  );
}

export default LandingPage;
