# 技術仕様書（SRPG版：中世風ビジネスRPG）

本仕様は `business_srpgrpg.md` の要件を実装可能な技術設計へ落とし込んだものです。初期版はオフライン・シングルプレイのWebアプリ（TypeScript）を前提にし、将来的な拡張（モバイル/ネイティブ/オンライン）に備えたモジュール分離を行います。

## 1. 技術方針・ターゲット
- **プラットフォーム**：Web（デスクトップ/モバイルブラウザ）
- **主要技術**：
  - フロント：TypeScript + Vite + React（UI）+ Pixi.js（2D描画）
  - 状態管理：Zustand または Redux Toolkit（小規模は Zustand 推奨）
  - ルーティング：React Router
  - テスト：Vitest + Testing Library、Playwright（E2E）
  - アセット：SpriteSheet（ドット絵）、WebAudio（BGM/SE）
- **代替案**：Unity（2D SRPGテンプレート流用可）。ただし初期コスト/配布容易性の観点でWebを主案に採用。
 - **世界観補足**：大国間戦争の陰で商会が暗躍する政治経済劇。マップ/イベントで世界観を表現し、アイテム（医療・補助品）運用が戦術へ影響。

## 2. 全体アーキテクチャ
- **層構造**：
  - Core（ドメインロジック）：マップ/ユニット/ターン/行動/AI/セーブ
  - Adapter（描画・入出力）：Pixi.js（描画）、入力（キーボード/タッチ）
  - UI（React）：画面遷移/メニュー/ログ/オーバーレイ
  - Infra：永続化（LocalStorage/IndexedDB）、設定、アセットローダ
- **データ指向**：純粋なデータモデル（JSON相当）＋純関数ロジックで再現性を確保（テスト容易、セーブ互換性担保）。

## 3. ゲームループ/ターン制
- **フェーズ**：
  - プレイヤーフェーズ → 敵フェーズ → クリンナップ → 次ターン
- **1ターン内の処理**：
  - 行動可能ユニット列挙 → ユーザー操作/AI決定 → 行動解決（移動→コマンド）→ ステータス更新 → 勝敗判定
- **勝敗判定**：
  - 勝利：市場支配率が閾値以上、または敵HQ制圧
  - 敗北：キャラバン本隊壊滅（荷馬車撃破）、資金ゼロ

## 4. データモデル（JSONスキーマ例）

### 4.1 基本型
```json
// Coordinate
{"x": 12, "y": 5}

// Team
"player" | "enemy" | "neutral"
```

### 4.2 タイル/マップ
```json
{
  "id": "map_guild_town_v1",
  "size": {"width": 32, "height": 24},
  "tiles": [
    {"t": "road"}, {"t": "market"}, {"t": "hq_enemy"}, {"t": "obstacle"}
  ],
  "tileMeta": {
    "movementCost": {"road": 1, "market": 2, "obstacle": 255},
    "controlValue": {"market": 3, "hq_enemy": 10}
  },
  "spawns": [
    {"unitId": "u_player_sales_01", "pos": {"x": 2, "y": 5}},
    {"unitId": "u_cart_main", "pos": {"x": 1, "y": 5}}
  ],
  "objectives": {
    "win": [{"type": "controlRate", "threshold": 0.6}, {"type": "destroyHQ"}],
    "lose": [{"type": "cartDestroyed"}, {"type": "cashDepleted"}]
  }
}
```

### 4.3 ユニット
```json
{
  "id": "u_player_sales_01",
  "name": "営業A",
  "team": "player",
  "role": "sales", // sales | finance | legal | scout | guard | driver | cart
  "level": 1,
  "stats": {
    "hp": 24,
    "move": 5,
    "attack": 0,
    "negotiation": 8,
    "legal": 2,
    "heal": 0,
    "defense": 4,
    "range": 1
  },
  "skills": ["price_cut", "persuade_rush"],
  "status": {"exhausted": false}
}
```

### 4.4 アイテム/装備
```json
{
  "id": "itm_painkiller_v1",
  "kind": "consumable", // consumable | equip
  "name": "痛み止め薬",
  "icon": "ui/icons/icon_item_painkiller_v1.png",
  "effects": [
    {"type": "debuffMitigation", "tags": ["stunned","slowed"], "duration": 1},
    {"type": "sideEffect", "stat": "accuracy", "delta": -5, "duration": 1}
  ],
  "price": 50
}
```

