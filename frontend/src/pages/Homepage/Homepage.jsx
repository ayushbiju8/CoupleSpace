import React, { useState } from 'react'; // Fixed import
import { Link } from 'react-router-dom';
import './Homepage.css';
import couplebanner from '../../assets/homepage/couplebanner.png';
import couplepic from '../../assets/homepage/couplepic.jpg';
import calender from '../../assets/homepage/calender.jpg';
import chat from '../../assets/homepage/e.jpg';
import discover from '../../assets/homepage/discover.jpg';
import profile from '../../assets/homepage/profile.jpg';
import gift from '../../assets/homepage/gift.jpg';
import axios from "axios"
import { useNavigate } from 'react-router-dom'

function Homepage() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const navigate = useNavigate()
  const logoutUser = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/logout", {}, {
        withCredentials: true,
      }
      )
      console.log(response);
      navigate("/login")
    } catch (error) {
      console.error("Error Occured While Logging Out :" + error)
    }
  }
  return (
    <div className="homepage">
      <div className="navigationbarhomepage">
        <div className="logoinhomepage">
          <h2>COUPLE SPACE</h2>
        </div>
        <div className="searchbarinhomepage">
          <form action="/search" method="GET" className="searchform">
            <input
              type="text"
              name="query"
              className="searchinput"
              placeholder="search.."
            />
            <div className="searchlogo-container">
              <button
                type="button"
                className="searchlogo"
                onClick={toggleDropdown}
              >
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="currentColor"
                  className="dropdown-icon"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.4337 6.35C16.4337 8.74 14.4937 10.69 12.0937 10.69L12.0837 10.68C9.69365 10.68 7.74365 8.73 7.74365 6.34C7.74365 3.95 9.70365 2 12.0937 2C14.4837 2 16.4337 3.96 16.4337 6.35ZM14.9337 6.34C14.9337 4.78 13.6637 3.5 12.0937 3.5C10.5337 3.5 9.25365 4.78 9.25365 6.34C9.25365 7.9 10.5337 9.18 12.0937 9.18C13.6537 9.18 14.9337 7.9 14.9337 6.34Z"
                    fill="#323544"
                  />
                  <path
                    d="M12.0235 12.1895C14.6935 12.1895 16.7835 12.9395 18.2335 14.4195V14.4095C20.2801 16.4956 20.2739 19.2563 20.2735 19.4344L20.2735 19.4395C20.2635 19.8495 19.9335 20.1795 19.5235 20.1795H19.5135C19.0935 20.1695 18.7735 19.8295 18.7735 19.4195C18.7735 19.3695 18.7735 17.0895 17.1535 15.4495C15.9935 14.2795 14.2635 13.6795 12.0235 13.6795C9.78346 13.6795 8.05346 14.2795 6.89346 15.4495C5.27346 17.0995 5.27346 19.3995 5.27346 19.4195C5.27346 19.8295 4.94346 20.1795 4.53346 20.1795C4.17346 20.1995 3.77346 19.8595 3.77346 19.4495L3.77345 19.4448C3.77305 19.2771 3.76646 16.506 5.81346 14.4195C7.26346 12.9395 9.35346 12.1895 12.0235 12.1895Z"
                    fill="#323544"
                  />
                </svg>
              </button>
              {dropdownVisible && (
                <ul className={`dropdown-menu ${dropdownVisible ? "visible" : ""}`}>
                  <li>
                    <Link to="/settings">Settings</Link>
                  </li>
                  <li>
                    <Link to="/activity">Activity</Link>
                  </li>
                  <li>
                    <Link to="/login" onClick={logoutUser}>LogOut</Link>
                  </li>
                </ul>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="bannerhomepage">
        <Link to="/couple-space">
          <img src={couplebanner} alt="Couplebanner" className="couplebanner" />
        </Link>
      </div>
      <div className="contenthomepage">
        <div className="firstcontainerhomepage">
          <div className="aligningatcenter">
            <Link to="/couple-space">
              <img
                src={couplepic}
                alt="Couple Space"
                className="firstcontainerimage"
                height={350}
                width={300}
              />
              <h2 className="h2ofcontainerhomepage">Enter your Couple Space</h2>
            </Link>
          </div>
        </div>
        <div className="secondcontainerhomepage">
          <div className="alignatcenter">
            <Link to="/couple-space">
              <img src={calender} alt="Calendar" className="grid-item-image" />
              <h2 className="h2ofmiddlecontainerhomepage">Calendar</h2>
            </Link>
          </div>
          <div className="alignatcenter">
            <Link to="/couple-space">
              <img src={gift} alt="Gift" className="grid-item-image" />
              <h2 className="h2ofmiddlecontainerhomepage">Gift</h2>
            </Link>
          </div>
          <div className="alignatcenter">
            <Link to="/couple-space">
              <img src={chat} alt="Chat" className="grid-item-image" />
              <h2 className="h2ofmiddlecontainerhomepage">Chat</h2>
            </Link>
          </div>
          <div className="alignatcenter">
            <Link to="/couple-space">
              <img src={profile} alt="Profile" className="grid-item-image" />
              <h2 className="h2ofmiddlecontainerhomepage">Profile</h2>
            </Link>
          </div>
        </div>

        <div className="thirdcontainerhomepage">
          <div className="aligningatcenter">
            <Link to="/couple-space">
              <img
                src={discover}
                alt="Discover"
                className="firstcontainerimage"
                height={350}
                width={300}
              />
              <h2 className="h2ofcontainerhomepage">Discover</h2>
            </Link>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default Homepage;
