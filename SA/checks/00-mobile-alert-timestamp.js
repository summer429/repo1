#!/usr/bin/env node
'use strict';

/**
 * Slack channel 告警驗證腳本：每次執行都刻意以 exit code 2 結束，
 * 並在 stderr 寫出時間戳記與驗證代碼，方便對照 Slack 訊息與 Agent 回覆。
 * 這不是業務檢核，沒有 PASS 路徑。
 */

const ALERT_CODE = 'ALERT_00_MOBILE_TIMESTAMP';

const now = new Date();
const isoUtc = now.toISOString();
const taipei = new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
}).format(now);
const epochMs = String(now.getTime());
const verifyToken = `MAT-${epochMs.slice(-8)}`;

console.error(ALERT_CODE);
console.error('MOBILE_ALERT_TIMESTAMP_TEST: intentional failure with timestamp');
console.error(`VERIFY_TOKEN=${verifyToken}`);
console.error(`TIMESTAMP_UTC=${isoUtc}`);
console.error(`TIMESTAMP_TAIPEI=${taipei} (Asia/Taipei)`);
console.error(`EPOCH_MS=${epochMs}`);
console.error(
  `請在回覆第一行寫：【告警】Slack 驗證｜${taipei}｜代碼 ${verifyToken}`
);

process.exit(2);
