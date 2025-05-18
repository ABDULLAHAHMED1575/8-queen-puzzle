import Board from "./components/Board";

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">8 Queens Puzzle</h1>
        <p className="text-gray-600">
          Place 8 queens on the board so that no queen can attack another queen,
          and each shape must contain exactly one queen.
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <Board />
      </main>

      <footer className="mt-auto pt-6 pb-4 text-center text-gray-500 text-sm">
        <p>8 Queens Puzzle with Shape Constraints</p>
      </footer>
    </div>
  );
}

export default App;