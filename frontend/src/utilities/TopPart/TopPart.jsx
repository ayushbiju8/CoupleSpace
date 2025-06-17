import React, { useState, useEffect } from 'react'
import ProfileImage from "../../assets/DefaultProfilePicture.jpg"
import './TopPart.css'
import axios from 'axios'
function TopPart({ onLoaded }) {
    const [partnerOneName, setPartnerOneName] = useState("Ayush")
    const [partnerTwoName, setPartnerTwoName] = useState("Merin")
    const [profileUrl, setProfileUrl] = useState("")
    const getCoupleSpace = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_PRODUCTION_URL}/api/v1/couples/couple-space`, {
                withCredentials: true,
            }
            );
            const data = response.data.data;
            setProfileUrl(data.coverPhoto);
            setPartnerOneName(data.partnerOneName.split(" ")[0]);
            setPartnerTwoName(data.partnerTwoName.split(" ")[0]);
        } catch (error) {
            console.error("Error fetching couple space data:", error);
        } finally {
            onLoaded(); // ✅ Notify parent that loading is done
        }
    };

    useEffect(() => {
        getCoupleSpace();
    }, []);
    return (
        <div className="TopImageContainerForCoupleSpace">

            <div className="TopImageContainerForCoupleSpaceLeftPart">
                <div className="TopImageContainerForCoupleSpaceLeftPartProfileCircle">
                    <img src={profileUrl || ProfileImage} alt="Profile" />
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
    )
}

export default TopPart
