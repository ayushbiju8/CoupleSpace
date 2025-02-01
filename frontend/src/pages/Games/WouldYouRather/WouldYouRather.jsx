import React, { useState } from "react";
import "./WouldYouRather.css";
import TopPart from "../../../utilities/TopPart/TopPart";

const WouldYouRather = () => {
    // Array of questions
    const questions = [
        {
            question: "Would you rather go on a romantic dinner date or stay in for a movie night?",
            option1: "Romantic Dinner Date",
            option2: "Stay in for a Movie Night",
        },
        {
            question: "Would you rather receive a handwritten love letter or a surprise gift?",
            option1: "Handwritten Love Letter",
            option2: "Surprise Gift",
        },
        {
            question: "Would you rather travel to a cozy cabin or a luxury beach resort?",
            option1: "Cozy Cabin",
            option2: "Luxury Beach Resort",
        },
        {
            question: "Would you rather spend the day hiking together or relaxing at home?",
            option1: "Hiking Together",
            option2: "Relaxing at Home",
        },
        {
            question: "Would you rather plan a big wedding or have a small, intimate ceremony?",
            option1: "Big Wedding",
            option2: "Small, Intimate Ceremony",
        },
    ];

    // State for current question index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to go to the next question
    const nextQuestion = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
    };

    return (
        <>
            <TopPart />
            <div className="WYRgame-container">
                <div className="WYRquestion-card">
                    <h2 className="WYRquestion">{questions[currentIndex].question}</h2>
                    <div className="WYRoptions">
                        <button className="WYRoption-btn">{questions[currentIndex].option1}</button>
                        <button className="WYRoption-btn">{questions[currentIndex].option2}</button>
                    </div>
                    <button className="WYRnext-btn" onClick={nextQuestion}>
                        Next Question ➡️
                    </button>
                </div>
            </div>
        </>
    );
};

export default WouldYouRather;
