# PNGアセット計画

## ディレクトリ構成
```
assets/
  png/
    pieces/
      stage1/
    boards/
      stage1/
    backgrounds/
      stage1/
    scenes/
      stage1/
```

## 導入済みアセット（ステージ1）
| ファイル名 | カテゴリ | 想定用途 | ピクセルサイズ |
| --- | --- | --- | --- |
| assets/png/pieces/stage1/sprite_char_driver_v1.png | 駒（プレイヤー） | ドライバー職のキャラクター | 1024 x 1024 |
| assets/png/pieces/stage1/sprite_char_finance_v1.png | 駒（プレイヤー） | 財務担当キャラクター | 1024 x 1024 |
| assets/png/pieces/stage1/sprite_char_guard_v1.png | 駒（プレイヤー） | ガード（近接防御役） | 1024 x 1024 |
| assets/png/pieces/stage1/sprite_char_legal_v1.png | 駒（プレイヤー） | 法務担当キャラクター | 1024 x 1024 |
| assets/png/pieces/stage1/sprite_char_sales_v1.png | 駒（プレイヤー） | 営業担当キャラクター | 1024 x 1024 |
| assets/png/pieces/stage1/sprite_char_scout_v1.png | 駒（プレイヤー） | 斥候キャラクター | 1024 x 1024 |
| assets/png/pieces/stage1/sprite_enemy_corp_guard_v1.png | 駒（敵） | 企業兵ガード（量産敵） | 1024 x 1024 |
| assets/png/pieces/stage1/sprite_enemy_raider_v1.png | 駒（敵） | レイダー系エネミー | 1024 x 1024 |
| assets/png/boards/stage1/tileset_city_hq_player.png | マップタイル | プレイヤー陣営HQタイルセット | 1024 x 1024 |
| assets/png/boards/stage1/tileset_city_hq_enemy.png | マップタイル | 敵陣営HQタイルセット | 1024 x 1024 |
| assets/png/boards/stage1/tileset_city_market_road_cobble.png | マップタイル | 市場エリアの石畳タイル | 1024 x 1024 |
| assets/png/boards/stage1/tileset_city_market_stall.png | マップタイル | 市場屋台タイル | 1024 x 1024 |
| assets/png/boards/stage1/tileset_city_obstacle_create.png | マップタイル | 障害物生成用タイル | 1024 x 1024 |
| assets/png/backgrounds/stage1/city_dusk_backdrop.png | 背景 | サイバーパンク調の街景背景 | 3840 x 2160 |

## 未整備アセットと生成プロンプト
| 想定ファイル名 | カテゴリ | 推奨プロンプト例 | 備考 |
| --- | --- | --- | --- |
| assets/png/boards/stage1/city_market_full_board.png | マップ盤面 | "top-down tactical battle map, cyberpunk market plaza, modular grid 30x30, neon signage, wet cobblestone, volumetric evening light, 2048x2048" | タイルセットを統合した盤面。グリッド線を明瞭に。 |
| assets/png/scenes/stage1/boss_showdown.png | 対決シーン | "heroic corporate strike team confronting armored raider boss, dynamic pose, sparks and broken market stalls, ultra-detailed illustration, 4096x2304" | シーン用README参照。 |

## 運用メモ
- 駒アセットは透過PNG（RGBA）を維持し、タクティカルマップ上での可読性を確保する。
- マップタイルは1タイル=1024pxで書き出されているため、エンジン側でタイル倍率を指定して使用する。盤面生成時は`city_market_full_board.png`などの統合画像を追加する。
- 背景および対決シーンは横長比率（16:9〜21:9）を想定し、生成後に必要に応じてトリミングする。
- 背景・対決シーン用ディレクトリにはプロンプトとターゲット解像度をまとめた`README.md`を配置しているので、生成作業前に参照すること。
- 追加生成する際は、同一ディレクトリ階層にファイルを配置し、命名規則`<種別>_<内容>_v<バージョン>.png`を基本とする。
- 既存UI向けアイコンやカーソル素材は`assets/assets/images/ui/`配下に残してあり、別途UI実装時に参照する。
