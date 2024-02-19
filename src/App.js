import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [buttonState, setButtonState] = useState(Array(25).fill({ number: null, highlighted: false, bingo: false }));
  const [bingoState, setBingo] = useState(false);
  const [numbersArray, setNumberState] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]);
  const [timestamp, setTimestamp] = useState();

  const shuffleNumbers = () => {
    const shuffledArray = [...numbersArray];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    setNumberState(shuffledArray);
  };

  // Function to handle button click
  const handleButtonClick = (index) => {
    setButtonState((prevButtonState) => {
      const newButtonState = [...prevButtonState];
      newButtonState[index] = { ...prevButtonState[index], highlighted: !prevButtonState[index].highlighted, bingo: false };
      return newButtonState;
    });
  };

  // Function to handle reroll button click
  const handleRerollClick = () => {
    shuffleNumbers();
    setButtonState((prevButtonState) => {
      const newButtonState = prevButtonState.map((button, index) => ({
        number: numbersArray[index],
        highlighted: false,
        bingo: false
      }));
      return newButtonState;
    });    
    setBingo(false);    
    const options = { timeZone: 'Asia/Tokyo', timeZoneName: 'short' };
    setTimestamp(new Date().toLocaleString('en-US', options)); // Update the timestamp to JST
  };

  useEffect(() => {
    // Initialize random numbers when the component mounts
    setButtonState((prevButtonState) =>
      prevButtonState.map((button, index) => ({ ...button, number: numbersArray[index] }))
    );

    const options = { timeZone: 'Asia/Tokyo', timeZoneName: 'short' };
    setTimestamp(new Date().toLocaleString('en-US', options)); // Set the initial timestamp to JST
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    // Check for Bingo when buttonState changes
    checkForBingo();
  }, [buttonState]);

  // Function to check for Bingo
  const checkForBingo = () => {
    // Check rows, columns, and diagonals for five highlighted buttons
    const isBingo = checkRows() || checkColumns() || checkDiagonals();
    if (isBingo) {
      setBingo(true);
    } else {
      setBingo(false);
    }
  };

  // Function to check rows for Bingo
  const checkRows = () => {
    for (let i = 0; i < 5; i++) {
      const row = buttonState.slice(i * 5, i * 5 + 5);
      if (row.every((button) => button.highlighted)) {
        highlightBingoButtons(i * 5, i * 5 + 1, i * 5 + 2, i * 5 + 3, i * 5 + 4);
        return true;
      }
    }
    return false;
  };

  // Function to check columns for Bingo
  const checkColumns = () => {
    for (let i = 0; i < 5; i++) {
      const column = buttonState.filter((_, index) => index % 5 === i);
      if (column.every((button) => button.highlighted)) {
        highlightBingoButtons(i, i + 5, i + 10, i+ 15, i + 20);
        return true;
      }
    }
    return false;
  };

  // Function to check diagonals for Bingo
  const checkDiagonals = () => {
    const leftToRightDiagonal = buttonState.filter((_, index) => index % 6 === 0);
    const rightToLeftDiagonal = buttonState.filter((_, index) => index % 4 === 0 && index !== 0 && index !== 24);

    if (leftToRightDiagonal.every((button) => button.highlighted)) {
      highlightBingoButtons(0, 6, 12, 18, 24);
      return true;
    }

    if (rightToLeftDiagonal.every((button) => button.highlighted)) {
      highlightBingoButtons(4, 8, 12, 16, 20);
      return true;
    }

    return false;
  };

  // Function to highlight Bingo buttons
  const highlightBingoButtons = (...indices) => {
    setButtonState((prevButtonState) =>
      prevButtonState.map((button, index) => ({
        ...button,
        bingo: indices.includes(index),
      }))
    );
  };

  return (
    <div className="App">
      <h1>{bingoState ? 'Bingo!' : '/r/LL Love Live! Unit Koshien Bingo'}</h1>
      <div className="grid-container">
        {buttonState.map(({ number, highlighted, bingo }, index) => (
          <button
            key={index}
            className={`grid-button ${highlighted ? bingo ? 'bingo' : 'highlighted' : ''}`}
            onClick={() => handleButtonClick(index)}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="timestamp-box">
        <p>Timestamp: {timestamp}</p>
      </div>
      <button className="reroll-button" onClick={handleRerollClick}>
        Reroll
      </button>
    </div>
  );
};

export default App;
