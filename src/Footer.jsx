import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Εισαγωγή εικονιδίων
import './Footer.css'; // Σιγουρέψου ότι έχεις ένα αρχείο CSS για το footer

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h4>About Us</h4>
          <p>
            We provide educational resources to help students learn and grow. 
            From worksheets to lesson plans, our tools are designed to support a wide range of learning needs.
          </p>
        </div>
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Worksheets</a></li>
            <li><a href="#">Games</a></li>
            <li><a href="#">Activities</a></li>
            <li><a href="#">Lesson Plans</a></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <ul>
            <li>Email: support@educationapp.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Address: 123 Learning St, Education City</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EducationApp. All rights reserved.</p>
        <div className="socials">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

