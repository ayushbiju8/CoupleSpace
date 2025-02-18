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

  // Reference for scrolling
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Fetch Receiver Details
  const getDetails = async () => {
    try {
      const response = await axios.get("https://couplespace.onrender.com/api/v1/chat/coupleChat", {
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

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://couplespace.onrender.com/api/v1/chat`, {
        withCredentials: true,
      });

      // Sort messages by createdAt in ascending order
      const sortedMessages = response.data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch initial messages and set up socket listeners
  useEffect(() => {
    getDetails();
    fetchMessages();

    // Socket connection and listeners
    socket.on("connect", () => {
      console.log("Connected to socket with ID:", socket.id);
    });

    socket.on("sendBack", (data) => {
      if (data) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: data.senderId, receiverId: data.receiverId, text: data.text, image: data.image, createdAt: new Date() },
        ]);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("sendBack");
    };
  }, []);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send Message Handler
  const handleSendMessage = async () => {
    if (message.trim() || file) {
      let imageUrl = null;

      // Step 1: Check if there's a file (image)
      if (file) {
        const formData = new FormData();
        formData.append('image', file); // Attach the file to the FormData
        setLoading(true)
        try {
          const response = await axios.post('https://couplespace.onrender.com/api/v1/chat/imageUpload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }, withCredentials: true,
          });
          console.log(response);

          imageUrl = response.data.data.image;
          console.log(imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally{
          setLoading(false)
        }
      }

      // Step 4: Send the message (with or without image URL) through Socket.IO
      socket.emit('send', {
        text: message,
        image: imageUrl,  // If there's no image, this will be null
      });

      // Clear message and file state after sending
      setMessage('');
      setFile(null);
      setFilePreview(null)
    }
  };

  const [filePreview, setFilePreview] = useState(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile); // Read the image file as Data URL
    }
  };
  const deSelectImage = (e) => {
    setFile(null);
    setFilePreview(null);
  }

  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Uploading...</p>
        </div>
      ) : (
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
            style={{ overflowY: 'scroll', height: '400px' }}
            ref={messagesContainerRef}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.senderId === receiverId ? 'receiver' : 'sender'}`}
              >
                {/* Display image if it exists */}
                {msg.image && <img src={msg.image} alt="Sent" className="chat-image" />}

                {/* Display text if it exists */}
                {msg.text && <p>{msg.text}</p>}
              </div>
            ))}

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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                  <path d="M5.82338 12L4.27922 10.4558C2.57359 8.75022 2.57359 5.98485 4.27922 4.27922C5.98485 2.57359 8.75022 2.57359 10.4558 4.27922L19.7208 13.5442C21.4264 15.2498 21.4264 18.0152 19.7208 19.7208C18.0152 21.4264 15.2498 21.4264 13.5442 19.7208L10.0698 16.2464C9.00379 15.1804 9.00379 13.4521 10.0698 12.386C11.1358 11.32 12.8642 11.32 13.9302 12.386L15.8604 14.3162" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </label>
              {filePreview && (
                <div className="image-preview">
                  <img src={filePreview} alt="Preview" />
                  <div className="CloseImage" onClick={deSelectImage}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={28} height={28} color={"white"} fill={"none"}>
                    <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                  </svg></div>
                </div>
              )}
            </div>

            <input
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
      )}
    </>
  );
};

export default Chat;
