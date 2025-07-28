import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders Tic Tac Toe title", () => {
  render(<App />);
  const titleElement = screen.getByTestId("ttt-title");
  expect(titleElement).toBeInTheDocument();
  expect(titleElement).toHaveTextContent(/tic tac toe/i);
});

test("renders 9 squares for game board", () => {
  render(<App />);
  const squares = screen.getAllByRole("button", { name: /cell/i });
  expect(squares).toHaveLength(9);
});

test("allows players to make moves and show winner", () => {
  render(<App />);
  const squares = screen.getAllByRole("button", { name: /cell/i });

  // X moves
  fireEvent.click(squares[0]);
  // O moves
  fireEvent.click(squares[1]);
  // X moves
  fireEvent.click(squares[4]);
  // O moves
  fireEvent.click(squares[2]);
  // X moves - win
  fireEvent.click(squares[8]);
  const winner = screen.getByText(/wins!/i);
  expect(winner).toBeInTheDocument();
});

test("reset button works", () => {
  render(<App />);
  const squares = screen.getAllByRole("button", { name: /cell/i });
  fireEvent.click(squares[0]);
  fireEvent.click(squares[1]);
  fireEvent.click(squares[4]);
  fireEvent.click(squares[2]);
  fireEvent.click(squares[8]);
  const resetButton = screen.getByRole("button", { name: /reset|play again/i });
  fireEvent.click(resetButton);
  const allEmpty = screen.getAllByRole("button", { name: /empty cell/i });
  expect(allEmpty).toHaveLength(9);
});
