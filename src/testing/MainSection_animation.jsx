import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import "./MainSection_animation.css";

function MainSection_animation() {
  const navigate = useNavigate();

  // Συνάρτηση για την πλοήγηση στη δεύτερη σελίδα
  const handleSelection = (grade) => {
    navigate(`/second_page/${grade}`);
  };

  // Χρήση του useInView για παρακολούθηση του scroll
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Animation για τα εικονίδια
  const iconAnimations = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + i * 0.2, duration: 0.6 },
    }),
  };

  // Τα εικονίδια και οι ετικέτες τους
  const icons = [
    { emoji: "🧠", label: "Μάθηση" },
    { emoji: "🎮", label: "Παιχνίδι" },
    { emoji: "📊", label: "Πρόοδος" },
  ];

  return (
    <main className="app-section" ref={ref}>
      <motion.div
        className="app-content"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h1 className="title">Μάθε μέσα από το παιχνίδι!</h1>
        <p className="subtitle">
          Διάλεξε δραστηριότητες και ξεκίνα να εξερευνάς έναν διαδραστικό κόσμο γνώσης.
        </p>
        {/* Κουμπί για την επιλογή της τάξης */}
        <button className="cta-button" onClick={() => handleSelection('1st Grade')}>
          Ξεκίνα τώρα
        </button>
      </motion.div>

      {/* Εικονίδια με animation */}
      <div className="icons-grid">
        {icons.map((icon, i) => (
          <motion.div
            className="icon-box"
            key={i}
            custom={i}
            variants={iconAnimations}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {icon.emoji} {icon.label}
          </motion.div>
        ))}
      </div>
    </main>
  );
}

export default MainSection_animation;
