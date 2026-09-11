# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 作業ルール

- **回答は日本語で行うこと**
- **仕様の正は [SPEC.md](SPEC.md)** — 実装とテストは SPEC.md に従うこと。レビュー時も SPEC.md との突合せを必ず行い、差異があれば指摘する
- **変更は依頼された範囲に限定すること** — 範囲外で気づいた問題は修正せず報告する
- **`data/` ディレクトリは実行時に自動生成される** — 直接編集しないこと

## コマンド

```bash
npm run dev      # 開発サーバー起動 (http://localhost:3000)
npm run build    # プロダクションビルド
npm run lint     # ESLint
npm test         # 全テスト実行 (vitest)
npx vitest run lib/date.test.ts  # 単一ファイルのテスト
```

## アーキテクチャ

Next.js 15 App Router を使った TODO アプリ。

### データ永続化

`lib/store.ts` がデータ層。TODO は `data/todos.json` にファイルとして保存される（DB なし）。ファイルが存在しない場合はシードデータで初期化する。`Todo` 型もここで定義。

### API Routes

| メソッド | パス | 処理 |
|---|---|---|
| GET | `/api/todos` | 一覧取得 |
| POST | `/api/todos` | 追加（空文字・100文字超は 400） |
| PATCH | `/api/todos/[id]` | 完了トグル |
| DELETE | `/api/todos/[id]` | 削除 |

### ユーティリティ

`lib/date.ts` に日付ロジック（`daysLeft` / `isOverdue` / `formatDue`）を集約。テストは `lib/date.test.ts`（vitest）。

## 既知の仕様との差異

- **優先度機能**: SPEC.md §7 のデータ仕様テーブルに `priority` フィールドが未記載（実装済みだが SPEC.md が未更新）
