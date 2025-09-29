import React from 'react';
import type { PathTile } from '../../utils/pathGenerator';

interface PathTileProps {
  tile: PathTile;
  hasPlayer: boolean;
  onClick: () => void;
}

const PathTile: React.FC<PathTileProps> = ({ tile, hasPlayer, onClick }) => {
  const getTileStyle = () => {
    switch (tile.type) {
      case 'plains':
        return { backgroundColor: '#4CAF50', color: 'white' }; // 平原は緑
      case 'town':
        return { backgroundColor: '#8D6E63', color: 'white' }; // 町は茶色
      case 'city':
        return { backgroundColor: '#757575', color: 'white' }; // 大都市は灰色
      default:
        return { backgroundColor: '#757575', color: 'white' };
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

  const style = getTileStyle();

  return (
    <div
      className={`
        relative w-32 h-32 border-4 border-amber-900
        hover:brightness-110 cursor-pointer
        transition-all duration-200 rounded-lg
        flex flex-col items-center justify-center
        ${hasPlayer ? 'ring-8 ring-red-500 ring-offset-4' : ''}
        shadow-xl
      `}
      style={style}
      onClick={onClick}
    >
      {/* パス番号 */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-bold">
        {tile.pathIndex + 1}
      </div>
      
      {/* 地形タイプ */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
        {getTerrainName()}
      </div>
      
      {/* 店舗情報 */}
      {tile.shop && (
        <div className="flex flex-col items-center space-y-1">
          <div className="text-4xl drop-shadow-lg">{getShopIcon()}</div>
          <div className="bg-black bg-opacity-70 px-2 py-1 rounded text-xs font-bold text-center">
            {tile.shop.name}
          </div>
        </div>
      )}
      
      {/* プレイヤー駒 */}
      {hasPlayer && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-red-600 rounded-full border-4 border-white shadow-2xl animate-bounce flex items-center justify-center">
            <span className="text-4xl">🤠</span>
          </div>
        </div>
      )}
      
      {/* ゴールマーク */}
      {tile.isGoal && (
        <div className="absolute -top-4 -right-4 text-6xl">
          🏁
        </div>
      )}
    </div>
  );
};

export default PathTile;