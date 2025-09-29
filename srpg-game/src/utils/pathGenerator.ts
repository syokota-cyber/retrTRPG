import type { MapTile, Shop } from '../types/game';

// すごろく風のパスを生成
export interface PathTile extends MapTile {
  pathIndex: number; // パス上の位置（0がスタート）
  isGoal: boolean;
}

const shopTypes: Shop['type'][] = ['inn', 'weapon', 'item', 'market', 'guild'];

const generateShop = (pathIndex: number): Shop | undefined => {
  // スタートとゴール以外で50%の確率で店を配置
  if (pathIndex === 0 || pathIndex >= 29) return undefined;
  
  const hasShop = Math.random() > 0.5;
  if (!hasShop) return undefined;
  
  const type = shopTypes[Math.floor(Math.random() * shopTypes.length)];
  return {
    id: `shop-${pathIndex}`,
    name: getShopName(type),
    type,
    items: []
  };
};

const getShopName = (type: Shop['type']): string => {
  const names: Record<Shop['type'], string> = {
    inn: '宿屋',
    weapon: '武具屋',
    item: '道具屋',
    market: '市場',
    guild: '商会'
  };
  return names[type];
};

const getTerrainType = (pathIndex: number): MapTile['type'] => {
  if (pathIndex < 10) return 'plains';
  if (pathIndex < 20) return 'town';
  return 'city';
};

// すごろく風の一本道パスを生成（30マス）
export const generateSugorokuPath = (): PathTile[] => {
  const path: PathTile[] = [];
  
  for (let i = 0; i < 30; i++) {
    const type = getTerrainType(i);
    const isGoal = i === 29;
    
    let shop: Shop | undefined;
    if (i === 0) {
      shop = { id: 'start', name: 'スタート地点', type: 'inn', items: [] };
    } else if (isGoal) {
      shop = { id: 'goal', name: 'ゴール商会', type: 'guild', items: [] };
    } else {
      shop = generateShop(i);
    }
    
    const tile: PathTile = {
      id: `path-${i}`,
      x: 0, // パス上では座標は使わない
      y: 0,
      type,
      color: getTileColor(type),
      pathIndex: i,
      isGoal,
      shop
    };
    
    path.push(tile);
  }
  
  return path;
};

const getTileColor = (type: MapTile['type']): string => {
  const colors: Record<MapTile['type'], string> = {
    plains: '#4CAF50',
    town: '#8D6E63', 
    city: '#757575'
  };
  return colors[type];
};