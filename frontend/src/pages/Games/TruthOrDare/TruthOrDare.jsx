import React, { useState } from "react";
import "./TruthOrDare.css";

const TruthOrDare = () => {
  const questions = [
    "What is something you’ve always wanted to ask your partner?",
    "What’s one thing you’d do to surprise your partner?",
    "What’s the most adventurous thing you’ve done in a relationship?",
    "What’s your favorite memory with your partner?",
    "What’s a fun activity you’d love to do together?",
  ];

  const truths = [
    "What’s one secret you’ve never told anyone?",
    "What’s your most embarrassing moment?",
    "What’s the biggest lie you’ve ever told?",
    "Who is your current celebrity crush?",
    "What’s the most romantic thing you’ve ever done?",
  ];

  const dares = [
    "Do your best impression of your partner.",
    "Send your partner a funny selfie.",
    "Sing the chorus of your favorite love song.",
    "Dance without music for 30 seconds.",
    "Share the last photo you took on your phone.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0); // Current question index
  const [response, setResponse] = useState(""); // Stores Truth or Dare response
  const [showResponse, setShowResponse] = useState(false); // Toggle response view

  // Handle the Truth or Dare button click
  const handleChoice = (choice) => {
    if (choice === "truth") {
      setResponse(truths[Math.floor(Math.random() * truths.length)]); // Random truth
    } else if (choice === "dare") {
      setResponse(dares[Math.floor(Math.random() * dares.length)]); // Random dare
    }
    setShowResponse(true); // Show the response
  };

  // Move to the next question
  const nextQuestion = () => {
    setShowResponse(false); // Hide the response
    setResponse(""); // Clear the previous response
    setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length); // Cycle through questions
  };

  return (
    <div className="TDgame-container">
      <div className="TDquestion-card">
        {!showResponse ? (
          <>
            <h2 className="TDquestion">{questions[currentIndex]}</h2>
            <div className="TDbuttons">
              <button
                className="TDchoice-btn TDtruth-btn"
                onClick={() => handleChoice("truth")}
              >
                Truth
              </button>
              <button
                className="TDchoice-btn TDdare-btn"
                onClick={() => handleChoice("dare")}
              >
                Dare
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="TDresponse-title">
              {response.includes("truth") ? "Truth" : "Dare"}
            </h2>
            <p className="TDresponse">{response}</p>
            <button className="TDnext-btn" onClick={nextQuestion}>
              Next Question ➡️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TruthOrDare;
