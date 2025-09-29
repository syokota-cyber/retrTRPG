# 技術仕様書 - 中世商会戦記 SRPG

## 1. 技術スタック

### 1.1 フロントエンド
- **フレームワーク**: React 18 + TypeScript 5
- **ゲームエンジン**: Phaser 3.70
- **状態管理**: Redux Toolkit
- **スタイリング**: TailwindCSS + CSS Modules
- **ビルドツール**: Vite
- **テスト**: Jest + React Testing Library

### 1.2 アセット管理
- **画像形式**: PNG (スプライトシート)
- **音声形式**: WebM/OGG (BGM), MP3 (SE)
- **フォント**: Webフォント (中世風日本語フォント)

### 1.3 開発環境
- **Node.js**: 20.x LTS
- **パッケージマネージャー**: npm
- **コード品質**: ESLint + Prettier
- **バージョン管理**: Git

## 2. アーキテクチャ設計

### 2.1 ディレクトリ構造
```
retrTRPG/
├── src/
│   ├── components/       # UIコンポーネント
│   │   ├── Board/       # ボードゲームマップ
│   │   ├── Character/   # キャラクター表示
│   │   ├── UI/          # HUD、メニュー
│   │   └── Battle/      # 戦闘画面
│   ├── game/           # ゲームロジック
│   │   ├── scenes/     # Phaserシーン
│   │   ├── entities/   # ゲームエンティティ
│   │   └── systems/    # ゲームシステム
│   ├── store/          # Redux Store
│   ├── assets/         # 画像、音声
│   └── utils/          # ユーティリティ
├── public/
└── tests/
```

### 2.2 コンポーネント設計
```typescript
// マップタイル型定義
interface MapTile {
  id: string;
  x: number;
  y: number;
  type: 'plains' | 'town' | 'city';
  color: string; // 緑、茶色、灰色
  shop?: Shop;
}

// キャラクター型定義
interface Character {
  id: string;
  name: string;
  class: 'merchant' | 'assistant' | 'lawyer';
  position: { x: number; y: number };
  stats: CharacterStats;
}
```

## 3. ゲーム実装仕様

### 3.1 ボードゲームマップ
- **グリッドサイズ**: 10x10マス
- **タイルサイズ**: 64x64px
- **タイル色分け**:
  - 平原: #4CAF50 (緑)
  - 町: #8D6E63 (茶色)
  - 大都市: #757575 (灰色)

### 3.2 サイコロシステム
```typescript
class DiceSystem {
  roll(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
  
  animateRoll(callback: (result: number) => void): void {
    // 3Dサイコロアニメーション
  }
}
```

### 3.3 移動システム
- サイコロの目に応じてマス移動
- 分岐点での方向選択UI
- 移動アニメーション (0.5秒/マス)

### 3.4 商談バトル
- ターン制コマンドバトル
- HP = 商談ポイント
- スキル = 交渉技術

## 4. データ構造

### 4.1 セーブデータ
```typescript
interface SaveData {
  version: string;
  timestamp: number;
  player: {
    level: number;
    experience: number;
    gold: number;
  };
  characters: Character[];
  mapProgress: MapProgress;
  resurrectionCode?: string; // 復活の呪文
}
```

### 4.2 復活の呪文
- Base64エンコード + 簡易暗号化
- 最大64文字
- チェックサム付き

## 5. パフォーマンス要件

### 5.1 目標性能
- FPS: 60fps (ゲーム画面)
- 初期ロード: 3秒以内
- メモリ使用量: 200MB以下

### 5.2 最適化
- スプライトシート使用
- 遅延ローディング
- WebWorker活用

## 6. ブラウザ対応

### 6.1 対応ブラウザ
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

### 6.2 レスポンシブ対応
- 最小解像度: 1024x768
- タッチ操作対応
- 画面回転対応 (横向き推奨)

## 7. 開発フェーズ

### Phase 1: 基礎実装 (現在)
- プロジェクトセットアップ
- 基本UIコンポーネント
- ボードマップ表示

### Phase 2: ゲームロジック
- サイコロシステム
- キャラクター移動
- 商談バトル基礎

### Phase 3: コンテンツ
- ステージデータ
- キャラクターデータ
- バランス調整

### Phase 4: ポリッシュ
- アニメーション
- サウンド実装
- UI/UX改善