他例：
- `itm_potion_v1`（薬品/回復薬：HP+15～25）
- `itm_herb_v1`（薬草：HP+8 or 小デバフ解除）
- `itm_bandage_v1`（包帯：2ターン継続回復）
- `eq_prosthetic_leg_v1`（義足：移動力低下を軽減）
- `eq_prosthetic_arm_v1`（義手：命中/器用度の低下を軽減）
- `eq_crutch_v1`（松葉杖：移動低下軽減、副作用で回避-）

### 4.5 インベントリ/資産
```json
{
  "cash": 1200,
  "reputation": 15,
  "controlRate": 0.12,
  "inventory": ["itm_painkiller_v1", "itm_potion_v1"],
  "equipment": {
    "u_player_sales_01": ["eq_prosthetic_arm_v1"]
  }
}
```

### 4.6 セーブデータ
```json
{
  "version": 1,
  "mapId": "map_guild_town_v1",
  "turn": 3,
  "rngSeed": 123456,
  "party": {"cash": 1200, "reputation": 15, "controlRate": 0.12},
  "units": [/* ユニット配列（位置・HP・状態含む） */]
}
```

## 5. コマンド/行動仕様
- **移動**：A*に基づく最短/安全経路。移動後に行動1回。
- **交渉（営業）**：対象タイル/敵ユニットに対し成功判定（`negotiation` vs 難易度＋乱数）。成功で支配ポイント獲得/敵士気低下。
- **資金投入（財務）**：指定タイルへ投資し味方支配力を一時/恒久上昇。資金を消費。
- **契約（法務）**：敵の行動を束縛（デバフ）/一部タイルを封鎖。クールダウン有。
- **回復（財務）**：味方ユニットのHP/行動力回復（資金コスト）。
- **妨害（斥候/護衛）**：視界外索敵/待ち伏せ/キャラバン狙撃の対策。
- **攻撃（護衛）**：通常ダメージ。近接1/射程武器は装備で拡張。
- **終わる**：そのユニットのターンを終了。

- **アイテム使用**：消費アイテムを即時適用。例：痛み止め→デバフ軽減/副作用、薬品/薬草→HP回復、包帯→リジェネ付与。
- **装備の変更**：戦闘外で装備更新。戦闘中は1枠のみ変更可などの制限を設ける（難易度設定）。

成功判定は統一式：`roll = rng(0..99) + 攻撃側値 - 防御側値 - 地形補正`（閾値以上で成功）

## 6. AI設計（敵フェーズ）
- **優先順位**：
  - キャラバン/荷馬車への接敵 > HQ防衛 > 高価値タイル確保 > 低HP追撃
- **意思決定**：ユーティリティベース（スコア最大行動を選択）。
- **移動**：A*（タイルコスト＋危険度ヒートマップ）。
- **視界/索敵**：斥候による視界共有。フォグオブウォーは初期版オフ（将来導入）。

## 7. 復活の呪文（パスワード式セーブ）
- **方針**：セーブJSONを圧縮→エンコード→チェックサム付与→可読ブロック化。
- **エンコード**：
  - JSON→CBOR（またはZlib圧縮）→Base32（大文字/数字）
  - 例：`ABCD3-EFGH5-JKLMN-...`（5文字×nブロック）
- **チェックサム**：CRC32 または SHA-1 5バイト切り出しを末尾付与。
- **バージョン管理**：先頭2文字でバージョン識別（`V1`）。

擬似コード（TypeScript）
```ts
type Save = { version: number; /* 省略 */ };

export function encodeSpell(save: Save): string {
  const json = JSON.stringify(save);
  const binary = cborEncode(json); // または zlibDeflate(Uint8Array)
  const hash = crc32(binary); // 4 bytes
  const payload = concat(binary, hash);
  const base32 = base32Encode(payload).replace(/=+$/g, "");
  return chunk(base32, 5).join("-");
}

export function decodeSpell(spell: string): Save {
  const base32 = spell.replace(/-/g, "");
  const payload = base32Decode(base32);
  const data = payload.subarray(0, payload.length - 4);
  const sig = payload.subarray(payload.length - 4);
  if (!equal(sig, crc32(data))) throw new Error("Checksum error");
  const json = cborDecode(data); // または zlibInflate
  return JSON.parse(json);
}
```

