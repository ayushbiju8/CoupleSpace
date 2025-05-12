import React, { useState } from 'react';
import "./Login.css";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import socket from '../../../utilities/socket';



function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loginMessage, setLoginMessage] = useState("Login")

    const clearAll = () => {
        setEmail("")
        setPassword("")
    }

    const loginUser = async (e) => {
        e.preventDefault()
        setError("");
        setLoginMessage("Please Wait...")
        try {
            if (!email) {
                setError("Email is Required")
                return
            }
            if (!password) {
                setError("Password is Required")
                return
            }

            // const formData = new FormData()
            // formData.append('email',email)
            // formData.append('password',password)
            const data = {
                email: email,
                password: password
            }

            const response = await axios.post(
                `${import.meta.env.VITE_DEVELOPMENT_URL}/api/v1/users/login`,
                data, {
                withCredentials: true,
            }
            )

            console.log(response.data);
            console.log(response.headers);
            localStorage.setItem("token", response.data.token);
            if (!socket.connected) {
                socket.connect()
            }
            clearAll();
            setLoginMessage("Login")
            navigate("/")
        } catch (error) {
            setLoginMessage("Login")
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'An error occurred.');
            } else {
                setError('Unable to Login. Please try again later.');
            }
        }
    }


    return (
        <div className='LoginPage'>
            <div className="LoginLeftImagePart">
                {/* Add a background image or other content here if needed */}
            </div>
            <div className="LoginRightImagePart">
                <div className="LoginRightImagePartHeading">
                    <h2>Login</h2>
                </div>
                {/* <h2>Login</h2> */}
                <div className="LoginFromContents">
                    <div className="LoginFormDetails">
                        <div className="LoginFormDataAndInputContainer">
                            <h3>Email</h3>
                            <input
                                type="email"
                                placeholder='Enter Your Email'
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </div>
                        <div className="LoginFormDataAndInputContainer">
                            <h3>Password</h3>
                            <input
                                type="password"
                                placeholder='Enter Your Password'
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </div>
                        <div className="LoginForgotPassword" onClick={() => { navigate('/register') }}>
                            <h4>New User ?</h4>
                        </div>
                    </div>
                    <div className="LoginButtonAndTerms">
                        <button className="LoginButton"
                            onClick={loginUser}
                        >
                            {loginMessage}
                        </button>
                        <div className="LoginErrorMessage">
                            {error}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
