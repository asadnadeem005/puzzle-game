import React, { useState, useEffect } from 'react';
import './App.css';
import Popup from './Popup';

const generateBoard = async() => {
    const response = await fetch('http://46.101.151.148:3000');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const numbers = await response.json();

    return numbers.data
 
};

const isSolvable = (board) => {
  let inversions = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      if (board[i] > board[j] && board[i] !== 0 && board[j] !== 0) {
        inversions++;
      }
    }
  }
  const blankRow = Math.floor(board.indexOf(0) / 4);
  return (blankRow % 2 === 0) === (inversions % 2 === 0);
};

const isSolved = async(board) => {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false;
  }

  // const response = await fetch('http://localhost:3000/update', {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ name: 'john' }),
  // });

  return true;
};

const App = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [scoreBoard,setScoreBoard] = useState([]);
  const [timer, setTimer] = useState(900); // 15 minutes in seconds

  const handleClosePopup = () => {
      setShowPopup(false);
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      setGameLost(true);
      clearInterval(timerInterval);
    }

    return () => clearInterval(timerInterval);
  }, [timer]);

  const [board, setBoard] = useState([]);

  useEffect(() => {
    const fetchBoard = async () => {
      let newBoard;
      do {
        newBoard = await generateBoard();
      } while (!isSolvable(newBoard));
      setBoard(newBoard);
    };

    let scoreBoardVal = localStorage.getItem('scoreBoard');
    scoreBoardVal = JSON.parse(scoreBoardVal)
    setScoreBoard(scoreBoardVal)
    fetchBoard();
  }, []);

  const handleTileClick = (index) => {
    const blanked = board.indexOf(0);
    const validMovesArray = [
      blanked - 1,
      blanked + 1,
      blanked - 4,
      blanked + 4,
    ];
    if (validMovesArray.includes(index)) {
      const newBoard = [...board];
      [newBoard[blanked], newBoard[index]] = [newBoard[index], newBoard[blanked]];
      setBoard(newBoard);
    }
  };
  
  return (
     <div className="App">
          {/* score table */}
          <div className="scoreboard absolute">
        <h2>Scoreboard</h2>
        <table className='bg-yellow-300 p-4 table-auto hover:table-fixed'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            
            {scoreBoard && scoreBoard.map((score, index) => (
              <tr key={index}>
                <td>{score.name ?? 'admin'}</td>
                <td>{score.score ?? 0}</td>
                <td>{new Date(score.date).toLocaleDateString() ?? new Date(now())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {showPopup && <Popup onClose={handleClosePopup} setScoreBoard={setScoreBoard}/>}
          <h1>Puzzle Game</h1>
          <div className="board">
            {board.map((ti, ind) => (
              <div
                key={ind}
                className={`tile ${ti === 0 ? 'blank' : ''}`}
                onClick={() => handleTileClick(ind)}
              >
                {ti !== 0 && ti}
              </div>
            ))}
          </div>
          {isSolved(board) && <p>Congratulations! You solved the puzzle!</p>}
   
    <p>Time remaining: <span className='text-red-600'>{Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</span></p>

    </div>

  );
  

};

export default App;
