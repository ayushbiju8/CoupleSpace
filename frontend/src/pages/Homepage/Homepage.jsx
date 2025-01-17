import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import couplebanner from '../../assets/homepage/couplebanner.png';
import couplepic from '../../assets/homepage/couplepic.jpg';
import calender from '../../assets/homepage/calender.jpg';
import chat from '../../assets/homepage/e.jpg';
import discover from '../../assets/homepage/discover.jpg';
import defaultProfilePic from '../../assets/homepage/profile.jpg';
import gift from '../../assets/homepage/gift.jpg';
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import socket from '../../utilities/socket';

function Homepage() {

  // DB STARTED
  const token = localStorage.getItem("authToken");
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [response, setResponse] = useState("")
  const [coupleSpaceText, setCoupleSpaceText] = useState("Login to create your Couple Space")


  const getHomepageDetails = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/users/user-homepage", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setResponse(res.data.data)
      console.log(res.data.data);
      setIsLoggedIn(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(false);
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  useEffect(() => {
    getHomepageDetails();
  }, []);

  // useEffect(()=>{
  //   window.location.reload()
  // },[getHomepageDetails])

  // DB ENDED 

  // Contents inside dropdown and others

  const [name, setName] = useState("")
  const [userName, setUserName] = useState("")
  const [profileImage, setProfileImage] = useState("")


  useEffect(() => {
    if (!isLoggedIn) {
      setCoupleSpaceText("Login to create your Couple Space")
    } else {
      if (response?.haveCoupleSpace) {
        // if (response?.hasPendingRequest){
        //   setCoupleSpaceText("Request Pending.")
        // } else {
        //   setCoupleSpaceText("Enter your Couple Space")
        // }
        setCoupleSpaceText("Enter your Couple Space")
      } else {
        setCoupleSpaceText("Create your Couple Space")
      }
      if (response?.fullName) {
        setName(response.fullName)
      }
      if (response?.userName) {
        setUserName(response.userName)
      }
      if (response?.profilePicture) {
        setProfileImage(response.profilePicture)
      }
    }
  }, [isLoggedIn, response])

  // DropDown Started

  const [dropdownNotVisible, setDropdownNotVisible] = useState(true);

  const profileDropDown = (e) => {
    e.preventDefault();
    setDropdownNotVisible((prev) => !prev);
  }


  // Dropdown Ended 

  // Logout user Started
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
      socket.disconnect()
      navigate("/login")
    } catch (error) {
      console.error("Error Occured While Logging Out :" + error)
    }
  }

  // Logout userEnded




  // Couple Space Pop Up

  const viewCoupleSpacePopUp = () => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }
    if (response?.haveCoupleSpace) {
      navigate("/couplespace")
      return
    }
    const popup = document.querySelector('.popUpToCreateCoupleSpace');
    popup.classList.toggle('hiddenCSPopUp');
    setCSError("")
    setCoupleSpaceName("")
    setInvitationEmail("")
  }

  // Couple Space Pop Ended


  // Couple Space Creation

  const [coupleSpaceName, setCoupleSpaceName] = useState("")
  const [inviationEmail, setInvitationEmail] = useState("")
  const [CSError, setCSError] = useState("")


  const createCoupleSpace = async (e) => {
    setCSError("Sending Request...")
    e.preventDefault()
    try {
      if (!coupleSpaceName) {
        setCSError("Couple Space Name is Required")
        return
      }
      if (!inviationEmail) {
        setCSError("Inviataion Email is Required")
        return
      }

      const formData = new FormData();
      formData.append('coupleName',coupleSpaceName)
      formData.append('partnerTwoEmail',inviationEmail)

      const response = await axios.post(
        "http://localhost:8000/api/v1/couples/create-couple-space", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log(response);
      alert("Request Send Successfully")

      viewCoupleSpacePopUp()
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred.');
    } else {
        setError('Unable to Create. Please try again later.');
    }
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
              placeholder="Search.."
            />
            <img src={profileImage ? profileImage : defaultProfilePic} className={`profileImageHomepage ${dropdownNotVisible ? '' : 'borderPink'}`} alt="" onClick={profileDropDown} />
          </form>
        </div>

        {/* Profile Part */}

        {isLoggedIn
          ?
          <div className={`profileDropdown ${dropdownNotVisible ? 'dropDownNotVisible' : ''}`}>
            <div className="nameAndProfile">
              <img src={profileImage ? profileImage : defaultProfilePic} className="nameAndProfileImage" alt="" />
              <div className="nameAndProfileName">
                <h3>{name}</h3>
                <p>{userName}</p>
              </div>
            </div>
            <div className="contentsOfProfileDropdown">Settings</div>
            <div className="contentsOfProfileDropdown">Notifications</div>
            <div className="contentsOfProfileDropdown">Contact Us</div>
            <div className="contentsOfProfileDropdown" onClick={logoutUser}>Logout</div>
          </div>
          :
          <div className={`profileDropdown ${dropdownNotVisible ? 'dropDownNotVisible' : ''}`}>
            <div className="contentsOfProfileDropdown" onClick={() => navigate('/register')}>Sign Up</div>
            <div className="contentsOfProfileDropdown" onClick={() => navigate('/login')}>Login</div>
          </div>
        }


      </div>
      <div className="bannerhomepage">
        <Link to="/couple-space">
          <img src={couplebanner} alt="Couplebanner" className="couplebanner" />
        </Link>
      </div>
      <div className="contenthomepage">
        <div className="firstcontainerhomepage">
          <div className="aligningatcenter">
            {/* <Link> */}
            <img
              src={couplepic}
              alt="Couple Space"
              className="firstcontainerimage"
              onClick={viewCoupleSpacePopUp}
            />
            <h2 className="h2ofcontainerhomepage h2O1stC" onClick={viewCoupleSpacePopUp}>{coupleSpaceText}</h2>
            {/* </Link> */}
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
            <Link to="/chat">
              <img src={chat} alt="Chat" className="grid-item-image" />
              <h2 className="h2ofmiddlecontainerhomepage">Chat</h2>
            </Link>
          </div>
          <div className="alignatcenter">
            <Link to="/couple-space">
              <img src={profileImage ? profileImage : defaultProfilePic} alt="Profile" className="grid-item-image" />
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
                className="thirdcontainerimage"
              />
              <h2 className="h2ofcontainerhomepage">Discover</h2>
            </Link>
          </div>
        </div>
      </div>
      <div className="popUpToCreateCoupleSpace hiddenCSPopUp" >
        <h2>Create Your Couple Space</h2>
        <div className="popUpToCreateCoupleSpaceItem">
          <h3>Name :</h3>
          <input
            type="text"
            placeholder='Enter Couple Space Name'
            value={coupleSpaceName}
            onChange={(e) => { setCoupleSpaceName(e.target.value) }}
          />
        </div>
        <div className="popUpToCreateCoupleSpaceItem">
          <h3>Email :</h3>
          <input
            type="text"
            placeholder='Enter the Recipents email'
            value={inviationEmail}
            onChange={(e) => { setInvitationEmail(e.target.value) }}
          />
        </div>
        <button onClick={createCoupleSpace}>Invite</button>
        <p>Note : Only the last send request is valid.
        </p>
        <h4>{CSError}</h4>
        <div className="popUpToCreateCoupleSpaceClose" onClick={viewCoupleSpacePopUp}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="rgb(75, 75, 75)" fill="none">
          <path
            d="M15.5 8.5L12 12M12 12L8.5 15.5M12 12L15.5 15.5M12 12L8.5 8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
