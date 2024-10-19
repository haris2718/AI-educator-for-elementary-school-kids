import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header"
import Footer from "./Footer"
import './Chat.css';

function Chat() {
  const { grade, subject } = useParams();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(null); // Χρήση AbortController για ακύρωση αιτήματος
  
  // Αναφορά για το τέλος των μηνυμάτων για αυτόματο scroll
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    const messagesContainer = messagesEndRef.current?.parentNode; // Παίρνουμε το parent container που έχει overflow-y: auto
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight; // Κάνει scroll στο τέλος των μηνυμάτων
    }
  };
  

  // Κάθε φορά που αλλάζουν τα μηνύματα, γίνεται scroll στο κάτω μέρος
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    // Αφαίρεση της τελευταίας ερώτησης αν δεν έχει απαντηθεί ακόμη
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];

      if (lastMessage?.sender === 'user') {
        updatedMessages.pop(); // Διαγραφή της τελευταίας ερώτησης
      }

      return [
        ...updatedMessages,
        { sender: 'user', text: userInput }, // Προσθήκη της νέας ερώτησης
      ];
    });

    setUserInput('');
    setIsLoading(true); // Ενεργοποίηση του loading

    // Δημιουργία νέου AbortController για κάθε αίτημα
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userInput,
          subject: subject,
          class: grade,
        }),
        signal: controller.signal, // Προσθήκη του signal από το AbortController
      });

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: data.answer },
      ]);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Το αίτημα ακυρώθηκε.');
      } else {
        console.error('Σφάλμα:', error);
      }
    } finally {
      setIsLoading(false); // Απενεργοποίηση του loading μόλις έρθει η απάντηση ή ακυρωθεί
    }
  };

  const cancelMessage = () => {
    if (abortController) {
      abortController.abort(); // Ακύρωση του τρέχοντος αιτήματος
      setIsLoading(false); // Απενεργοποίηση του loading
      setAbortController(null); // Καθαρισμός του AbortController

      // Αφαίρεση της τελευταίας ερώτησης από το chatbox
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];

        if (lastMessage?.sender === 'user') {
          updatedMessages.pop(); // Διαγραφή της τελευταίας ερώτησης
        }

        return updatedMessages;
      });
    }
  };

  // Συνάρτηση που καλεί το κατάλληλο event ανάλογα με το isLoading
  const handleButtonClick = () => {
    if (isLoading) {
      cancelMessage(); // Αν περιμένουμε απάντηση, ακυρώνουμε την αποστολή
    } else {
      sendMessage(); // Αν δεν περιμένουμε απάντηση, στέλνουμε το μήνυμα
    }
  };

  return (
    <div className="pre-chat">
      <Header /> {/* Προσθήκη του Header */}
    <div className="chat">
      <h3>Συζήτηση για {subject} - {grade}</h3>
      <div className="chatbox">
        <div className="messages" ref={messagesEndRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
            >
              <strong>{message.sender === 'user' ? 'Εσύ' : 'Bot'}: </strong>
              {message.text}
            </div>
          ))}
          {/* Το div που χρησιμοποιείται για το scroll στο τέλος */}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Πληκτρολογήστε την ερώτησή σας"
            disabled={isLoading} // Απενεργοποίηση του πεδίου όταν περιμένουμε απάντηση
          />
          <button onClick={handleButtonClick}>
            {isLoading ? 'Ακύρωση' : 'Αποστολή'} {/* Αλλάζει το κείμενο ανάλογα με το isLoading */}
          </button>
        </div>
      </div>
    </div>
    <Footer /> {/* Προσθήκη του Footer */}
    </div>
  );
}

export default Chat;
