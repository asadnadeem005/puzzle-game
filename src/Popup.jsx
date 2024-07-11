import React, { useState } from 'react';

const Popup = ({ onClose,scoreBoard }) => {
  const [userName, setUserName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://46.101.151.148:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName }),
      });

      if (response.ok) {
        scoreBoard = await response.json();
        localStorage.setItem('scoreBoard', JSON.stringify(scoreBoard) );
        setScoreBoard(scoreBoard);
        onClose(); 
      } else {
        console.error('Failed to save name');
      }
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  return (
    <div style={popupStyle}>
      <div style={popupContentStyle}>
        <h2>Name</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Enter your name:
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
          <button type="submit" className='bg-blue-600 mx-2 p-2'>Submit</button>
          <button onClick={onClose} className='bg-red-600 my-3 p-2'>Close</button>
        </form>
      </div>
    </div>
  );
};


const popupStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
};


export default Popup;
