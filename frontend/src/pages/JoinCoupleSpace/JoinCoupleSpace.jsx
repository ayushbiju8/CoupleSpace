import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const JoinCoupleSpace = () => {
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const extractedToken = queryParams.get('token');

        if (!extractedToken) {
            setError('🚫 Invitation token is missing.');
        } else {
            setToken(extractedToken);
        }
    }, [location.search]);

    const AcceptInvitation = async () => {
        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_PRODUCTION_URL}/api/v1/couples/accept-invite`,
                { token },
                { withCredentials: true }
            );
            navigate('/login');
        } catch (err) {
            setError('❌ Failed to accept the invitation. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const RejectInvitation = () => {
        navigate('/'); // Redirect to homepage or a decline info page
    };

    return (
        <>
            {/* Isolated Tailwind CSS */}
            <style>{`
        .couple-invite-isolated {
          /* Reset all inherited styles */
          all: initial;
          
          /* Essential base styles */
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          
          /* Full viewport */
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          
          /* Layout */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overflow: hidden;
          
          /* Background gradient */
          background: linear-gradient(135deg, #0f172a 0%, #581c87 35%, #0f172a 100%);
        }
        
        .couple-invite-isolated *,
        .couple-invite-isolated *::before,
        .couple-invite-isolated *::after {
          box-sizing: border-box;
          font-family: inherit;
        }
        
        .bg-orb-1 {
          position: absolute;
          top: 25%;
          left: 25%;
          width: 24rem;
          height: 24rem;
          background: #a855f7;
          border-radius: 50%;
          filter: blur(3rem);
          opacity: 0.2;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .bg-orb-2 {
          position: absolute;
          bottom: 25%;
          right: 25%;
          width: 24rem;
          height: 24rem;
          background: #ec4899;
          border-radius: 50%;
          filter: blur(3rem);
          opacity: 0.2;
          animation: pulse 2s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .main-card {
          position: relative;
          z-index: 10;
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 1rem;
          padding: 2rem;
          width: 100%;
          max-width: 28rem;
          box-shadow: 0 25px 50px -12px rgba(168, 85, 247, 0.1);
        }
        
        .header-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border-radius: 50%;
          margin-bottom: 1rem;
          box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.3);
        }
        
        .space-card {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(51, 65, 85, 0.3);
        }
        
        .space-icon {
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
        }
        
        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: #22c55e;
          border-radius: 50%;
          margin-right: 0.5rem;
        }
        
        .error-card {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 0.5rem;
          padding: 0.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #7c3aed, #db2777);
          box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.4);
        }
        
        .btn-primary:disabled {
          background: linear-gradient(135deg, #6b21a8, #be185d);
          cursor: not-allowed;
        }
        
        .btn-secondary {
          width: 100%;
          background: rgba(51, 65, 85, 0.5);
          color: #cbd5e1;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(71, 85, 105, 0.5);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-secondary:hover {
          background: #334155;
          color: white;
          border-color: #475569;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
          border-radius: 50%;
          width: 1rem;
          height: 1rem;
          border: 2px solid white;
          border-top-color: transparent;
        }
        
        .text-white { color: white; }
        .text-slate-300 { color: #cbd5e1; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-500 { color: #64748b; }
        .text-red-400 { color: #f87171; }
        
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        
        .text-center { text-align: center; }
        
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-6 { margin-top: 1.5rem; }
        .pt-4 { padding-top: 1rem; }
        
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        
        .border-t { border-top: 1px solid rgba(51, 65, 85, 0.3); }
      `}</style>

            <div className="couple-invite-isolated">
                {/* Animated background elements */}
                <div className="bg-orb-1"></div>
                <div className="bg-orb-2"></div>

                {/* Main card */}
                <div className="main-card">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="header-icon">
                            <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">You're invited!</h1>
                        <p className="text-slate-300 text-sm">Join your partner's Couple Space</p>
                    </div>

                    {/* Invitation details */}
                    <div className="space-card">
                        <div className="flex items-center mb-3">
                            <div className="space-icon">
                                <span style={{ fontSize: '1.125rem' }}>💕</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Couple Space</h3>
                                <p className="text-slate-400 text-sm">Private memories together</p>
                            </div>
                        </div>

                        <div className="flex items-center text-slate-400 text-xs">
                            <div className="status-dot"></div>
                            <span>Invitation active</span>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="error-card">
                            <svg width="16" height="16" className="text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                            <span className="text-red-400 text-sm">{error}</span>
                        </div>
                    )}

                    {/* Action buttons */}
                    {!error && (
                        <div>
                            <button
                                onClick={AcceptInvitation}
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
                                        <span>Joining...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Accept Invitation</span>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={RejectInvitation}
                                className="btn-secondary"
                            >
                                No thanks
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t">
                        <p className="text-slate-500 text-xs text-center">
                            This invitation will expire in 7 days
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JoinCoupleSpace;


// import React from 'react'

// function JoinCoupleSpace() {
//   return (
//     <div className='isolate [all:unset]'>
//       Hi
//     </div>
//   )
// }

// export default JoinCoupleSpace
