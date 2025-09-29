import type { MapTile, Shop } from '../types/game';

const shopTypes: Shop['type'][] = ['inn', 'weapon', 'item', 'market', 'guild'];

const generateShop = (x: number, y: number): Shop | undefined => {
  const hasShop = Math.random() > 0.6;
  if (!hasShop) return undefined;
  
  const type = shopTypes[Math.floor(Math.random() * shopTypes.length)];
  return {
    id: `shop-${x}-${y}`,
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

const getTerrainType = (x: number, y: number): MapTile['type'] => {
  const centerDistance = Math.abs(x - 4.5) + Math.abs(y - 4.5);
  
  if (centerDistance < 3) return 'city';
  if (centerDistance < 6) return 'town';
  return 'plains';
};

const getTileColor = (type: MapTile['type']): string => {
  const colors: Record<MapTile['type'], string> = {
    plains: '#4CAF50',
    town: '#8D6E63',
    city: '#757575'
  };
  return colors[type];
};

export const generateMap = (width: number = 10, height: number = 10): MapTile[][] => {
  const map: MapTile[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: MapTile[] = [];
    for (let x = 0; x < width; x++) {
      const type = getTerrainType(x, y);
      const tile: MapTile = {
        id: `tile-${x}-${y}`,
        x,
        y,
        type,
        color: getTileColor(type),
        shop: generateShop(x, y)
      };
      row.push(tile);
    }
    map.push(row);
  }
  
  // スタート地点とゴール地点を設定
  map[0][0].shop = {
    id: 'start',
    name: '出発地点',
    type: 'inn',
    items: []
  };
  
  map[height - 1][width - 1].shop = {
    id: 'goal',
    name: 'ボス商会',
    type: 'guild',
    items: []
  };
  
  return map;
};