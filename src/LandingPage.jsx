import React from 'react';
import Header from './Header'; // Εισαγωγή του Header component
import MainSection from './MainSection_with_mountains'; // Εισαγωγή του MainSection MainSection component LearningWorld
import Footer from './Footer'; // Εισαγωγή του Footer component
import './LandingPage.css'; // CSS

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
        <main>
          <MainSection />
        </main>
      <Footer />
  </div>

  ); 
}

export default LandingPage;
