const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// DOM要素の存在チェック
if (!chatLog || !userInput || !sendButton) {
    console.error('必要なDOM要素が見つかりません。HTMLを確認してください。');
}

// 女性キャラクターの好感度 (0:最悪 ~ 9:最高)
let girlAffection = 5; // 初期値は中立
const MAX_AFFECTION = 9;
const MIN_AFFECTION = 0;

// 会話回数
let conversationCount = 0;
const MAX_CONVERSATION = 10;

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function addMessage(message, sender) {
    const time = getCurrentTime();
    let messageHtml = `
        <div class="message ${sender}-message">
            <span>${message}</span>
        </div>
        <div class="message-info">
            <span class="timestamp">${time}</span>
            ${sender === 'user' ? '<span class="read-status">未読</span>' : ''}
        </div>
    `;

    if (chatLog) {
        chatLog.insertAdjacentHTML('beforeend', messageHtml);
        console.log('Generated HTML:', messageHtml); // デバッグログを追加
        chatLog.scrollTop = chatLog.scrollHeight;
    }
}

function handleUserInput() {
    const userMessage = userInput.value;
    if (userMessage.trim() !== '') {
        addMessage(userMessage, 'user');
        userInput.value = '';

        conversationCount++;

        // 入力と送信ボタンを一時的に無効化
        if (userInput) userInput.disabled = true;
        if (sendButton) sendButton.disabled = true;

        // バックエンドAPIにメッセージを送信
        fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            const girlMessage = data.reply; // 変数名を変更
            addMessage(girlMessage, 'girl'); // ここを'girl'に変更

            // 直前のユーザーメッセージに既読マークを付ける
            const lastUserMessageInfo = chatLog.querySelector('.user-message:last-child .message-info .read-status');
            if (lastUserMessageInfo) {
                lastUserMessageInfo.innerText = '既読';
            }

            // LLMからの返答内容に基づいて好感度を変化させる
            const lowerCaseGirlMessage = girlMessage.toLowerCase();
            // 好感度を上げるキーワード（例: 肯定的な返答、絵文字など）
            if (lowerCaseGirlMessage.includes('ありがとう') || lowerCaseGirlMessage.includes('嬉しい') || lowerCaseGirlMessage.includes('😊') || lowerCaseGirlMessage.includes('💕') || lowerCaseGirlMessage.includes('そうなんだ') || lowerCaseGirlMessage.includes('すごい')) {
                girlAffection = Math.min(MAX_AFFECTION, girlAffection + 1);
            } 
            // 好感度を下げるキーワード（例: 否定的な返答、冷たい言葉など）
            else if (lowerCaseGirlMessage.includes('ごめん') || lowerCaseGirlMessage.includes('無理') || lowerCaseGirlMessage.includes('😒') || lowerCaseGirlMessage.includes('😑') || lowerCaseGirlMessage.includes('えー') || lowerCaseGirlMessage.includes('は？')) {
                girlAffection = Math.max(MIN_AFFECTION, girlAffection - 1);
            }

            // 入力と送信ボタンを再度有効化
            if (userInput) userInput.disabled = false;
            if (sendButton) sendButton.disabled = false;
            userInput.focus(); // 入力フィールドにフォーカスを戻す

            // 会話回数チェックとゲーム終了判定
            if (conversationCount >= MAX_CONVERSATION) {
                setTimeout(() => {
                    let gameResult = '';
                    if (girlAffection >= 7) {
                        gameResult = 'ゲームクリア！彼女はあなたに夢中だ！';
                    } else if (girlAffection <= 2) {
                        gameResult = 'ゲームオーバー…彼女はあなたに冷めきっている。';
                    } else {
                        gameResult = 'ゲーム終了。彼女はまだあなたに心を許していない。';
                    }
                    alert(gameResult + '\nページをリロードして再挑戦！');
                    // ゲーム終了後は入力を無効化
                    if (userInput) userInput.disabled = true;
                    if (sendButton) sendButton.disabled = true;
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error fetching girl response:', error);
            addMessage('ごめんなさい、電波が悪いのかな？もう一度送ってみて。', 'girl'); // エラーメッセージも変更
            // エラー時も入力と送信ボタンを有効化
            if (userInput) userInput.disabled = false;
            if (sendButton) sendButton.disabled = false;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    addMessage('はじめまして！', 'girl'); // 初期メッセージを変更
});

if (sendButton) {
    sendButton.addEventListener('click', handleUserInput);
}

if (userInput) {
    userInput.addEventListener('keydown', (event) => {
        // isComposingプロパティをチェックして、IME変換中でない場合のみ送信
        if (event.key === 'Enter' && !event.isComposing) {
            handleUserInput();
        }
    });
}