// smoke-test.js
// 目的：驗證 Cursor Agent -> iPhone 手機告警/即時動態推播通路是否正常

const now = new Date();
const timeString = now.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

console.log("==========================================");
console.log(`[Smoke Test] 執行時間: ${timeString}`);
console.log("[Smoke Test] 正在發送模擬告警測試訊號...");
console.log("==========================================");

// 故意觸發非零的 Exit Code (例如 exit status 2)
// 這會讓 Cursor Agent 判斷任務失敗，進而發送告警至手機即時動態
process.exit(2);
