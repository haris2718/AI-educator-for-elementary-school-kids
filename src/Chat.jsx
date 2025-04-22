import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import './Chat.css';

function Chat() {
  const { grade, subject } = useParams();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loadingDots, setLoadingDots] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [selectedModel, setSelectedModel] = useState("Groq_llama3.3");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    const messagesContainer = messagesEndRef.current?.parentNode;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      let counter = 0;
      const interval = setInterval(() => {
        counter = (counter + 1) % 4; // 0, 1, 2, 3
        setLoadingDots(".".repeat(counter));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingDots("");
    }
  }, [isLoading]);

const sendMessage = async () => {
  if (userInput.trim() === '') return;

  // Προσθήκη του μηνύματος του χρήστη στη λίστα
  const userMessage = userInput;
  setMessages((prevMessages) => [
    ...prevMessages,
    { sender: 'user', text: userMessage },
  ]);

  setUserInput('');
  setIsLoading(true);

  const controller = new AbortController();
  setAbortController(controller);

  const isGroqModel = selectedModel.startsWith("Groq");
  const apiEndpoint = isGroqModel ? "/api/chat" : "/api/chat_gemini";

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userInput,
        subject: subject,
        class: grade,
        model: selectedModel.split("_")[1]
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response from server.');
    }

    if (isGroqModel || selectedModel === "Gemini-2.0-flash") {
      // 🚀 Streaming Response
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let botMessage = '';
      let botMessageIndex = null;

      setMessages((prevMessages) => {
        botMessageIndex = prevMessages.length;
        return [...prevMessages, { sender: 'bot', text: '' }];
      });

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botMessage += chunk;

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[botMessageIndex].text = botMessage;
          return updatedMessages;
        });

        scrollToBottom();
      }
    } else {
      // ✅ Non-Streaming Response
      const data = await response.json();
      const botMessage = data.answer || 'Σφάλμα: Κενή απάντηση από το API.';

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botMessage },
      ]);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Το αίτημα ακυρώθηκε.');
    } else {
      console.error('Σφάλμα:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Σφάλμα κατά τη λήψη απάντησης από το διακομιστή.' },
      ]);
    }
  } finally {
    setIsLoading(false);
    setAbortController(null);
  }
};

  const cancelMessage = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setAbortController(null);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];

        if (lastMessage?.sender === 'user') {
          updatedMessages.pop();
        }

        return updatedMessages;
      });
    }
  };

  const handleButtonClick = () => {
    if (isLoading) {
      cancelMessage();
    } else {
      sendMessage();
    }
  };

  return (
    <div className="pre-chat">
      <Header />
      <div className="chat">
        <h3>Συζήτηση για {subject} - {grade}</h3>
        <div className="model-selector">
          <label htmlFor="model">Επιλέξτε μοντέλο: </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="Groq_llama3.3">Groq_llama3.3</option>
            <option value="Gemini-2.0-flash">Gemini-2.0-flash</option>
          </select>
        </div>
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
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              placeholder={isLoading ? `${loadingDots}` : 'Κάνε την ερώτηση σου...'}
              disabled={isLoading}
            />
            <button onClick={handleButtonClick}>
              {isLoading ? 'Ακύρωση' : 'Αποστολή'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Chat;
