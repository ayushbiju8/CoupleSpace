import React, { useState } from 'react';
import "./Login.css";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import socket from '../../../utilities/socket';
import Logo from '../../../assets/Logo/Logo.png'


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
                `${import.meta.env.VITE_PRODUCTION_URL}/api/v1/users/login`,
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
            setLoginMessage("Login");

            if (error.response) {
                const status = error.response.status;
                const serverMessage = error.response.data?.message;

                if (status === 404) {
                    setError(serverMessage || "User not found.");
                } else if (status === 401) {
                    setError(serverMessage || "Invalid password.");
                } else if (status === 400) {
                    setError(serverMessage || "Invalid request.");
                } else {
                    setError(serverMessage || "Something went wrong. Please try again.");
                }
            } else {
                setError('Unable to connect to the server. Please try again later.');
            }
        }

    }


    return (
        <div className='LoginPage'>
            <div className="LoginLeftImagePart">
                <div className="w-full h-full flex justify-center items-center">
                    <img src={Logo} alt="" className='-rotate-10'/>

                </div>
            </div>
            <div className="LoginRightImagePart relative">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 md:hidden">
                    <img src={Logo} alt="" className='w-50'/>
                </div>
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
