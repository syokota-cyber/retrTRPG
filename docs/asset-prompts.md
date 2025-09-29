# アセット一覧・生成プロンプト（最小セット）

本一覧は最小プレイアブル用の画像ファイル名と、画像生成向けプロンプト（例）です。ピクセルアート/トップダウン3/4視点、タイル基準32x32pxを想定。

注意: 現在は `.png` 実素材の代わりに同名の `.svg` プレースホルダーを配置しています（パスと寸法は docs/asset-placeholders.json を参照）。差し替え時は同名の `.png` を同ディレクトリに置き換えてください。

- 推奨スタイル: 中世ファンタジー商会風、温かい土色系、1pxアウトライン
- 透過: 背景は完全透過（PNG）
- スプライト規格: キャラは 3コマ歩行 × 4方向（横3×縦4 = 96x128px）

## 1) UI / タイトル
- パス: `src/assets/images/ui/title_logo_v1.png`
  - 説明: タイトルロゴ（横長）512x256px
  - プロンプト: 「中世ギルド風ロゴ、『中世風ビジネスSRPG』のタイトル。リュートやギルド紋章をモチーフ、重厚だが可読性高い金属風文字、背景は淡い羊皮紙テクスチャ、PNG透過」

- パス: `src/assets/images/ui/cursor_selector_v1.png`
  - 説明: 選択カーソル/ハイライト 32x32px
  - プロンプト: 「ピクセルアートの選択リング、32x32px、金色の細い枠と柔らかな発光、トップダウン3/4視点、背景透過」

## 2) コマンドアイコン（32x32）
- `src/assets/images/ui/icons/icon_move_v1.png`
  - 移動: 「矢印アイコン、32x32px、ピクセルアート、移動を想起させる二重矢印、背景透過」
- `src/assets/images/ui/icons/icon_negotiate_v1.png`
  - 交渉: 「握手と吹き出し、32x32px、商談の雰囲気、温色系、背景透過」
- `src/assets/images/ui/icons/icon_invest_v1.png`
  - 資金投入: 「コイン袋＋上向き矢印、32x32px、財務強化を示す、背景透過」
- `src/assets/images/ui/icons/icon_contract_v1.png`
  - 契約: 「巻物＋封蝋、32x32px、法務/契約の象徴、背景透過」
- `src/assets/images/ui/icons/icon_heal_v1.png`
  - 回復: 「十字＋コイン、32x32px、財務回復のニュアンス、背景透過」
- `src/assets/images/ui/icons/icon_attack_v1.png`
  - 攻撃: 「短剣/剣、32x32px、シンプルな斜めの刃、背景透過」
- `src/assets/images/ui/icons/icon_end_turn_v1.png`
  - 終了: 「砂時計、32x32px、ターン終了の象徴、背景透過」

## 
2.1) アイテムアイコン（医療・補助 32x32）
- `src/assets/images/ui/icons/icon_item_painkiller_v1.png`
  - 痛み止め薬: 「小瓶と錠剤、32x32px、ピクセルアート、薬効を示す柔らかな光、背景透過」
- `src/assets/images/ui/icons/icon_item_potion_v1.png`
  - 薬品（回復薬）: 「赤い液体の丸瓶、コルク栓、ハイライト、背景透過」
- `src/assets/images/ui/icons/icon_item_herb_v1.png`
  - 薬草: 「束ねた草葉、緑系パレット、簡素な紐留め、背景透過」
- `src/assets/images/ui/icons/icon_item_bandage_v1.png`
  - 包帯: 「巻かれた包帯ロール、白～薄灰、陰影控えめ、背景透過」
- `src/assets/images/ui/icons/icon_eq_prosthetic_leg_v1.png`
  - 義足: 「木製義足のシルエット、金属金具、32x32px、背景透過」
- `src/assets/images/ui/icons/icon_eq_prosthetic_arm_v1.png`
  - 義手: 「義手の前腕部シルエット、機械的関節、背景透過」
