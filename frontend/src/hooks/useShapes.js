import { useState,useCallback,useMemo } from "react";
import { ToastContainer, toast } from 'react-toastify';

export function useShapes() {
    const [shapes,setShapes] = useState([]);
    const [cellToShapeMap,setCellToShapeMap] = useState({});
    const [shapesWithQueens,setShapesWithQueens] = useState([]);

    const shapeColors = useMemo(() => [
        'bg-red-400/50',
        'bg-blue-400/50',
        'bg-green-400/50',
        'bg-yellow-400/50',
        'bg-purple-400/50',
        'bg-pink-400/50',
        'bg-indigo-400/50',
        'bg-orange-400/50'
    ], []);

    const processShapes = useCallback((shapesData, positionToShape) => {
        if (!shapesData || !Array.isArray(shapesData)) {
            console.error('Invalid shapes data:', shapesData);
            toast?.('Invalid shapes data received from server');
            return;
        }

        setShapes(shapesData);
        
        if (positionToShape && typeof positionToShape === 'object') {
            setCellToShapeMap(positionToShape);
        } else {
            const cellMap = {};
            
            shapesData.forEach((shape, shapeIndex) => {
            if (Array.isArray(shape)) {
                shape.forEach(([row, col]) => {
                if (row !== undefined && col !== undefined) {
                    const key = `${row},${col}`;
                    cellMap[key] = shapeIndex;
                }
                });
            }
            });
            
            setCellToShapeMap(cellMap);
        }
        
        setShapesWithQueens([]);
        
        return true;
}, [toast]);

    const getShapeForCell = useCallback((row,col)=>{
        return cellToShapeMap[`${row},${col}`];
    },[cellToShapeMap]);

    const unregisterQueenPlacement = useCallback((row,col)=>{
        const shapeIndex = getShapeForCell(row,col);
        if(shapeIndex !== undefined){
            setShapesWithQueens(prev => prev.filter(id => id !==shapeIndex));
            return true;
        }
        return false;
    },[getShapeForCell]);
    
    const getShapeColorClass = useCallback((shapeIndex)=> {
        if(shapeIndex === undefined || shapeIndex<0 || shapeIndex >=shapeColors.length){
            return "";
        }
        return shapeColors[shapeIndex];
    },[shapeColors]);

    const markShapeWithQueen = useCallback((shapeIndex) => {
        if(shapeIndex !== undefined && !shapesWithQueens.includes(shapeIndex)){
            setShapesWithQueens(prev => [...prev,shapeIndex]);
            return true;
        }
        return false;
    }, [shapesWithQueens]);

    const doesShapesHaveQueen = useCallback((shapeIndex) => {
        return shapesWithQueens.includes(shapeIndex);
    },[shapesWithQueens])

    const resetShapesWithQueens = useCallback(() => {
        setShapesWithQueens([]);
    },[])


    const registerQueenPlacement = useCallback((row,col)=> {
        const shapeIndex = getShapeForCell(row,col);
        if(shapeIndex !== undefined){
            return markShapeWithQueen(shapeIndex);
        }
        return false;
    }, [getShapeForCell,markShapeWithQueen]);

    const validateShapeConstraint = useCallback((queensPositions) => {
        const newShapesWithQueens = [];
        let valid = true;

        for (const[row,col] of queensPositions){
            const shapeIndex = getShapeForCell(row,col);
            if(shapeIndex === undefined){
                valid = false;
                break
            }
            if(newShapesWithQueens.includes(shapeIndex)){
                valid = false;
                break
            }
            newShapesWithQueens.push(shapeIndex);
        }

        if(valid){
            setShapesWithQueens(newShapesWithQueens);
        }
        return valid;
    },[getShapeForCell]);

    const getCellsInShape = useCallback((shapeIndex) => {
        if(shapeIndex === undefined || !shapes[shapeIndex]){
            return [];
        }
        return shapes[shapeIndex];
    },[shapes]);

    return {
        shapes,
        processShapes,
        shapesWithQueens,
        shapeColors,
        getShapeColorClass,
        getShapeForCell,
        getCellsInShape,
        markShapeWithQueen,
        doesShapesHaveQueen,
        resetShapesWithQueens,
        registerQueenPlacement,
        validateShapeConstraint,
        unregisterQueenPlacement,
    }
}