import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import Quiz from "./Quiz";

export default function QuizPage() {
  // Λήψη των παραμέτρων grade και subject από το URL
  const { grade, subject } = useParams();
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Δημιουργία δυναμικών επιλογών για κεφάλαια (1 έως 10)
  const options = Array.from({ length: 10 }, (_, i) => ({
    label: `Κεφάλαιο ${i + 1}`,
    value: i + 1,
  }));

  // Κατασκευή του API endpoint προσθέτοντας το επιλεγμένο κεφάλαιο και το subject  `/quiz_end_point?chapter=${selectedChapter}&subject=${encodeURIComponent(subject)}` http://localhost/xampp/quiz_end_point.php
  const apiEndpoint = selectedChapter
    ? `/quiz_end_point?chapter=${selectedChapter}&subject=${encodeURIComponent(subject)}`
    : "";

  // Debugging - Έλεγχος αν ενημερώνεται το selectedChapter
  useEffect(() => {
    console.log("Το selectedChapter ενημερώθηκε:", selectedChapter);
  }, [selectedChapter]);

  return (
    <>
    <Header />
    <div className="pre-chat">
      
      <main>
        <label htmlFor="chapterSelect">Επιλέξτε κεφάλαιο:</label>
        <select
          id="chapterSelect"
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            console.log("Επιλεγμένο κεφάλαιο:", value);
            setSelectedChapter(value);
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Επιλέξτε κεφάλαιο
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {selectedChapter ? (
          <Quiz apiEndpoint={apiEndpoint} />
        ) : (
          <p>Επιλέξτε ένα κεφάλαιο από το dropdown.</p>
        )}
      </main>
      
    </div>
    <Footer />
    </>
  );
}
