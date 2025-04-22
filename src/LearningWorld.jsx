import React, { useState } from "react";
import "./LearningWorld.css";

export default function LearningWorld() {
  const [activeModal, setActiveModal] = useState(null);

  const locations = [
    {
      id: "math",
      name: "Βουνό των Μαθηματικών",
      top: "35%",
      left: "20%",
      content: "Εδώ θα βρεις ασκήσεις, quiz και γρίφους στα μαθηματικά!",
    },
    {
      id: "language",
      name: "Λίμνη της Γλώσσας",
      top: "55%",
      left: "50%",
      content: "Γλώσσα και έκφραση με παιχνίδια και ιστορίες!",
    },
    {
      id: "science",
      name: "Δάσος της Επιστήμης",
      top: "30%",
      left: "75%",
      content: "Πειράματα, φυσικά φαινόμενα και εξερευνήσεις!",
    },
  ];

  return (
    <div className="learning-world">
      <div className="parallax parallax-bg" />
      <div className="parallax parallax-bg1" />
      <div className="parallax parallax-mg" />
      <div className="world-content">
        {locations.map((loc) => (
          <button
            key={loc.id}
            className="location-button"
            style={{ top: loc.top, left: loc.left }}
            onClick={() => setActiveModal(loc)}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{activeModal.name}</h2>
            <p>{activeModal.content}</p>
            <button onClick={() => setActiveModal(null)}>Κλείσιμο</button>
          </div>
        </div>
      )}
    </div>
  );
}
