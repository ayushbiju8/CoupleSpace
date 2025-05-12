import React, { useEffect, useState } from 'react';
import TopPart from '../../utilities/TopPart/TopPart';
import "./Funquests.css";
import starImage from "../../assets/funquests/star2.jpeg";
import QualityTalks from "../../assets/funquests/QualityTalks.jpeg";
import TruthOrDare from "../../assets/funquests/TruthOrDare.jpeg";
import WouldYouRather from "../../assets/funquests/WouldYouRather.jpeg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Funquests() {
  const navigate = useNavigate();
  const [cupidScore, setCupidScore] = useState(0);
  const [daysTogether, setDaysTogether] = useState(0);

  // Fetch achievement data from backend
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_DEVELOPMENT_URL}/api/v1/couples/achievements`,{
          withCredentials:true
        }); // Update the correct API route
        setCupidScore(res.data.cupidScore || 0);
        setDaysTogether(res.data.daysTogether || 0);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div>
      <TopPart />
      <h2 className='PositionAndCenter'>Games</h2>
      <div className="gamesInFunQuests">
        <div className="gameBox" onClick={() => navigate("/games/qualitytalks")}>
          <img src={QualityTalks} alt="Quality Talks" />
        </div>
        <div className="gameBox" onClick={() => navigate("/games/wouldyourather")}>
          <img src={WouldYouRather} alt="Would You Rather" />
        </div>
        <div className="gameBox" onClick={() => navigate("/games/truthordare")}>
          <img src={TruthOrDare} alt="Truth or Dare" />
        </div>
      </div>

      <h2 className='PositionAndCenter'>Achievements</h2>
      <div className="questLists">
        {/* Task 1: Cupid Score */}
        <div className="questItem">
          <img src={starImage} alt="Cupid Score" />
          <p><strong>Cupid Score</strong> </p>
          <span>{cupidScore} 🔥</span>
        </div>

        {/* Task 2: Days Together */}
        <div className="questItem">
          <img src={starImage} alt="Days Together" />
          <p><strong> Days Together</strong></p>
          <span>{daysTogether} ❤️</span>
        </div>
      </div>
    </div>
  );
}

export default Funquests;
