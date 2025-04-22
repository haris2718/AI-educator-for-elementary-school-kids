import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./MainSectionRobot.css";
import robotImg from "./images/robot_learning.png"; // Χρησιμοποίησε την εικόνα που ανέβασα ή βάλε δική σου

function MainSectionRobot() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/second_page/1st%20Grade");
  };

  return (
    <main className="robot-section">
      <div className="robot-content">
        <motion.h1
          className="robot-title"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Ξεκίνα το μαγικό ταξίδι της γνώσης!
        </motion.h1>

        <motion.p
          className="robot-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Ο ρομποτάκος μας σε περιμένει για να εξερευνήσετε μαζί τον κόσμο της μάθησης μέσα από παιχνίδι και φαντασία!
        </motion.p>

        <motion.button
          className="robot-button"
          onClick={handleStart}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Πάμε!
        </motion.button>
      </div>

      <motion.div
        className="robot-illustration"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <img src={robotImg} alt="Happy robot learning" />
      </motion.div>
    </main>
  );
}

export default MainSectionRobot;
