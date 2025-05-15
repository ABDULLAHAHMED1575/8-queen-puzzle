import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your mental health companion. How are you feeling today?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Clear input field
    setInput('');
    
    // Show loading state
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages, 
        { 
          text: data.answer, 
          sender: 'bot',
          confidence: data.confidence,
          matchedQuestion: data.matched_question 
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: 'bot',
          error: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mental Health Companion</h1>
        <p>A safe space to talk about your mental health</p>
      </header>
      
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-bubble">
                <p>{message.text}</p>
                {message.confidence && message.confidence < 0.5 && (
                  <div className="confidence-note">
                    <small>I'm not entirely sure about this answer. Please clarify if needed.</small>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot-message">
              <div className="message-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
      
      <footer>
        <p>
          This is not a substitute for professional mental health services. 
          If you're in crisis, please reach out to a mental health professional.
        </p>
      </footer>
    </div>
  );
}

export default App;