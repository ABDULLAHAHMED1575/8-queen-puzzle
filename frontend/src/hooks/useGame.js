import { useState,useCallback,useEffect } from "react";
import { gameApi } from "../services/api";
import { toast } from "react-toastify";

export function useGame(){
    const [gameState,setGameState] = useState({
        queen:[],
        shapeWithQueens:[],
        gameOver:false,
        message:'',
        loading:false,
        error:null
    });

    const startNewGame = useCallback(async () => {
        try{
            setGameState(prev => ({
                ...prev,
                loading:true,
                error:null,
                message:'loading game...'
            }));

            const data = await gameApi.getNewGame();
            
            setGameState({
                queen:[],
                shapeWithQueens:[],
                gameOver: false,
                message:'Place queens on the board. No queen can attack another queen, and each shape must have exactly one queen.',
                loading:false,
                error:null
            });

            return data;
        }
        catch(error){
            setGameState(prev => ({
                ...prev,
                loading:false,
                error:'Failed to start new game. Please try again.',
                message:''
            }));
            console.error('Error starting new game');
            throw error;
        }
    },[]);

    const placeQueen = useCallback(async (board) => {
        try{
            setGameState(prev => ({
                ...prev,
                loading:true,
                error:null,
                message:'Placing Queen...',
            }));

            const response = await gameApi.placeQueen(board);
            const { success, message, done} = response;
            if(success){
                let newQueenpos = null;
                for (let r=0;r<8;r++){
                    for (let c=0;c<8;c++){
                        if(board[r][c] === 1){
                            newQueenpos = [r,c];
                            break;
                        }
                    }
                    if(newQueenpos) break;
                }
            

                setGameState(prev => ({
                    ...prev,
                    queen:[...prev.queen,newQueenpos],
                    gameOver:done,
                    message: message || (done ? "All queens placed correctly" : 'Queen placed successfully'),
                    loading:false,
                    error:null
                }));
                return {success:true,position: newQueenpos};
            }else{
                setGameState(prev => ({
                    ...prev,
                    message:'',
                    loading:false,
                    error:message || 'Invalid queen placement..'
                }));
                return{success:false,error:message}
            }
        }
        catch(error){
            setGameState(prev => ({
                ...prev,
                loading: false,
                error:'Error placing queen. Please try again.',
                message:''
            }));
            console.error('Error placing queen',error);
            throw error;
        }
    },[]);

    const removeQueen = useCallback(async (row,col) => {
        try{
            setGameState(
                prev => ({
                    ...prev,
                    loading:true,
                    error:null,
                    message:'Removing Queen...',
                })
            );
            const response = await gameApi.removeQueen(row,col);
            const {success,message} = response
            if(success){
                setGameState(prev => {
                    const newQueen = prev.queen.filter(([r,c])=> !(r===row && c===col));
                    return{
                        ...prev,
                        queen:newQueen,
                        gameOver:false,
                        message:"Queen removed successfully!",
                        loading:false,
                        error:null,
                    };
                });
                return{success:true}
            }
            else{
                setGameState(prev => ({
                    ...prev,
                    loading:false,
                    error:message,
                    message:''
                }))
            }
        }
        catch(error){
            setGameState(prev => ({
                ...prev,
                loading:false,
                error:'Error removing queen. Please try again.',
                message:''
            }))
            toast.error(`Error removing queen: ${error.message}`);
            throw error;
        }
    },[]);

    const resetGame = useCallback(async () => {
        try{
            return await startNewGame();
        }catch(error){
            console.error('Error resetting game',error)
            throw error
        }
    }, [startNewGame]);

    const hasQueen = useCallback((row,col) => {
        return gameState.queen.some(([r,c]) => r === row && c === col);
    }, [gameState.queen]);

    const isLoading = useCallback(() => {
        return gameState.loading;
    }, [gameState.loading])

    const getGameStats = useCallback (() => {
        const queenCount = gameState.queen.length;
        return{
            queenPlaced:gameState.queen.length,
            queensRemaining: 8-gameState.queen.length,
            isComplete: gameState.gameOver || queenCount === 8
        };
    }, [gameState.queen,gameState.gameOver]);

    return{
        gameState,
        startNewGame,
        placeQueen,
        resetGame,
        hasQueen,
        isLoading,
        getGameStats,
        removeQueen
    }
}