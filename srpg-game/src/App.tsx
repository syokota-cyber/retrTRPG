import { useState, useEffect } from 'react';
import SugorokuBoard from './components/Board/SugorokuBoard';
import Roulette from './components/UI/Roulette';
import StatusBar from './components/UI/StatusBar';
import { generateSugorokuPath, type PathTile } from './utils/pathGenerator';
import type { CharacterStats } from './types/game';

function App() {
  const [path, setPath] = useState<PathTile[]>([]);
  const [playerPosition, setPlayerPosition] = useState<number>(0); // パス上の位置
  const [turn, setTurn] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [moveRemaining, setMoveRemaining] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<string>('');
  
  const [playerStats] = useState<CharacterStats>({
    level: 1,
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 5,
    negotiation: 15,
    gold: 1000
  });

  useEffect(() => {
    const generatedPath = generateSugorokuPath();
    setPath(generatedPath);
    setCurrentEvent('🎮 すごろくゲーム開始！ルーレットを回して進もう！');
  }, []);

  const handleRouletteSpim = (value: number) => {
    setMoveRemaining(value);
    setIsMoving(true);
    setTurn(turn + 1);
    setCurrentEvent(`🎯 ${value}マス進みます！自動で移動します...`);
    
    // 自動移動
    setTimeout(() => {
      const newPosition = Math.min(playerPosition + value, path.length - 1);
      setPlayerPosition(newPosition);
      setIsMoving(false);
      setMoveRemaining(0);
      
      const currentTile = path[newPosition];
      if (currentTile?.shop) {
        setCurrentEvent(`🏪 ${currentTile.shop.name}に到着！商談ができます`);
      } else if (newPosition >= path.length - 1) {
        setCurrentEvent('🎉 ゴール到達！おめでとうございます！');
      } else {
        setCurrentEvent(`移動完了！現在${newPosition + 1}番目のマスにいます`);
      }
    }, 1000);
  };

  const handleTileClick = (pathIndex: number) => {
    if (pathIndex === playerPosition && path[pathIndex]?.shop) {
      setCurrentEvent(`🏪 ${path[pathIndex].shop?.name}で商談開始！（開発中）`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50">
      {/* 1. ヘッダー */}
      <header className="bg-gradient-to-r from-purple-800 to-blue-800 text-white p-6 shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">⚔️ 中世商会戦記 SRPG ⚔️</h1>
          <p className="text-xl">すごろく風ボードゲーム - 商人の冒険</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* 2. ステータス */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 プレイヤー情報</h2>
          <StatusBar stats={playerStats} turn={turn} />
        </section>

        {/* 3. イベントメッセージ */}
        <section className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">📢 ゲーム状況</h2>
            <p className="text-xl font-bold">{currentEvent}</p>
          </div>
        </section>

        {/* 4. ルーレット */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">🎰 移動ルーレット</h2>
          <div className="flex justify-center">
            <Roulette onSpin={handleRouletteSpim} disabled={isMoving} />
          </div>
          {isMoving && (
            <div className="mt-4 bg-blue-500 text-white p-4 rounded-lg text-center font-bold text-xl">
              移動中... {moveRemaining}マス進みます
            </div>
          )}
        </section>

        {/* 5. ゲームルール説明 */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 ゲームの遊び方</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-lg mb-2 text-blue-700">基本ルール</h3>
              <ul className="space-y-2 text-sm">
                <li>🎲 ルーレットを回して出た数だけ進みます</li>
                <li>🏪 店があるマスでは商談ができます</li>
                <li>🎯 スタートからゴールを目指そう！</li>
                <li>✨ 全30マスのすごろく風ゲーム</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-green-700">地形の種類</h3>
              <ul className="space-y-2 text-sm">
                <li>🟢 <span className="font-bold">緑色</span> = 平原地域（1-10マス目）</li>
                <li>🟤 <span className="font-bold">茶色</span> = 町地域（11-20マス目）</li>
                <li>⚫ <span className="font-bold">灰色</span> = 大都市地域（21-30マス目）</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. ゲームボード */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🗺️ すごろくボード</h2>
          {path.length > 0 && (
            <SugorokuBoard
              path={path}
              playerPosition={playerPosition}
              onTileClick={handleTileClick}
            />
          )}
        </section>

        {/* 7. 現在地情報 */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📍 現在地詳細</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="font-bold text-blue-700">現在位置</h3>
              <p className="text-3xl font-bold text-blue-900">{playerPosition + 1}</p>
              <p className="text-sm text-gray-600">/ {path.length} マス</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="font-bold text-green-700">地形タイプ</h3>
              <p className="text-xl font-bold">
                {path[playerPosition]?.type === 'plains' && '🟢 平原'}
                {path[playerPosition]?.type === 'town' && '🟤 町'}
                {path[playerPosition]?.type === 'city' && '⚫ 大都市'}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="font-bold text-purple-700">店舗</h3>
              {path[playerPosition]?.shop ? (
                <div>
                  <p className="text-xl font-bold text-purple-900">{path[playerPosition].shop?.name}</p>
                  <p className="text-sm text-gray-600">商談可能</p>
                </div>
              ) : (
                <p className="text-gray-500">なし</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;