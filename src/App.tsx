import React, { useState } from "react";

const SIZE = 9;
type Board = number[][];

const initialBoard: Board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

// Function to deep clone a board
const cloneBoard = (board: Board): Board => board.map((row) => [...row]);

// Solves board in-place (basic backtracking)
function solve(board: Board): boolean {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

export default function App() {
  const [board, setBoard] = useState<Board>(cloneBoard(initialBoard));
  const [revealed, setRevealed] = useState(false);

  const solutionBoard = React.useMemo(() => {
    const solved = cloneBoard(initialBoard);
    solve(solved);
    return solved;
  }, []);

  const isGiven = (row: number, col: number) => initialBoard[row][col] !== 0;

  const isInvalid = (row: number, col: number) => {
    const val = board[row][col];
    if (val === 0) return false;
    const tempBoard = cloneBoard(board);
    tempBoard[row][col] = 0;
    return !isValid(tempBoard, row, col, val);
  };

  const handleChange = (row: number, col: number, val: string) => {
    if (revealed || isGiven(row, col)) return;
    if (val === "") {
      updateBoard(row, col, 0);
      return;
    }
    const num = Number(val);
    if (num >= 1 && num <= 9) {
      updateBoard(row, col, num);
    }
  };

  const updateBoard = (row: number, col: number, val: number) => {
    setBoard((prev) => {
      const newBoard = cloneBoard(prev);
      newBoard[row][col] = val;
      return newBoard;
    });
  };

  const toggleReveal = () => {
    setRevealed((prev) => !prev);
    if (!revealed) {
      setBoard(cloneBoard(solutionBoard));
    } else {
      setBoard(cloneBoard(initialBoard));
    }
  };

  const getBorderStyles = (row: number, col: number) => ({
    borderTop: row % 3 === 0 ? "3px solid black" : "1px solid #999",
    borderLeft: col % 3 === 0 ? "3px solid black" : "1px solid #999",
    borderRight: col === SIZE - 1 ? "3px solid black" : "1px solid #999",
    borderBottom: row === SIZE - 1 ? "3px solid black" : "1px solid #999",
  });

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h1>Sudoku Game</h1>
      <button onClick={toggleReveal} style={{ marginBottom: 10 }}>
        {revealed ? "Hide Solution" : "Reveal Solution"}
      </button>
      <table
        style={{
          borderCollapse: "collapse",
          margin: "auto",
          userSelect: "none",
        }}
      >
        <tbody>
          {board.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => {
                const given = isGiven(r, c);
                const invalid = isInvalid(r, c);
                const borderStyles = getBorderStyles(r, c);

                const cellStyle: React.CSSProperties = {
                  width: 45,
                  height: 45,
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: given ? "bold" : "normal",
                  backgroundColor: given
                    ? "#ddd"
                    : revealed
                    ? "#e0ffe0"
                    : invalid
                    ? "#fdd"
                    : "white",
                  color: given ? "black" : "blue",
                  padding: 0,
                  ...borderStyles,
                };

                return (
                  <td key={c} style={cellStyle}>
                    {given || revealed ? (
                      cell
                    ) : (
                      <input
                        type="text"
                        maxLength={1}
                        value={cell === 0 ? "" : cell}
                        onChange={(e) => handleChange(r, c, e.target.value)}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          textAlign: "center",
                          fontSize: 22,
                          outline: "none",
                          backgroundColor: invalid ? "#fdd" : "white",
                          color: "blue",
                          fontWeight: "normal",
                          padding: 0,
                          margin: 0,
                        }}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
