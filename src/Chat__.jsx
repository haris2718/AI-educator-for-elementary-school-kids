import React, { useState } from "react";
import { useParams } from "react-router-dom";
import './Chat.css';

function Chat() {
  const { grade, subject } = useParams();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: userInput },
    ]);

    setUserInput('');

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
      });

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: data.answer },
      ]);
    } catch (error) {
      console.error('Σφάλμα:', error);
    }
  };

  return (
    <div className="chat">
      <h3>Συζήτηση για {subject} - {grade}</h3>
      <div className="chatbox">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
            >
              <strong>{message.sender === 'user' ? 'Εσύ' : 'Bot'}: </strong>
              {message.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Πληκτρολογήστε την ερώτησή σας"
          />
          <button onClick={sendMessage}>Αποστολή</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;

