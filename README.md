# Voice Note - 文字起こしアプリ

Voice Note は ElevenLabs API を使用した音声文字起こしアプリです。このアプリを使用すると、音声を録音し、自動的にテキストに変換することができます。

## 機能

- 音声録音
- ElevenLabs API を使用した音声からテキストへの変換
- 文字起こしの保存
- ダークモード対応
- 日本語対応

## 技術スタック

- React Native
- Expo
- ElevenLabs API

## セットアップ

### 前提条件

- Node.js (v14以上)
- npm または yarn
- Expo CLI
- ElevenLabs API キー

### インストール

1. リポジトリをクローン:

```bash
git clone https://github.com/yourusername/voice-note.git
cd voice-note
```

2. 依存関係をインストール:

```bash
cd src
npm install
```

3. 環境変数の設定:

`.env.example` ファイルを `.env` にコピーし、ElevenLabs API キーを設定します:

```
ELEVEN_LABS_API_KEY=your_api_key_here
```

### 実行

開発モードでアプリを実行:

```bash
npm start
```

Expo Go アプリを使用して、iOS または Android デバイスでアプリをテストできます。

## 使い方

1. マイクボタンをタップして録音を開始
2. 停止ボタンをタップして録音を終了
3. 文字起こしが表示されます
4. 保存ボタンをタップして文字起こしを保存
5. ゴミ箱ボタンをタップして文字起こしをクリア

## デモモード

アプリはデフォルトでデモモードで実行されます。実際の API を使用するには、`App.js` の `demoMode.current` を `false` に設定してください。

## ライセンス

MIT
