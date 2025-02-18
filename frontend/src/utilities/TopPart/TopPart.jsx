import React,{useState,useEffect} from 'react'
import ProfileImage from "../../assets/DefaultProfilePicture.jpg"
import './TopPart.css'
import axios from 'axios'
function TopPart() {
    const [partnerOneName, setPartnerOneName] = useState("Ayush")
    const [partnerTwoName, setPartnerTwoName] = useState("Merin")
    const [profileUrl, setProfileUrl] = useState("")
    const [responseFetched, setResponseFetched] = useState("")
    const [loading, setLoading] = useState(true);
    const getCoupleSpace = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "https://couplespace.onrender.com/api/v1/couples/couple-space", {
                withCredentials: true,
            });
            setResponseFetched(response.data.data);
            console.log(response.data.data);
            setProfileUrl(response.data.data.coverPhoto);
            const name1 = response.data.data.partnerOneName.split(" ");
            console.log(name1[0]);
            setPartnerOneName(name1[0]);
            const name2 = response.data.data.partnerTwoName.split(" ");
            console.log(name2[0]);
            console.log("Name " + response.data.data.partnerTwoName);
            setPartnerTwoName(name2[0]);
        } catch (error) {
            console.error("Error fetching couple space data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        getCoupleSpace()
    },[])

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
