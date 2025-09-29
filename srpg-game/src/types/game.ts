export type TerrainType = 'plains' | 'town' | 'city';

export interface MapTile {
  id: string;
  x: number;
  y: number;
  type: TerrainType;
  color: string;
  shop?: Shop;
}

export interface Shop {
  id: string;
  name: string;
  type: 'inn' | 'weapon' | 'item' | 'market' | 'guild';
  items?: Item[];
}

export interface Item {
  id: string;
  name: string;
  price: number;
  effect?: string;
}

export interface Character {
  id: string;
  name: string;
  class: 'merchant' | 'assistant' | 'lawyer';
  position: Position;
  stats: CharacterStats;
  sprite?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface CharacterStats {
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  negotiation: number;
  gold: number;
}

export interface GameState {
  currentStage: number;
  playerPosition: Position;
  characters: Character[];
  gold: number;
  turn: number;
  diceValue: number | null;
  isMoving: boolean;
}

export interface DiceResult {
  value: number;
  animation?: boolean;
}