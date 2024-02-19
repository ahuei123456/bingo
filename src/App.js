import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [buttonState, setButtonState] = useState(Array(25).fill({ number: null, highlighted: false, bingo: false }));
  const [bingo, setBingo] = useState(false);
  const [generatedNumbers, setGeneratedNumbers] = useState(new Set());

  // Function to generate a random number between 1 and 100 (avoiding duplicates)
  const generateRandomNumber = () => {
    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * 100) + 1;
    } while (generatedNumbers.has(newNumber));

    setGeneratedNumbers((prevGeneratedNumbers) => new Set(prevGeneratedNumbers.add(newNumber)));
    return newNumber;
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
    setGeneratedNumbers(() => new Set());
    setButtonState((prevButtonState) => {
      const newButtonState = prevButtonState.map(button => ({
        number: generateRandomNumber(),
        highlighted: false,
        bingo: false
      }));
      return newButtonState;
    });    
    setBingo(false);
  };

  useEffect(() => {
    // Initialize random numbers when the component mounts
    setButtonState((prevButtonState) =>
      prevButtonState.map((button) => ({ ...button, number: generateRandomNumber() }))
    );
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
    const rightToLeftDiagonal = buttonState.filter((_, index) => index % 4 === 0 && index !== 20);

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
      <h1>{bingo ? 'Bingo!' : '/r/LL Love Live! Unit Koshien Bingo'}</h1>
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
      <button className="reroll-button" onClick={handleRerollClick}>
        Reroll
      </button>
    </div>
  );
};

export default App;
