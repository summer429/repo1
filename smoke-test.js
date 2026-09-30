// smoke-test.js
// 目的：驗證 Cursor Agent -> Slack channel 告警通路是否正常
//（搭配 Automations 的 Send to Slack；任務失敗 exit 2 後應在指定 channel 看到告警）

const now = new Date();
const timeString = now.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

console.error('ALERT_SMOKE_TEST');
console.error(`[Smoke Test] 執行時間: ${timeString}`);
console.error('[Smoke Test] 正在發送模擬告警測試訊號到 Slack channel...');
console.error('MOBILE_ALERT_TEST: intentional failure');

// 故意觸發非零的 Exit Code (exit status 2)
// 這會讓 Cursor Agent / Automation 判斷任務失敗，並以 Send to Slack 送到指定 channel
process.exit(2);