## 8. 画面/UX設計
- **タイトル**：ロゴ、メニュー（はじめる/つづき=呪文入力/設定/クレジット）。
- **キャラクター選択**：職業+ドット絵。初期スキル説明。
- **戦闘マップ**：
  - グリッド表示、ユニット選択、移動可能範囲ハイライト、行動メニュー。
  - 右側に戦闘ログ（交渉/法廷/資金流出入）。
- **リザルト**：獲得資金/信用度/経験値、次エリア解放。
- **設定**：BGM/SE音量、フレームレート上限、入力方式。

### 8.1 表示スケール指針
- ベース解像度：タイル 32×32px、キャラ 96×128（3×4）
- 既定表示スケール：3x（最近傍）。実画面タイル 96px で視認性確保。
- UIは相対スケールで自動調整（DPI対応）。

## 9. 入力/操作
- **PC**：クリック/ドラッグ、WASD/矢印、Enter/Space、Esc。
- **モバイル**：タップ/ロングタップ/ピンチ。UIは48dp以上のタップ領域。

## 10. 描画/パフォーマンス
- **目標**：60FPS（中規模マップ 32×24、ユニット≤40）。
- **最適化**：
  - タイルはインスタンシング（Pixi ParticleContainer）
  - ログ/UIはReact、ボードはPixiで別レイヤ。
  - 計算はワーカー化可能（経路探索/AI）。

## 11. サウンド
- **BGM**：中世風（リュート/笛/打楽器）。ループ対応Ogg/AAC。
- **SE**：移動/交渉/契約/被弾/勝敗。
- **実装**：WebAudio。ミキサ/フェード/一時停止。

## 12. ローカライズ
- **方式**：`i18n` 辞書（JSON）。`ja` を既定、将来 `en` 追加。
- **文脈キー**：`ui.battle.endTurn` のように階層化。

## 13. セーブ/ロード
- **自動セーブ**：マップ終了時にスロット保存。
- **手動**：復活の呪文入出力。
- **永続**：LocalStorage（<5MB）。大容量はIndexedDBへ切替可能。

## 14. テスト戦略
- **ユニットテスト**：
  - 経路探索、命中/成功判定、行動解決、勝敗判定、呪文エンコード/デコード。
- **E2E**：
  - チュートリアルマップを自動でクリア。
- **スナップショット**：セーブ互換性を固定化（JSON/バイナリのゴールデンファイル）。

## 15. ディレクトリ構成（案）
```
src/
  core/           # 純ロジック（TS）
    map/
    unit/
    turn/
    ai/
    save/
  ui/             # React（メニュー/ログ/パネル）
  view/           # Pixi描画（ボード/ハイライト）
  assets/         # 画像/音源/マップデータ
  app.tsx
  index.html
```

## 16. マイルストーン
- **M1：基盤**（2週）
  - プロジェクト雛形、タイル描画、ユニット選択/移動、行動メニュー枠
- **M2：ルール**（2週）
  - 交渉/契約/資金/回復の解決、勝敗判定、結果画面
- **M3：AI/チュートリアル**（2週）
  - 敵AI（ユーティリティ評価）、導線チュートリアル
- **M4：復活の呪文**（1週）
  - エンコード/デコード、UI入出力、チェックサム検証
- **M5：演出/調整**（2週）
  - エフェクト、BGM/SE、難易度/バランス

## 17. 既知の未決事項/選択肢
- **ヘックス vs スクエア**：初期版はスクエア（実装容易）。
- **Fog of War**：初期無効、将来導入。
- **装備/アイテム**：M5以降で拡張（スロット制）。
- **マップエディタ**：将来Web内製ツールを検討。

## 18. 付録：経路探索（A*）概要
- **ノードコスト**：`g(n)=実コスト`、`h(n)=マンハッタン/対角距離`、`f=g+h`。
- **タイル不可侵**：`movementCost >= 255` は通行不可。
- **危険度**：敵射程/ZOCをヒートマップ化して `g(n)` に加算。

---

本仕様は初期実装の足場です。実装フェーズで判明した前提変更はバージョン番号を更新し差分管理します。
