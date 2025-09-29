import React from 'react';
import type { CharacterStats } from '../../types/game';

interface StatusBarProps {
  stats: CharacterStats;
  turn: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ stats, turn }) => {
  return (
    <div className="bg-ui-bg text-cream p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex space-x-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">レベル</span>
            <span className="text-xl font-bold">{stats.level}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">HP</span>
            <div className="flex items-center space-x-1">
              <span className="text-xl font-bold">{stats.hp}</span>
              <span className="text-sm text-gray-400">/ {stats.maxHp}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">攻撃力</span>
            <span className="text-xl font-bold">{stats.attack}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">防御力</span>
            <span className="text-xl font-bold">{stats.defense}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">交渉力</span>
            <span className="text-xl font-bold">{stats.negotiation}</span>
          </div>
        </div>
        
        <div className="flex space-x-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">所持金</span>
            <span className="text-xl font-bold text-yellow-400">{stats.gold} G</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">ターン</span>
            <span className="text-xl font-bold">{turn}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;