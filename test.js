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

    await page.goto(`http://localhost:8080/`);

    // 初期メッセージが表示されるのを待つ
    await new Promise(resolve => setTimeout(resolve, 1000));

    const messagesToSend = [
        'はじめまして！',
        '可愛いね！',
        '趣味は何？'
    ];

    for (const msg of messagesToSend) {
        // メッセージを入力
        await page.type('#user-input', msg);

        // 送信ボタンをクリック
        await page.click('#send-button');

        // LLMからの応答と好感度の変化を待つため、長めに待機
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 次の入力までの間隔
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // すべての操作が完了した後にスクリーンショットを撮る
    await page.screenshot({ path: 'screenshot_timestamp_readstatus.png' });

    // ブラウザを閉じる
    await browser.close();

    console.log('デモンストレーションが完了し、screenshot_timestamp_readstatus.png に結果を保存しました。');
})();