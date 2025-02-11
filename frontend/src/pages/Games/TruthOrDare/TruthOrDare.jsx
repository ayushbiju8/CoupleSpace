import React, { useState } from 'react';
import './TruthOrDare.css';
import TopPart from '../../../utilities/TopPart/TopPart.jsx';

function TruthOrDare() {
    // Arrays for Truth questions and Dare challenges
    const truthQuestions = [
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

    const dareChallenges = [
        "Dance for 1 minute.",
        "Imitate your favorite animal.",
        "Call someone and sing to them.",
        "Do 20 push-ups.",
        "Try to touch your toes for 1 minute.",
        "Post something funny on your social media.",
        "Send a random emoji to a friend.",
        "Do a funny dance in front of the camera.",
        "Pretend to be a waiter and serve your partner.",
        "Talk in an accent for the next 5 minutes."
    ];

    // State for current question index
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTruth, setIsTruth] = useState(true); // State to toggle between Truth or Dare

    // Function to handle swipe to next question
    const nextItem = () => {
        if (isTruth) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % truthQuestions.length);
        } else {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % dareChallenges.length);
        }
    };

    // Function to handle swipe to previous question
    const prevItem = () => {
        if (isTruth) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + truthQuestions.length) % truthQuestions.length);
        } else {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + dareChallenges.length) % dareChallenges.length);
        }
    };

    // Function to toggle between Truth and Dare
    const toggleTruthOrDare = () => {
        setIsTruth(!isTruth);
        setCurrentIndex(0); // Reset index when switching between Truth and Dare
    };

    return (
        <div className='QTBODY'>
            <TopPart />
            <div className="QTquiz-container">
                <div className="QTquestion-box">
                    <p className="QTquestion">
                        {isTruth ? truthQuestions[currentIndex] : dareChallenges[currentIndex]}
                    </p>
                </div>
                <div className="QTswipe-buttons">
                    <button className="QTswipe-btn" onClick={prevItem}>⬅️</button>
                    <button className="QTswipe-btn" onClick={nextItem}>➡️</button>
                </div>
                <div className="QTtoggle-buttons">
                    <button className="QTtoggle-btn" onClick={toggleTruthOrDare}>
                        {isTruth ? "Switch to Dare" : "Switch to Truth"}
                    </button>
                </div>
                <p>Note: A good and quality talk with your partner is always nurturing, comforting, and builds deeper understanding. Answer locally with your partner or on a call.</p>
            </div>
        </div>
    );
};

export default TruthOrDare;
