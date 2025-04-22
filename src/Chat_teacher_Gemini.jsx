import React, { useState, useEffect, useRef } from "react";
import DOMPurify from 'dompurify';
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import './Chat.css';

function Chat_gemini() {
  const { grade, subject } = useParams();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [quizState, setQuizState] = useState({
    name: "",
    chapter: "",
    index: -1,
    score: 0.0,
    question: "",
    answer: "",
    correct_answer: 0,
    evaluation: "",
    status: "welcome", // awaiting_info
    subject: subject,
    model: "gemini-1.5-pro" // προεπιλεγμένο μοντέλο
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const messagesEndRef = useRef(null);
  const didFetchWelcome = useRef(false);

  // Νέα state για την επιλογή μοντέλου
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");

  

  // Επιλογές μοντέλων
  const modelOptions = [
    { label: "Gemini 2.0 Flash Thinking", value: "gemini-2.0-flash-thinking-exp" },
    { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
    {label:"gemini-2.0-flash",value:"gemini-2.0-flash"},
    {label:"gemini-1.5-flash",value:"gemini-1.5-flash"},  
    {label:"gemini-2.0-flash-lite-preview-02-05",value:"gemini-2.0-flash-lite-preview-02-05"},
    {label:"gemini-1.5-flash-8b",value:"gemini-1.5-flash-8b"}
    //{label:"χαρης",value:"gemφςεφεφργ"}
    // Μπορείς να προσθέσεις κι άλλα μοντέλα αν χρειάζεται
  ];

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  };
  
  
  

  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Όταν αλλάζει το selectedModel, ενημερώνουμε το quizState με το νέο μοντέλο
  useEffect(() => {
    setQuizState(prev => ({ ...prev, model: selectedModel }));
  }, [selectedModel]);

  useEffect(() => {
    console.log("🔄 Ενημερώθηκε το quizState:", quizState);

    // Αν το status γίνει "evaluation", κάνε αυτόματη κλήση για την επόμενη ερώτηση
    if (quizState.status === "quiz") {
      fetchNextQuestion();
    } else  if (quizState.status === "welcome" && !didFetchWelcome.current) {
      fetchwelcome();
      didFetchWelcome.current = true;
    }
  }, [quizState]);

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

  const fetchNextQuestion = async () => {
    try {
      const response = await fetch("/api/teacher_exam_Gemini", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizState,
          status: "quiz",
          evaluation: ""
        })
      });

      if (!response.ok) throw new Error('Σφάλμα επικοινωνίας με τον server.');

      const data = await response.json();
      setQuizState(data);

      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: data.question || "Λάθος απάντηση από το API" }
      ]);
      scrollToBottom();
    } catch (error) {
      console.error('Σφάλμα:', error);
    }
    
  };

  const fetchwelcome = async () => {
    try {
      const response = await fetch("/api/teacher_exam_Gemini", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizState,
          status: "welcome",
          evaluation: ""
        })
      });

      if (!response.ok) throw new Error('Σφάλμα επικοινωνίας με τον server.');

      const data = await response.json();
      setQuizState(data);

      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: data.question || "Λάθος απάντηση από το API" }
      ]);
      scrollToBottom();
    } catch (error) {
      console.error('Σφάλμα:', error);
    }
    
  };

  const sendMessage = async () => {
    if (userInput.trim() === '' || isLoading) return;
      // 🔒 Sanitize user input
    const sanitizedUserInput = DOMPurify.sanitize(userInput);

    const userMessage = sanitizedUserInput; // Χρησιμοποίησε αυτό για όλα

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setUserInput('');
    setIsLoading(true);
    //http://localhost:1000/api/teacher_exam
    try {
      const response = await fetch("/api/teacher_exam_Gemini", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizState,
          evaluation: "",
          status: quizState.status,
          answer: userMessage
        })
      });

      if (!response.ok) throw new Error('Σφάλμα επικοινωνίας με τον server.');
      
      const data = await response.json();
      setQuizState(data);

      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: data.evaluation || data.question || "Λάθος απάντηση από το API" }
      ]);

      if (data.status === "completed") {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: `Το Quiz ολοκληρώθηκε! Τελικό σκορ: ${data.score}` },
          
          { sender: 'bot', text: `Για να συνεχίσουμε, παρακαλώ πληκτρολόγησε το κεφάλαιο που θέλεις να εξεταστείς.` }
        ]);
        setQuizState({ ...data, status: "awaiting_info", score: 0, correct_answer: 0, name: data.name });
      }
      }catch (error) {
      console.error('Σφάλμα:', error);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Σφάλμα κατά τη λήψη απάντησης από τον server.' }
      ]);
      
    } finally {
      scrollToBottom();
      setIsLoading(false);
    }
  };

  return (
    <div className="pre-chat">
      <Header />
      <div className="chat">
        <h3>Εξέταση Μαθητή για {subject} - {grade}</h3>
         {/* Dropdown για επιλογή μοντέλου */}
      <div className="select-container" style={{ textAlign: "center", marginTop: "1rem" }}>
        <label htmlFor="modelSelect">Επιλέξτε μοντέλο: </label>
        <select
          id="modelSelect"
          onChange={(e) => {
            const value = e.target.value;
            console.log("Επιλεγμένο μοντέλο:", value);
            setSelectedModel(value);
          }}
          defaultValue={selectedModel}
        >
          {modelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
        <div className="chatbox">
          <div className="messages" ref={messagesContainerRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                <strong>{msg.sender === 'user' ? 'Εσύ' : 'Δάσκαλος'}: </strong>
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(msg.text)}} />    
              </div>
            ))}
            <div />
          </div>
          <div className="input-container" ref={messagesEndRef}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isLoading ? `${loadingDots}` : 'Γράψε την απάντησή σου...'}
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? "Φόρτωση..." : "Αποστολή"}
            </button>
          </div>
        </div>
      </div>
     
      <Footer />
    </div>
  );
}

export default Chat_gemini;
