import React from 'react';
import PathTile from './PathTile';
import type { PathTile as PathTileType } from '../../utils/pathGenerator';

interface SugorokuBoardProps {
  path: PathTileType[];
  playerPosition: number; // パス上の位置
  onTileClick: (pathIndex: number) => void;
}

const SugorokuBoard: React.FC<SugorokuBoardProps> = ({ path, playerPosition, onTileClick }) => {
  // パスを5列に分けて表示
  const renderPath = () => {
    const rows = [];
    const tilesPerRow = 6;
    
    for (let i = 0; i < path.length; i += tilesPerRow) {
      const rowTiles = path.slice(i, i + tilesPerRow);
      const rowIndex = Math.floor(i / tilesPerRow);
      const isReverseRow = rowIndex % 2 === 1; // 奇数行は逆順
      
      rows.push(
        <div key={rowIndex} className="flex justify-center space-x-2 mb-2">
          {(isReverseRow ? rowTiles.reverse() : rowTiles).map((tile) => (
            <PathTile
              key={tile.pathIndex}
              tile={tile}
              hasPlayer={playerPosition === tile.pathIndex}
              onClick={() => onTileClick(tile.pathIndex)}
            />
          ))}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="bg-gradient-to-b from-amber-100 to-orange-100 p-6 rounded-xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-amber-900 mb-2">🎯 すごろく風ゲームボード</h3>
        <p className="text-lg text-amber-800">スタートからゴールまで一本道を進もう！</p>
      </div>
      
      {/* パス表示 */}
      <div className="space-y-4">
        {renderPath()}
      </div>
      
      {/* 進行状況バー */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-inner">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-gray-700">進行状況</span>
          <span className="font-bold text-gray-700">{playerPosition + 1} / {path.length}</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-6">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-6 rounded-full transition-all duration-500"
            style={{ width: `${((playerPosition + 1) / path.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* スタート・ゴール情報 */}
      <div className="flex justify-between mt-4 px-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="font-bold text-gray-700">🚩 スタート</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="font-bold text-gray-700">🏁 ゴール</span>
        </div>
      </div>
    </div>
  );
};

export default SugorokuBoard;