import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";

export const GameStatus = ({gameState,getGameStats}) => {
    const {message,error,loading} = gameState;
    const stats = getGameStats ? getGameStats() : {queenPlaced: 0, queensRemaining: 8, isComplete: false};
    const {queenPlaced, queensRemaining, isComplete} = stats;
    const [showVictoryModal,setShowVictoryModal] = useState(false);
     const [victoryAcknowledged, setVictoryAcknowledged] = useState(false);
    
    useEffect(()=>{      
      if (isComplete && !showVictoryModal && !victoryAcknowledged) {
            setShowVictoryModal(true);
        }
    },[isComplete,showVictoryModal,victoryAcknowledged]);

    const handleCloseVictoryModal = () => {
        setShowVictoryModal(false);
        setVictoryAcknowledged(true)
    }

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between">        
        <div className="status">
          <span className="font-bold">Status: </span>
          <span className={isComplete ? "text-green-600" : "text-blue-600"}>
            {isComplete ? "Completed" : "In Progress"}
          </span>
        </div>
      </div>
      
      <div className="mt-2">
        {loading && (
          <div className="text-gray-600 italic">Loading...</div>
        )}
        
        {message && !error && (
          <div className="text-green-600">{message}</div>
        )}
        
        {error && (
          <div className="text-red-600">{error}</div>
        )}
      </div>
      {showVictoryModal && (
        <Modal 
          title="Congratulations!" 
          onClose={handleCloseVictoryModal}
          isSuccess={true}
        >
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">You solved the 8 Queens Puzzle!</h3>
            <p className="mb-4">
              You successfully placed all 8 queens on the board without any queen attacking another queen,
              and with exactly one queen in each shape.
            </p>
            <p className="font-semibold">
              Total Queens Placed: {queenPlaced}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};