import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import socket from '../../utilities/socket.js';
import axios from 'axios';
import ProfileImage from "../../assets/DefaultProfilePicture.jpg";

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);

  // Receiver Details
  const [receiverName, setReceiverName] = useState('');
  const [receiverUserName, setReceiverUserName] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [receiverImage, setReceiverImage] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Reference for scrolling
  const messagesEndRef = useRef(null);

  // Fetch Receiver Details
  const getDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/chat/coupleChat", {
        withCredentials: true,
      });
      const data = response.data.data;
      setReceiverName(data.fullName);
      setReceiverId(data._id);
      setReceiverUserName(data.userName);
      setReceiverImage(data.profilePicture);
    } catch (error) {
      console.error("Error fetching couple space data:", error);
    }
  };

  // Fetch Messages from the API
  const fetchMessages = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/v1/chat`, {
        withCredentials: true,
        params: { page, limit: 10 }, // Adjust as per pagination limit
      });
  
      // Sort messages by createdAt in ascending order
      const sortedMessages = response.data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
      // Combine previous and new messages
      const allMessages = [...messages, ...sortedMessages];
  
      // Remove duplicates by checking _id
      const uniqueMessages = allMessages.filter((value, index, self) =>
        index === self.findIndex((msg) => msg._id === value._id)
      );
  
      // Set the unique messages to the state
      setMessages(uniqueMessages);
      setPage(page); // Update page after fetching
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching messages:", error);
    }
  };
  

  // Scroll handler to load old messages
  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && !loading) {
      const nextPage = page + 1;
      fetchMessages(nextPage);
    }
  };

  // Fetch initial messages and set up socket listeners
  useEffect(() => {
    getDetails();
    fetchMessages(page);

    // Socket connection and listeners
    socket.on("connect", () => {
      console.log("Connected to socket with ID:", socket.id);
    });

    socket.on("sendBack", (data) => {
      if (data) {
        // Push incoming message directly into the state with correct sender/receiver information
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: data.senderId, receiverId: data.receiverId, text: data.text, createdAt: new Date() },
        ]);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("sendBack");
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Auto-scroll to bottom whenever the message list changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send Message Handler
  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("send", message);
      setMessage('');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="chat-container">
      {/* Header - Receiver Info */}
      <div className="chat-header">
        <div className="profile-info">
          <div className="profile-pic">
            <img src={receiverImage || ProfileImage} alt="profile" />
          </div>
          <span className="receiver-name">{receiverName}</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="messages-container"
        onScroll={handleScroll}
        style={{ overflowY: 'scroll', height: '400px' }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.senderId === receiverId ? 'receiver' : 'sender'}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="loading-more">Loading more messages...</div>}
        
        {/* Ref for auto-scrolling to the bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="input-area">
        <div className="file-input-container">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            id="file-input"
            accept="image/*, .pdf, .doc, .txt"
          />
          <label htmlFor="file-input" className="file-input-label">
            📎
          </label>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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

export default Chat;
