import React,{useState} from "react";
import { Modal } from "./Modal";

export const GameControls = ({onNewGame,isLoading})=> {
    const [showRules,setShowRules] = useState(false);

    const handleNewGame = () => {
        if(!isLoading){
            onNewGame();
        }
    };

    const handleShowRules = () => {
        setShowRules(true)
    };

    const handleCloseRules = () => {
        setShowRules(false);
    };

    const rulesContent = (
        <div>
            <h2 className="text-xl font-bold mb-3"> 8 Queen Puzzle Rules</h2>
             <p className="mb-2">The goal is to place 8 queens on the chess board such that:</p>
            <ul className="list-disc list-inside mb-3">
                <li>No two queens can attack each other</li>
                <li>Each shape must contain exactly one queen</li>
            </ul>
            <p className="mb-2">Queens can attack in these directions:</p>
            <ul className="list-disc list-inside">
                <li>Horizontally (along a row)</li>
                <li>Vertically (along a column)</li>
                <li>Diagonally (in any diagonal direction)</li>
            </ul>
        </div>
    );
    return (
    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 my-4">
      <button
        onClick={handleNewGame}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        New Game
      </button>

      <button
        onClick={handleShowRules}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Show Rules
      </button>
      {showRules && (
        <Modal title="Game Rules" onClose={handleCloseRules}>
          {rulesContent}
        </Modal>
      )}
    </div>
  );
}