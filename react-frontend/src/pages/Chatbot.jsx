import React, { useState } from "react";
import "./styles/chatstyle.css";
import axios from "axios";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const getCurrentTime = () => {
    const date = new Date();
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      type: "user",
      text: input,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/get", {
        msg: input,
      });
      const botMessage = {
        type: "bot",
        text: response.data,
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className="chat-container"
    >
      <div className="chat-box">
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="avatar-container">
              <img
                src="https://i.ibb.co/fSNP7Rz/icons8-chatgpt-512.png"
                className="avatar"
                alt="bot avatar"
              />
              <span className="online-indicator"></span>
            </div>
            <div className="user-info">
              <span className="bot-name">Mr.Careful</span>
              <p className="bot-status">Ask me anything!</p>
            </div>
          </div>
        </div>

        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-row ${
                msg.type === "user" ? "right" : "left"
              }`}
            >
              {msg.type === "bot" && (
                <div className="message-avatar">
                  <img
                    src="https://i.ibb.co/fSNP7Rz/icons8-chatgpt-512.png"
                    className="message-img"
                    alt="bot"
                  />
                </div>
              )}
              <div className={`message-bubble ${msg.type}`}>
                {msg.text}
                <span className="message-time">{msg.time}</span>
              </div>
              {msg.type === "user" && (
                <div className="message-avatar">
                  <img
                    src="https://i.ibb.co/d5b84Xw/Untitled-design.png"
                    className="message-img"
                    alt="you"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-footer">
          <form className="message-form" onSubmit={sendMessage}>
            <input
              type="text"
              name="msg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="message-input"
              placeholder="Type your message..."
            />
            <button type="submit" className="send-button">
              <i className="fas fa-location-arrow"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
