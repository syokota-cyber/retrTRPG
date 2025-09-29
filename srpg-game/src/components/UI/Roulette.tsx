import React, { useState } from 'react';

interface RouletteProps {
  onSpin: (value: number) => void;
  disabled?: boolean;
}

const Roulette: React.FC<RouletteProps> = ({ onSpin, disabled = false }) => {
  const [spinning, setSpinning] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const numbers = [1, 2, 3, 4, 5, 6];
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  const spinRoulette = () => {
    if (disabled || spinning) return;
    
    setSpinning(true);
    setValue(null);
    
    // ランダムな回転数を生成（3-5回転 + 最終位置）
    const spins = (3 + Math.random() * 2) * 360;
    const finalValue = Math.floor(Math.random() * 6) + 1;
    const finalAngle = (finalValue - 1) * 60;
    const totalRotation = spins + finalAngle;
    
    setRotation(prev => prev + totalRotation);
    
    setTimeout(() => {
      setValue(finalValue);
      setSpinning(false);
      onSpin(finalValue);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-48 h-48">
        {/* ルーレット本体 */}
        <div 
          className={`absolute inset-0 rounded-full shadow-2xl transition-transform duration-3000 ease-out`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {numbers.map((num, index) => {
            const angle = index * 60;
            return (
              <div
                key={num}
                className={`absolute w-full h-full ${colors[index]} rounded-full`}
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 30) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 30) * Math.PI / 180)}%, ${50 + 50 * Math.cos((angle + 30) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle + 30) * Math.PI / 180)}%)`
                }}
              >
                <div 
                  className="absolute text-white font-bold text-2xl"
                  style={{
                    top: '30%',
                    left: '50%',
                    transform: `rotate(${angle}deg) translate(-50%, -50%)`,
                    transformOrigin: 'center'
                  }}
                >
                  {num}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 中心の円 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 bg-white rounded-full shadow-lg border-4 border-gray-800"></div>
        </div>
        
        {/* 矢印インジケーター */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-red-600"></div>
        </div>
      </div>
      
      {/* 結果表示 */}
      {value !== null && !spinning && (
        <div className="text-4xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-lg shadow-lg animate-pulse">
          {value}マス進む！
        </div>
      )}
      
      {/* スピンボタン */}
      <button
        onClick={spinRoulette}
        disabled={disabled || spinning}
        className={`
          px-8 py-4 text-xl font-bold text-white rounded-lg shadow-xl
          transform transition-all duration-200
          ${disabled || spinning 
            ? 'bg-gray-500 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 hover:scale-105 active:scale-95'
          }
        `}
      >
        {spinning ? '回転中...' : 'ルーレットを回す'}
      </button>
    </div>
  );
};

export default Roulette;