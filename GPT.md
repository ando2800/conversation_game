# チャットUI仕様書（AI向け）

この仕様書は、マフィアとのチャットを模したWebアプリケーションのUI構造・動作仕様を、AIによる自動処理や操作対象として明確に理解できる形式で記述する。

---

## 🧱 DOM構造

```html
<body>
  <div id="chat-container">
    <div id="chat-log">
      <!-- チャットメッセージ（.user-message / .mafia-message） -->
    </div>
    <div id="input-container">
      <input id="user-input" type="text" placeholder="メッセージを入力...">
      <button id="send-button">送信</button>
    </div>
  </div>
</body>
```

### クラス構成（チャットログ内メッセージ）
```html
<div class="message user-message">
  <span>こんにちは</span>
</div>

<div class="message mafia-message">
  <span>元気か？</span>
  <div class="feedback-buttons">
    <button>👍</button>
    <button>👎</button>
  </div>
</div>
```

---

## 🎨 スタイリングルール

- 全体背景：`body` に `#E0F7FA` を設定（淡い水色）
- チャットボックス：中央寄せ、幅は 90%、最大400px、高さ600px、白背景
- 吹き出し：
  - `user-message` は右寄せ・緑背景（LINE風）
  - `mafia-message` は左寄せ・白背景
- 入力欄：丸みあり、送信ボタンは青色（`#007BFF`）でホバー時に濃く

---

## 🔄 ユーザー操作と自動化対象

| アクション           | 対象セレクタ                                         | 備考                          |
|----------------------|------------------------------------------------------|-------------------------------|
| メッセージ入力       | `#user-input`                                       | `input.value` を設定         |
| メッセージ送信       | `#send-button` or Enter キー                        | `.click()` または `keydown`  |
| 最後の返信に👍を押す | `#chat-log .mafia-message:last-child .feedback-buttons button:first-child` | Puppeteerで自動化対象        |
| 最後の返信に👎を押す | `#chat-log .mafia-message:last-child .feedback-buttons button:last-child` |                               |

---

## ⏳ 非同期処理の考慮点

- チャットログはJSにより動的に生成される
- Puppeteer等による操作時には `waitForSelector` を使用すること

---

## 📌 注意点

- `.girl-message` などの旧名称は使用していない → `.mafia-message` に統一
- レスポンシブ対応済み（`width: 90%` + `max-width: 400px`）
- フィードバックボタンが表示されるまでの遅延に注意

---

## 📚 想定用途

- AIエージェントによるクリック操作の対象定義
- UI変更時のセレクタ影響評価
- テスト自動化（Puppeteer/Selenium）の定義書
