import React from 'react';
import type { MapTile } from '../../types/game';

interface BoardTileProps {
  tile: MapTile;
  hasPlayer: boolean;
  isPath?: boolean;
  onClick: () => void;
}

const BoardTile: React.FC<BoardTileProps> = ({ tile, hasPlayer, isPath = false, onClick }) => {
  // 仕様書通りの色設定
  const getTileStyle = () => {
    switch (tile.type) {
      case 'plains':
        return 'bg-green-400 border-green-600'; // 平原は緑
      case 'town':
        return 'bg-amber-600 border-amber-800'; // 町は茶色
      case 'city':
        return 'bg-gray-500 border-gray-700'; // 大きな町は灰色
      default:
        return 'bg-gray-400 border-gray-600';
    }
  };

  const getShopIcon = () => {
    if (!tile.shop) return null;
    
    const icons: Record<string, string> = {
      inn: '🏨',
      weapon: '⚔️',
      item: '🎒',
      market: '🏪',
      guild: '🏛️'
    };
    
    return icons[tile.shop.type] || '🏠';
  };

  const getTerrainName = () => {
    switch (tile.type) {
      case 'plains': return '平原';
      case 'town': return '町';
      case 'city': return '大都市';
      default: return '';
    }
  };

  return (
    <div
      className={`
        relative w-24 h-24 border-4
        ${getTileStyle()}
        hover:brightness-110 cursor-pointer
        transition-all duration-200 rounded
        flex flex-col items-center justify-center
        ${hasPlayer ? 'ring-4 ring-red-600 ring-offset-2' : ''}
        ${isPath ? 'shadow-xl' : 'shadow-md'}
      `}
      onClick={onClick}
    >
      {/* 地形タイプ表示 */}
      <div className="absolute top-1 left-1 bg-white px-1 rounded text-xs font-bold text-black">
        {getTerrainName()}
      </div>
      
      {/* 店舗情報 */}
      {tile.shop && (
        <div className="flex flex-col items-center">
          <div className="text-3xl">{getShopIcon()}</div>
          <div className="text-xs font-bold bg-white px-2 py-1 rounded text-black mt-1">
            {tile.shop.name}
          </div>
        </div>
      )}
      
      {/* プレイヤー駒 */}
      {hasPlayer && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-red-600 rounded-full border-4 border-white shadow-2xl animate-pulse flex items-center justify-center">
            <span className="text-3xl">🤠</span>
          </div>
        </div>
      )}
      
      {/* 座標 */}
      <div className="absolute bottom-1 right-1 bg-white px-1 rounded text-xs font-bold text-black">
        {tile.x},{tile.y}
      </div>
    </div>
  );
};

export default BoardTile;