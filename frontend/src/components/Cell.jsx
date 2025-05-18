import { Queen } from "./Queen";

export const Cell = ({
  row, 
  col,
  colorClass, 
  isHighlighted,
  shapeId,
  hasQueen, 
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  removable
}) => {
  const isLightSquare = (row+col) % 2 === 0;
  const baseColor = isLightSquare ? 'bg-white' : 'bg-gray-500';
  const colorName = colorClass ? colorClass.split('/')[0] : 'none';

    const shapeColors = {
        0: '#c49b92',
        1: '#aa9e5a',
        2: '#71e424',
        3: '#24e4c2',
        4: '#24a9e4',
        5: '#5824e4',
        6: '#d3b8d4',
        7: '#650c0c',
    };
    
    const shapeColor = shapeId !== undefined ? shapeColors[shapeId % 8] : null;
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
    };
  return (
    <div 
      className={`
        w-12 h-12 flex items-center justify-center 
        ${isHighlighted ? 'ring-2 ring-yellow-400 z-10' : ''}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-90'}
        transition-all duration-200 border border-gray-700
        relative
      `}
      style={{
        backgroundImage: shapeColor ? `linear-gradient(${shapeColor}, ${shapeColor})` : 'none',
        backgroundBlendMode: shapeColor ? 'multiply' : 'normal',
      }}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={removable ? "Click to remove queen" : "Click to place queen"}
    >
        {hasQueen && <Queen/>}
    </div>
  )
}