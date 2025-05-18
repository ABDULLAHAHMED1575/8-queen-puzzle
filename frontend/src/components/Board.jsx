import React, { useState, useEffect } from 'react';
import {Cell} from './Cell';
import { useGame } from '../hooks/useGame';
import { useShapes } from '../hooks/useShapes';
import { GameStatus } from './GameStatus';
import { GameControls } from './GameControls';

const Board = () => {
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(0)));
  const [isInitialized, setIsInitialized] = useState(false);
  const { gameState, startNewGame, placeQueen, isLoading,removeQueen,getGameStats } = useGame();
  const [debugLog, setDebugLog] = useState([]);
  const { 
    processShapes, 
    getShapeForCell, 
    getShapeColorClass,
    registerQueenPlacement,
    unregisterQueenPlacement,
    shapeColors,
  } = useShapes();
  const [highlightShape, setHighlightShape] = useState(null);

  const addLog = (message => {
    setDebugLog(prev => [...prev,message]);
    
  })

  const handleNewGame = async () => {
    try {
      const gameData = await startNewGame();
      if (gameData && gameData.shapes) {
        processShapes(gameData.shapes, gameData.position_to_shape);
        setIsInitialized(true);
      }
    } catch (error) {
      toast.error(`Error starting new game: ${error}`);
      console.error("Error starting new game:", error);
    }
  };

  const handleResetGame = async () => {
    try {
      const gameData = await resetGame();
      if (gameData && gameData.shapes) {
        processShapes(gameData.shapes, gameData.position_to_shape);
      }
    } catch (error) {
      toast.error(`Error resetting game: ${error}`);
      console.error("Error resetting game:", error);
    }
  };

  useEffect(() => {
    const initGame = async () => {
      try {
        const gameData = await startNewGame();
        if (gameData && gameData.shapes) {
          addLog("Game Data received, processing shapes")
          processShapes(gameData.shapes, gameData.position_to_shape);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    if (!isInitialized) {
      initGame();
    }
  }, [startNewGame, processShapes, isInitialized]);

const handleCellClick = async (row, col) => {
  const hasQueen = gameState.queen.some(([r, c]) => r === row && c === col);
  
  if (hasQueen) {
    try {
      const result = await removeQueen(row, col);
      if (result && result.success) {
        unregisterQueenPlacement(row, col);
      }
    } catch (error) {
      console.error("Error removing queen:", error);
    }
    return;
  }

  const newBoard = Array(8).fill().map(() => Array(8).fill(0));
  newBoard[row][col] = 1;
  
  try {
    const result = await placeQueen(newBoard);
    
    if (result && result.success) {
      registerQueenPlacement(row, col);
      
      setBoard(Array(8).fill().map(() => Array(8).fill(0)));
    } else {      
      setBoard(Array(8).fill().map(() => Array(8).fill(0)));
    }
  } catch (error) {
    console.error('Error placing queen:', error);
    setBoard(Array(8).fill().map(() => Array(8).fill(0)));
  }
};

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex">
        {row.map((_, colIndex) => {
          const shapeId = getShapeForCell(rowIndex, colIndex);
          
          const colorClass = getShapeColorClass(shapeId);
          
          const isHighlighted = highlightShape === shapeId

          const hasQueen = gameState.queen.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          return (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              hasQueen={hasQueen}
              shapeId={shapeId}
              isHighlighted = {isHighlighted}
              shapeColors={shapeColors}
              colorClass={colorClass}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={isLoading() || gameState.gameOver}
              removable={hasQueen}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center">
      <GameControls
        onNewGame={handleNewGame}
        onResetGame={handleResetGame}
        isLoading={isLoading()}
      />
      
      <div className="flex flex-col items-center">
        <div>
          <div className="border-2 border-gray-800 bg-gray-100 mb-4">
            {renderBoard()}
          </div>
        
          {gameState.error && (
            <div className="text-red-500 font-bold mt-2">{gameState.error}</div>
          )}
        </div>
        
        <div className="w-96 mt-4 md:mt-0 md:pl-4">
          <GameStatus 
            gameState={gameState}
            getGameStats={getGameStats}
          />
        </div>
      </div>
    </div>
  );
};
export default Board;