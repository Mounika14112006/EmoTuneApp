import React, { useState } from 'react';
import './Chatbot.css';

const emotions = ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Fearful', 'Disgusted'];

const Chatbot = ({ onEmotionSelect }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! What's your mood now? Choose an option.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showEmotionOptions, setShowEmotionOptions] = useState(true);

  const sendUserMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleEmotionClick = (emotion) => {
    sendUserMessage(emotion);
    setShowEmotionOptions(false);

    const botResponse = {
      id: messages.length + 2,
      text: `Thanks for telling me you feel ${emotion}. I'll show some song recommendations!`,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, botResponse]);

    if (onEmotionSelect) {
      onEmotionSelect(emotion);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    sendUserMessage(inputText.trim());
    setInputText('');

    const botReply = {
      id: messages.length + 2,
      text: `Thanks for your message! You said: "${inputText.trim()}". You can also select your mood above to get songs.`,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, botReply]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>💬 Emotune Assistant</h2>
        <p>Chat with our AI assistant</p>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showEmotionOptions && (
        <div className="emotion-options">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              className="emotion-btn"
              onClick={() => handleEmotionClick(emotion)}
            >
              {emotion}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
