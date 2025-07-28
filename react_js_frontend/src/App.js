import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * App - Main component for Tic Tac Toe game.
 *
 * Features:
 * - Interactive 3x3 board
 * - Real-time win/tie detection
 * - Session-local score tracking
 * - Reset/restart button
 * - Responsive, modern light theme UI
 * 
 * Colors (theme): 
 *   --accent:   #ff9800
 *   --primary:  #1976d2
 *   --secondary: #424242
 */
function App() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [draws, setDraws] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Calculate winner or draw after each turn
  useEffect(() => {
    const winnerSymbol = calculateWinner(board);
    if (winnerSymbol) {
      setWinner(winnerSymbol);
      setGameOver(true);
      setScores((prev) => ({
        ...prev,
        [winnerSymbol]: prev[winnerSymbol] + 1,
      }));
    } else if (board.every((cell) => cell)) {
      setWinner(null);
      setGameOver(true);
      setDraws((d) => d + 1);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  // Handles square click/interact
  const handleClick = (idx) => {
    if (board[idx] || gameOver) return;
    setBoard((prevBoard) => {
      const newBoard = prevBoard.slice();
      newBoard[idx] = xIsNext ? "X" : "O";
      return newBoard;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  // Resets the game board for a new round
  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext((last) => (gameOver && winner ? winner === "X" : last));
    setGameOver(false);
    setWinner(null);
  };

  // For accessibility: keyboard navigation
  const handleKeyDown = (evt, idx) => {
    if ((evt.key === " " || evt.key === "Enter") && !board[idx] && !gameOver) {
      handleClick(idx);
    }
  };

  // Styling: Colors (override CSS vars)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", "#ff9800");
    root.style.setProperty("--primary", "#1976d2");
    root.style.setProperty("--secondary", "#424242");
    root.style.setProperty("--btn-bg", "var(--accent)");
    root.style.setProperty("--btn-hover", "#ffa733");
    root.style.setProperty("--board-bg", "#f4f6fb");
    root.style.setProperty("--square-active", "#ffe9c9");
    root.style.setProperty("--square-shadow", "#e0e0e0");
    root.style.setProperty("--score-bg", "#e3edf9");
  }, []);

  // Render a single square (cell)
  // PUBLIC_INTERFACE
  function Square({ value, onClick, onKeyDown, tabIndex, highlight }) {
    return (
      <button
        className={`ttt-square${highlight ? " highlight" : ""}`}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        aria-label={value ? `Cell filled with ${value}` : "Empty cell"}
        disabled={!!value || gameOver}
        type="button"
      >
        {value}
      </button>
    );
  }

  // Highlight winning cells
  const winLine = getWinningLine(board);

  // UI content for Winner/Draw info
  let status;
  if (winner) {
    status = (
      <span className="ttt-status-winner">
        <span className="ttt-status-symbol">{winner}</span> wins!
      </span>
    );
  } else if (gameOver) {
    status = (
      <span className="ttt-status-draw">It's a draw!</span>
    );
  } else {
    status = (
      <span className="ttt-status-next" style={{ color: "var(--accent)" }}>
        Next: <span className="ttt-status-symbol">{xIsNext ? "X" : "O"}</span>
      </span>
    );
  }

  // PUBLIC_INTERFACE
  return (
    <div className="ttt-root">
      <div className="ttt-container">
        <h1 className="ttt-title" data-testid="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-scoreboard" role="region" aria-label="Scoreboard">
          <div style={{ color: "#1976d2" }}>
            <span className="ttt-score-label">X</span>
            <span className="ttt-score">{scores.X}</span>
          </div>
          <div style={{ color: "#424242" }}>
            <span className="ttt-score-label">O</span>
            <span className="ttt-score">{scores.O}</span>
          </div>
          <div style={{ color: "#ff9800" }}>
            <span className="ttt-score-label">Draws</span>
            <span className="ttt-score">{draws}</span>
          </div>
        </div>

        <div className="ttt-status" role="status" tabIndex={0}>
          {status}
        </div>

        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
          {[0, 1, 2].map((row) => (
            <div className="ttt-board-row" key={row} role="row">
              {[0, 1, 2].map((col) => {
                const idx = row * 3 + col;
                return (
                  <Square
                    key={idx}
                    value={board[idx]}
                    onClick={() => handleClick(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    tabIndex={0}
                    highlight={winLine && winLine.includes(idx)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <button
          className="ttt-reset"
          onClick={handleReset}
          aria-label="Reset game"
          type="button"
        >
          {gameOver ? "Play Again" : "Reset"}
        </button>
      </div>
      <footer className="ttt-footer">
        <span>
          &copy; {new Date().getFullYear()} React Tic Tac Toe &mdash; Modern UI
        </span>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Returns winner symbol ("X" or "O") if there is a winner, or null otherwise.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Returns the winning line as an array of indices ([a, b, c]), or null if none.
 */
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return lines[i];
    }
  }
  return null;
}

export default App;
