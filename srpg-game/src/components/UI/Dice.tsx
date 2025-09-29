import React, { useState } from 'react';

interface DiceProps {
  onRoll: (value: number) => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRoll, disabled = false }) => {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<number | null>(null);

  const rollDice = () => {
    if (disabled || rolling) return;
    
    setRolling(true);
    setValue(null);
    
    let count = 0;
    const interval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      setValue(randomValue);
      count++;
      
      if (count > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setValue(finalValue);
        setRolling(false);
        onRoll(finalValue);
      }
    }, 100);
  };

  const getDiceFace = (num: number | null) => {
    if (num === null) return '🎲';
    const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[num] || '🎲';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={rollDice}
        disabled={disabled || rolling}
        className={`
          text-6xl p-4 bg-amber-100 rounded-lg shadow-lg
          transition-all duration-200 transform
          ${rolling ? 'animate-spin' : 'hover:scale-110'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-200 cursor-pointer'}
        `}
      >
        {getDiceFace(value)}
      </button>
      
      {value !== null && !rolling && (
        <div className="text-2xl font-bold text-cream">
          出目: {value}
        </div>
      )}
      
      <button
        onClick={rollDice}
        disabled={disabled || rolling}
        className={`
          px-6 py-2 bg-amber-600 text-white rounded-lg font-bold
          transition-all duration-200
          ${disabled || rolling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-700'}
        `}
      >
        {rolling ? 'サイコロを振っています...' : 'サイコロを振る'}
      </button>
    </div>
  );
};

export default Dice;