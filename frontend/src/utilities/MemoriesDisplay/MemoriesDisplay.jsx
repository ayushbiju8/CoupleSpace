import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MemoriesDisplay.css'; // Import the new CSS file

const MemoriesDisplay = ({ onLoadingChange }) => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true); // Set loading before making the API request
      onLoadingChange(true); // Inform the main page that loading has started
      try {
        const response = await axios.get(`${import.meta.env.VITE_DEVELOPMENT_URL}/api/v1/couples/getmemory`, {
          withCredentials: true
        });
        setMemories(response.data.data);
      } catch (err) {
        setError('Failed to load memories');
      } finally {
        setLoading(false); // Ensure loading is stopped after request completes
        onLoadingChange(false); // Inform the main page that loading has finished
      }
    };

    fetchMemories();
  }, [onLoadingChange]);

  return (
    <div className="memories-container">
      <h1 className="memories-title">Memories</h1>

      {/* Show error message if fetching fails */}
      {error && <div className="error">{error}</div>}

      {/* Show memories grid only when not loading and no error */}
      {!loading && !error && (
        <div className="memories-grid">
          {memories.length > 0 ? (
            memories.map((memory) => (
                <img 
                  src={memory.url} 
                  alt="Couple Memory"
                  className="memory-image"
                  key={memory.id} // Add a key for each image
                />
            ))
          ) : (
            <div className="no-memories">No memories uploaded yet</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemoriesDisplay;