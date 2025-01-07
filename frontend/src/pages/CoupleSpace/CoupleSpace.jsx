import React, { useEffect, useState } from 'react'
import ProfileImage from "../../assets/DefaultProfilePicture.jpg"
import "./CoupleSpace.css"
import memoryRoadmap from "../../assets/CoupleSpace/memoryroadmap.jpeg"
import wishList from "../../assets/CoupleSpace/WishList.jpeg"
import calendar from "../../assets/CoupleSpace/calendar.jpeg"
import achievements from "../../assets/CoupleSpace/achievements.jpeg"
import chat from "../../assets/CoupleSpace/chat.jpeg"
// import chatIcon from "../../assets/CoupleSpace/ChatIcon.png"
import love from "../../assets/CoupleSpace/love.jpg"
import axios from "axios"


function CoupleSpace() {
  const [current, setCurrent] = useState(80);
  const [total, setTotal] = useState(100);
  const [partnerOneName, setPartnerOneName] = useState("Ayush")
  const [partnerTwoName, setPartnerTwoName] = useState("Merin")
  const [profileUrl, setProfileUrl] = useState("")
  const [responseFetched, setResponseFetched] = useState("")
  const [loading, setLoading] = useState(true);

  const getCoupleSpace = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/v1/couples/couple-space", {
        withCredentials: true,
      });
      setResponseFetched(response.data.data);
      setProfileUrl(response.data.data.coverPhoto);
      const name1 = response.data.data.partnerOneName.split(" ");
      setPartnerOneName(name1[0]);
      const name2 = response.data.data.partnerTwoName.split(" ");
      setPartnerTwoName(name2[0]);
    } catch (error) {
      console.error("Error fetching couple space data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const changePhotoOption = () => {
    setIsPopupVisible(!isPopupVisible);
  };


  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("coverPhoto", selectedFile); // Append file with the key `coverPhoto`
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/couples/update-coverphoto",
        formData,
        {
          withCredentials: true, // Include cookies if necessary
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      window.location.reload(); 
      setIsPopupVisible(false); // Close the popup after successful upload
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    getCoupleSpace()
  }, [])

  function VisualSlider({ current, total }) {
    return (
      <div className='SliderCoupleSpace' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          type="range"
          min="0"
          max={total}
          value={current}
          readOnly
          style={{
            width: "90%",
            appearance: "none",
            background: `linear-gradient(to right, red ${(current / total) * 100}%, #ddd ${(current / total) * 100}%)`,
            height: "6px",
            borderRadius: "3px",
            outline: "none",
          }}
        />
        <style>
          {`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 0;
              height: 0;
            }
  
            input[type="range"]::-moz-range-thumb {
              appearance: none;
              width: 0;
              height: 0;
            }
  
            input[type="range"]::-ms-thumb {
              appearance: none;
              width: 0;
              height: 0;
            }
          `}
        </style>
        <div style={{ marginTop: "10px", color: "#333", fontSize: "small" }}>
          {`Love Score : ${current} / ${total}`}
        </div>
      </div>
    );
  }

  return (
    <div className="CoupleSpaceMainPage">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="TopImageContainerForCoupleSpace">
            {isPopupVisible && (
              <div className="popUp">
                <svg
                  className="closeButton"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  color="rgb(75, 75, 75)"
                  fill="none"
                  onClick={closePopup} // Close the popup when clicked
                >
                  <path
                    d="M15.5 8.5L12 12M12 12L8.5 15.5M12 12L15.5 15.5M12 12L8.5 8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="popUpAll">
                  <h3>Upload Your Image</h3>
                  <input type="file" id="uploadImage" onChange={handleFileChange}/>
                  <button className="uploadButton" onClick={handleUpload}>Upload</button>
                </div>
              </div>
            )}
            <div className="TopImageContainerForCoupleSpaceLeftPart">
              <div className="TopImageContainerForCoupleSpaceLeftPartProfileCircle">
                <img src={profileUrl || ProfileImage} alt="Profile" />
                <div className="EditCS" onClick={changePhotoOption}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    color="pink"
                    fill="none"
                  >
                    <path
                      d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="TopImageContainerForCoupleSpaceMiddlePart">
              <div className="TopImageContainerForCoupleSpaceMiddlePartText">
                <div className="TopImageContainerForCoupleSpaceMiddlePartTextTop">
                  <h1>{partnerOneName}</h1>
                  <div className='andInCoupleSpace'>&</div>
                  <h1>{partnerTwoName}</h1>
                </div>
                <div className="TopImageContainerForCoupleSpaceMiddlePartTextBottom">
                  <div className="SpaceInCoupleSpace">
                    Space
                  </div>
                  <div className="TopImageContainerForCoupleSpaceRightPartBox HiddenBox">
                    <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                      <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                      </div>
                      <p>Text</p>
                    </div>
                    <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                      <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                      </div>
                      <p>Text</p>
                    </div>
                    <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                      <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                      </div>
                      <p>Text</p>
                    </div>
                    <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                      <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                      </div>
                      <p>Text</p>
                    </div>
                    <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                      <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                      </div>
                      <p>Text</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="TopImageContainerForCoupleSpaceRightPart">
              <div className="TopImageContainerForCoupleSpaceRightPartBox">
                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                  <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                  </div>
                  <p>Text</p>
                </div>
                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                  <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                  </div>
                  <p>Text</p>
                </div>
                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                  <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                  </div>
                  <p>Text</p>
                </div>
                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                  <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                  </div>
                  <p>Text</p>
                </div>
                <div className="TopImageContainerForCoupleSpaceRightPartBoxContainer">
                  <div className="TopImageContainerForCoupleSpaceRightPartBoxCircle">
                  </div>
                  <p>Text</p>
                </div>
              </div>
            </div>
          </div>
          <div className="majorPartCoupleSpace">
            <div id="memoryRoadmap">
              <img src={memoryRoadmap} className='memoryRoadmapImage' alt="" />
              <div className="memoryRoadmapTextPlace">
                Memory Roadmap
              </div>
            </div>
            <div id="cupidStreak">
              <div className='cupidStreakLove'>
                <img src={love} alt="" />
              </div>
              <div className="loveScore">
                <h3>Cupid Score</h3>
                <VisualSlider current={current} total={total} />
              </div>
            </div>
            <div id="wishList">
              <div className="boxForAllInCoupleSpace">
                <div className="boxForAllInCoupleSpaceImage">
                  <img src={wishList} alt="" />
                </div>
                <div className="boxForAllInCoupleSpaceText">
                  WishList
                </div>
              </div>
            </div>
            <div id="calendar">
              <div className="boxForAllInCoupleSpace">
                <div className="boxForAllInCoupleSpaceImage">
                  <img src={calendar} alt="" />
                </div>
                <div className="boxForAllInCoupleSpaceText">
                  Calendar
                </div>
              </div>
            </div>
            <div id="achievements">

              <div className="boxForAllInCoupleSpace">
                <div className="boxForAllInCoupleSpaceImage">
                  <img src={achievements} alt="" />
                </div>
                <div className="boxForAllInCoupleSpaceText">
                  Achievements
                </div>
              </div>
            </div>
            <div id="chat">
              <div className="chatSectionOnCoupleSpace">
                <img src={chat} alt="" />
                <div className="chatIconInSection">
                  Chat
                  {/* <img src={chatIcon} alt="" /> */}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="imagePartInCoupleSpace">
        <h1>Memories</h1>
        <div className="memoryBoxInCoupleSpace"> 
        </div>
      </div> */}
        </>
      )}
    </div>
  )
}

export default CoupleSpace
