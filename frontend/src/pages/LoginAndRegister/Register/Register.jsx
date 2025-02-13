import React, { useState } from 'react';
import "./Register.css";
import DefaultProfilePicture from "../../../assets/DefaultProfilePicture.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [terms, setTerms] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(DefaultProfilePicture);

    const clearAll = () => {
        setFullName("");
        setUserName("");
        setEmail("");
        setPassword("");
        setImage(null);
        setPreview(DefaultProfilePicture);
        setTerms(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            if (!terms) {
                setError("You need to Agree to Our Terms and Conditions");
                return;
            }
            if (!fullName) {
                setError("Full Name is Required");
                return;
            }
            if (!userName) {
                setError("Username is Required");
                return;
            }
            if (userName && userName.toLowerCase() !== userName) {
                setError("Username should be in Lowercase");
                return;
            }
            if (!email) {
                setError("Email is Required");
                return;
            }
            if (email && email.toLowerCase() !== email) {
                setError("Email should be in Lowercase");
                return;
            }
            if (!password) {
                setError("Password is Required");
                return;
            }

            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('userName', userName);
            formData.append('email', email);
            formData.append('password', password);
            if (image) {
                formData.append('profilePicture', image);
            }

            const response = await axios.post("https://couplespace.onrender.com/api/v1/users/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });             
            console.log(response.data);
            clearAll();
            navigate("/login")
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'An error occurred.');
            } else {
                setError('Unable to register. Please try again later.');
            }
            console.error('Problem With Registering User:', error);
        }
    };

    return (
        <div className='RegisterPage'>
            <div className="RegisterLeftImagePart">
                {/* You can add a background image or any other content here */}
            </div>
            <div className="RegisterRightImagePart">
                <div className="RegisterRightImagePartHeading">
                    <h2>Registration</h2>
                </div>
                <div className="RegisterFromContents">
                    <div className="RegistrationImageUploadContainer">
                        <div className="ProfileImageWrapper">
                            <label htmlFor="user-image" className="ProfileImageLabel">
                                <img
                                    src={preview}
                                    alt="Profile"
                                    className="ProfileImage"
                                />
                                <input
                                    type="file"
                                    id="user-image"
                                    accept="image/*"
                                    className="ProfileImageInput"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <span className="UploadText">Upload Profile Picture</span>
                    </div>
                    <div className="RegistrationFormDetails">
                        <div className="RegistrationFormDataAndInputContainer">
                            <h3>Full Name</h3>
                            <input
                                type="text"
                                placeholder='Enter Your Full Name'
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="RegistrationFormDataAndInputContainer">
                            <h3>Username</h3>
                            <input
                                type="text"
                                placeholder='Enter Your Username'
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="RegistrationFormDataAndInputContainer">
                            <h3>Email</h3>
                            <input
                                type="email"
                                placeholder='Enter Your Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="RegistrationFormDataAndInputContainer">
                            <h3>Password</h3>
                            <input
                                type="password"
                                placeholder='Enter Your Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="RegisterButtonAndTerms">
                        <div className="RegistrationErrorMessage">
                            <h4>{error}</h4>
                        </div>
                        <div className="TermsandConditions">
                            <input
                                type="checkbox"
                                name="Terms"
                                checked={terms}
                                onChange={(e) => setTerms(e.target.checked)}
                            />
                            <label htmlFor="Terms">Agree to our Terms and Conditions</label>
                        </div>
                        <button
                            className="RegisterButton"
                            onClick={registerUser}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
