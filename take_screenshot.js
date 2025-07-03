const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: true, // ヘッドレスモードで実行
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(`http://localhost:8080/`, { waitUntil: 'networkidle0' });

    // ページが完全にロードされるのを待つ
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.screenshot({ path: 'screenshot_final_demo.png' });

    await browser.close();

    console.log('スクリーンショットを撮影しました: screenshot_final_demo.png');
})();