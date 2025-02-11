import React from 'react'
import TopPart from '../../utilities/TopPart/TopPart'
import "./Funquests.css"
import starImage from "../../assets/funquests/star2.jpeg"
import QualityTalks from "../../assets/funquests/QualityTalks.jpeg"
import TruthOrDare from "../../assets/funquests/TruthOrDare.jpeg"
import WouldYouRather from "../../assets/funquests/WouldYouRather.jpeg"
import { useNavigate } from 'react-router-dom'

function Funquests() {
  const navigate = useNavigate()
  return (
    <div>
      <TopPart />
      <h2 className='PositionAndCenter'>Games</h2>
      <div className="gamesInFunQuests">
        <div className="gameBox" onClick={()=>{navigate("/games/qualitytalks")}}>
          <img src={QualityTalks} alt=""/>
        </div>
        <div className="gameBox" onClick={()=>{navigate("/games/wouldyourather")}}>
          <img src={WouldYouRather} alt="" />
        </div>
        <div className="gameBox" onClick={()=>{navigate("/games/truthordare")}}>
          <img src={TruthOrDare} alt="" />
        </div>
      </div>
      <h2 className='PositionAndCenter'>Achivements</h2>
      <div className="questLists">
        <div className="questItem">
          <img src={starImage} alt="" />
          <p>The Task</p>
          <span>1/100</span>
        </div>
        <div className="questItem">
          <img src={starImage} alt="" />
          <p>The Task</p>
          <span>1/100</span>
        </div>
        <div className="questItem">
          <img src={starImage} alt="" />
          <p>The Task</p>
          <span>1/100</span>
        </div>
      </div>
    </div>
  )
}

export default Funquests
