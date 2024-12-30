import React, { useState } from 'react';
import "./ForgotPassword.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");

    const clearAll = () => {
        setOldPassword("");
        setNewPassword("");
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (!oldPassword) {
                setError("Old Password is Required");
                return;
            }
            if (!newPassword) {
                setError("New Password is Required");
                return;
            }
            
            const data = {
                oldPassword: oldPassword,
                newPassword: newPassword
            };

            const response = await axios.post(
                "http://localhost:8000/api/v1/users/reset-password",
                data, {
                    withCredentials: true,
                }
            );
            console.log(response.data);
            clearAll();
            navigate("/");
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'An error occurred.');
            } else {
                setError('Unable to Reset Password. Please try again later.');
            }
        }
    };

    return (
        <div className='ForgotPasswordPage'>
            <div className="ForgotPasswordLeftImagePart">
                {/* Add a background image or other content here if needed */}
            </div>
            <div className="ForgotPasswordRightImagePart">
                <div className="ForgotPasswordRightImagePartHeading">
                    <h2>Change Password</h2>
                </div>
                <div className="ForgotPasswordFromContents">
                    <div className="ForgotPasswordFormDetails">
                        <div className="ForgotPasswordFormDataAndInputContainer">
                            <h3>Old Password</h3>
                            <input
                                type="password"
                                placeholder='Enter Your Old Password'
                                value={oldPassword}
                                onChange={(e) => { setOldPassword(e.target.value); }}
                            />
                        </div>
                        <div className="ForgotPasswordFormDataAndInputContainer">
                            <h3>New Password</h3>
                            <input
                                type="password"
                                placeholder='Enter Your New Password'
                                value={newPassword}
                                onChange={(e) => { setNewPassword(e.target.value); }}
                            />
                        </div>
                    </div>
                    <div className="ForgotPasswordButtonAndTerms">
                        <button className="ForgotPasswordButton"
                        onClick={resetPassword}
                        >
                            Reset Password
                        </button>
                        <div className="ForgotPasswordErrorMessage">
                            {error}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
