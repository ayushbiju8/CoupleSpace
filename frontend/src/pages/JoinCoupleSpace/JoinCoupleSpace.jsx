import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


const JoinCoupleSpace = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Extract the token from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (!token) {
        setError("Token is not Present")
    }

    const AcceptInvitation = async () => {
        try {
            const response = await axios.post(
                `${VITE_PRODUCTION_URL}/api/v1/couples/accept-invite`,
                { token },
                { withCredentials: true, }
            )

            navigate("/login")
        } catch (error) {
            console.error("Error Occured "+error+error.message);
        }
    }

    return (
        <div>
            <h1>Accept Invitation</h1>
            {error ? (
                <p>{error}</p>
            ) : (
                <button onClick={AcceptInvitation}>Accept Invitation</button>
            )}
        </div>
    );
};

export default JoinCoupleSpace;
