# ディレクトリ構成（現状）

本リポジトリの現行レイアウトと各ディレクトリの用途を示します。実装が進むにつれ随時更新します。

## ツリー

```
/  
├─ business_srpgrpg.md                # SRPG版：要件定義（世界観/ゲーム要素）
├─ 懐かしRPG.docx                     # 参考資料（ドキュメント）
├─ docs/
│  ├─ technical-spec.md               # 技術仕様書（実装設計）
│  ├─ asset-prompts.md                # 画像ファイル名と生成プロンプト一覧
│  └─ asset-placeholders.json         # PNGターゲット↔SVGプレースホルダー対応表
└─ src/
   └─ assets/
      └─ images/
         ├─ ui/
         │  ├─ title_logo_v1.svg
         │  ├─ cursor_selector_v1.svg
         │  └─ icons/                 # UIアイコン（32x32ベース）
         │     ├─ icon_move_v1.svg
         │     ├─ icon_negotiate_v1.svg
         │     ├─ icon_invest_v1.svg
         │     ├─ icon_contract_v1.svg
         │     ├─ icon_heal_v1.svg
         │     ├─ icon_attack_v1.svg
         │     ├─ icon_end_turn_v1.svg
         │     ├─ icon_item_painkiller_v1.svg
         │     ├─ icon_item_potion_v1.svg
         │     ├─ icon_item_herb_v1.svg
         │     ├─ icon_item_bandage_v1.svg
         │     ├─ icon_eq_prosthetic_leg_v1.svg
         │     ├─ icon_eq_prosthetic_arm_v1.svg
         │     └─ icon_eq_crutch_v1.svg
         ├─ tiles/
         │  └─ tileset_city_market_v1.svg    # 32pxタイルセット（石畳/屋台/拠点など）
         ├─ sprites/
         │  ├─ characters/                   # 自軍キャラ（96x128, 3x4）
         │  │  ├─ sprite_char_sales_v1.svg
         │  │  ├─ sprite_char_finance_v1.svg
         │  │  ├─ sprite_char_legal_v1.svg
         │  │  ├─ sprite_char_scout_v1.svg
         │  │  ├─ sprite_char_guard_v1.svg
         │  │  └─ sprite_char_driver_v1.svg
         │  └─ enemies/                      # 敵ユニット（96x128, 3x4）
         │     ├─ sprite_enemy_raider_v1.svg
         │     └─ sprite_enemy_corp_guard_v1.svg
         └─ objects/
            └─ sprite_cart_main_v1.svg       # 荷馬車（64x32）
```

## 用途の要約
- `docs/`: 仕様や運用に関するドキュメント置き場。
  - `technical-spec.md`: 実装観点の技術仕様。
  - `asset-prompts.md`: 必要画像リストと生成プロンプト。
  - `asset-placeholders.json`: PNGターゲットとSVGプレースホルダーの対応と寸法。
- `src/assets/images/`: 画像アセットのルート。現状はSVGプレースホルダーを配置（同名PNGで差し替え予定）。
  - `ui/`: タイトル/カーソル/コマンド・アイテム・装備アイコン。
  - `tiles/`: マップのタイルセット（32px基準）。
  - `sprites/characters/`: プレイヤーユニット（96x128、3×4コマ）。
  - `sprites/enemies/`: 敵ユニット（96x128、3×4コマ）。
  - `objects/`: マップ上の特殊オブジェクト（例: 荷馬車）。

## 運用メモ
- ベース解像度はタイル32px、キャラスプライト96x128（3×4）。実表示は3xスケール推奨。
- PNG差し替え時は同名・同ディレクトリに配置し、`asset-placeholders.json`の寸法を目安に制作してください。
- 追加ディレクトリ（例: `audio/`, `data/`, `scripts/`）が増えた場合は本ファイルを更新してください。
