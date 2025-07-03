const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: false,
        dumpio: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(`http://localhost:8080/`, { waitUntil: 'networkidle0' }); // ネットワークアイドルまで待機

    // ページが完全にロードされ、入力フィールドが表示されるのを待つ
    await page.waitForSelector('#user-input', { visible: true, timeout: 30000 });

    const messagesToSend = [
        'はじめまして！',
        '可愛いね！',
        '趣味は何？',
        '今度ご飯行かない？',
        'タイプだよ',
        '元気？',
        '愛してる',
        'はい',
        '適当なメッセージ',
        '適当なメッセージ'
    ];

    for (const msg of messagesToSend) {
        // メッセージを入力
        const inputElement = await page.$('#user-input');
        if (inputElement) {
            await inputElement.type(msg);
        } else {
            console.error('#user-input element not found.');
            break;
        }

        // 送信ボタンをクリック
        const sendButton = await page.$('#send-button');
        if (sendButton) {
            await sendButton.click();
        } else {
            console.error('#send-button element not found.');
            break;
        }

        // LLMからの応答と好感度の変化を待つため、長めに待機
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒に延長

        // 次の入力までの間隔
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // ゲーム終了のalertが表示されるのを待って閉じる
    page.on('dialog', async dialog => {
        console.log(`Alert message: ${dialog.message()}`);
        await dialog.accept();
    });

    // すべての操作が完了した後にスクリーンショットを撮る
    await page.screenshot({ path: 'screenshot_final_demo.png' });

    // ブラウザを閉じる
    await browser.close();

    console.log('デモンストレーションが完了し、screenshot_final_demo.png に結果を保存しました。');
})();