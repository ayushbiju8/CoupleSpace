import React, { useState } from 'react'
import './QualityTalks.css'
import TopPart from '../../../utilities/TopPart/TopPart.jsx'

function QualityTalks() {
    const questions = [
        "Would you like to have personal space in a relationship?",
        "Do you believe in soulmates?",
        "How important is communication in a relationship?",
        "Would you prefer to spend weekends with your partner?",
        "What do you think about long-distance relationships?",
        "Do you believe in love at first sight?",
        "How do you feel about spending time alone in a relationship?",
        "What is more important: honesty or kindness in a relationship?",
        "Would you like your partner to be your best friend?",
        "Is it okay to have separate hobbies in a relationship?"
    ];

    // State for current question index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to handle swipe to next question
    const nextQuestion = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
    };

    // Function to handle swipe to previous question
    const prevQuestion = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + questions.length) % questions.length);
    };

    return (
        <div className='QTBODY'>
            <TopPart />
            <div className="QTquiz-container">
                <div className="QTquestion-box">
                    <p className="QTquestion">{questions[currentIndex]}</p>
                </div>
                <div className="QTswipe-buttons">
                    <button className="QTswipe-btn" onClick={prevQuestion}>⬅️</button>
                    <button className="QTswipe-btn" onClick={nextQuestion}>➡️</button>
                </div>
                <p>Note: A good and quality talk with your partner is always nurturing, comforting, and builds deeper understanding. Answer locally with your partner or on a call.</p>
            </div>
        </div>
    );
};
export default QualityTalks;
