import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = ({ isActive }) => {
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState("");

    const handleSendMessage = async () => {
        if (!userMessage.trim() || !isActive) return;

        const newMessage = { sender: "user", text: userMessage };
        setMessages([...messages, newMessage]);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: userMessage
            });
            const botResponse = { sender: "bot", text: response.data.response };
            setMessages([...messages, newMessage, botResponse]);
        } catch (error) {
            console.error("Error:", error);
        }

        setUserMessage("");
    };

    return (
        <div className="chatbot">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <strong>{msg.sender === 'bot' ? 'Bot' : 'You'}: </strong>
                        <span>{msg.text}</span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={isActive ? "Type your message..." : "Upload a document to start"}
                disabled={!isActive}
            />
            <button onClick={handleSendMessage} disabled={!isActive}>
                Send
            </button>
        </div>
    );
};

export default Chatbot;