- `src/assets/images/ui/icons/icon_eq_crutch_v1.png`
  - 松葉杖: 「木製の松葉杖、斜め配置、背景透過」
## 3) キャラスプライト（96x128, 3x4）
各行は方向（上/右/下/左の順で可、ゲーム側で合わせ込む）、各列は歩行アニメの3コマ。
共通プロンプト末尾: 「ピクセルアート、96x128px（32px格子、3x4）、トップダウン3/4、背景透過、等尺スケール統一」

- `src/assets/images/sprites/characters/sprite_char_sales_v1.png`
  - 営業: 「革帳簿を持つ商人、ギルド衣装、温かい土色の上着と肩掛け、快活な表情」
- `src/assets/images/sprites/characters/sprite_char_finance_v1.png`
  - 財務: 「コイン袋と算盤（または帳簿）、落ち着いた青/茶の法衣風衣装」
- `src/assets/images/sprites/characters/sprite_char_legal_v1.png`
  - 法務: 「封蝋の巻物を掲げる書記官、濃紺のローブ、厳格な雰囲気」
- `src/assets/images/sprites/characters/sprite_char_scout_v1.png`
  - 斥候: 「フード付き外套、軽装、探索用の小型地図、素早さ重視」
- `src/assets/images/sprites/characters/sprite_char_guard_v1.png`
  - 護衛: 「短剣と小盾、革鎧、逞しい体格、商隊護衛らしい質実剛健さ」
- `src/assets/images/sprites/characters/sprite_char_driver_v1.png`
  - 御者: 「手綱/棒を持つ、作業着風の衣装、帽子やスカーフ」

（各キャラ、共通末尾を付けて生成: 「…、ピクセルアート、96x128px（32px格子、3x4）、トップダウン3/4、背景透過、等尺スケール統一」）

## 4) 敵スプライト（任意2体, 96x128）
- `src/assets/images/sprites/enemies/sprite_enemy_raider_v1.png`
  - 野盗: 「フードと包帯、粗末な短剣、暗色パレット、ピクセルアート、96x128px、3x4、背景透過」
- `src/assets/images/sprites/enemies/sprite_enemy_corp_guard_v1.png`
  - 競合商会の護衛: 「制服風の革鎧＋腕章、量産感のある装備、ピクセルアート、96x128px、3x4、背景透過」

## 5) オブジェクト
- `src/assets/images/objects/sprite_cart_main_v1.png`
  - 荷馬車: 「木製の商隊用荷馬車、帆布の天幕、トップダウン3/4、64x32px（横2タイル分）、背景透過、静止1フレーム」

## 6) タイルセット（32x32）
- `src/assets/images/tiles/tileset_city_market_v1.png`
  - 内容: 1枚のタイルシートに以下を収録（各32x32px）
    - `road_cobble`（石畳の道）
    - `market_stall`（市場の屋台）
    - `obstacle_crate`（木箱障害）
    - `hq_player`（自商会拠点）
    - `hq_enemy`（敵本社拠点）
  - プロンプト: 「中世城下町・市場タイルセット、32x32px格子、石畳の道/市場の屋台/木箱/自商会拠点/敵拠点、ピクセルアート、温かい土色系、背景透過」

## 補足: 命名規則/解像度
- 命名: `カテゴリ_詳細_v{版}.png`（例: `icon_move_v1.png`）
- 解像度:
  - タイル: 32x32px
  - 文字/アイコン: 32x32px
  - キャラ/敵: 96x128px（32px格子 3x4）
  - 荷馬車: 64x32px（2タイル横）
- 透過色は使用せずアルファ透過。輪郭は1px、縮小なし、最近傍補間での拡大を想定。

### 表示スケール（可読性）
- ベース解像度は維持し、実表示は2～3倍スケール（推奨3x）。
- 高DPI環境でもドットの視認性を確保し、UIは相対スケールで調整。
