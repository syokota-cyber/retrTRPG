import React from 'react';
import BoardTile from './BoardTile';
import type { MapTile, Position } from '../../types/game';

interface GameBoardProps {
  tiles: MapTile[][];
  playerPosition: Position;
  onTileClick: (x: number, y: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ tiles, playerPosition, onTileClick }) => {
  const isPathTile = (x: number, y: number) => {
    return (x === 0 || x === 9 || y === 0 || y === 9);
  };

  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="grid grid-cols-10 gap-2 max-w-5xl mx-auto">
        {tiles.map((row, y) =>
          row.map((tile, x) => (
            <BoardTile
              key={`${x}-${y}`}
              tile={tile}
              hasPlayer={playerPosition.x === x && playerPosition.y === y}
              isPath={isPathTile(x, y)}
              onClick={() => onTileClick(x, y)}
            />
          ))
        )}
      </div>
      
      {/* スタート・ゴール表示 */}
      <div className="flex justify-between mt-6 px-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="font-bold text-gray-700">スタート地点 (0,0)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="font-bold text-gray-700">ゴール地点 (9,9)</span>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;