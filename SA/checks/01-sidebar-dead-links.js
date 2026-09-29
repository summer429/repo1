#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ALERT_CODE = 'ALERT_01_SIDEBAR_DEAD_LINKS';
const repoRoot = path.resolve(__dirname, '../..');
const mainHtmlPath = path.join(repoRoot, 'main.html');

function fail(message, details) {
  console.error(ALERT_CODE);
  console.error(message);
  if (details) {
    console.error(details);
  }
  process.exit(2);
}

if (!fs.existsSync(mainHtmlPath)) {
  fail('找不到 main.html', mainHtmlPath);
}

const html = fs.readFileSync(mainHtmlPath, 'utf8');
const matches = [...html.matchAll(/data-page\s*=\s*["']([^"']+)["']/g)];
const pages = [...new Set(matches.map((m) => m[1].trim()))].filter(Boolean);

if (pages.length === 0) {
  fail('main.html 沒有任何 data-page 側欄連結');
}

const missing = [];
const found = [];

for (const page of pages) {
  const target = path.resolve(path.dirname(mainHtmlPath), page);
  const exists = fs.existsSync(target) && fs.statSync(target).isFile();
  if (exists) {
    found.push(page);
    console.log(`OK\t${page}`);
  } else {
    missing.push(page);
    console.log(`MISSING\t${page}`);
  }
}

if (missing.length > 0) {
  fail(
    `側欄有 ${missing.length} 個死連結（共 ${pages.length} 頁，存在 ${found.length}）`,
    missing.map((page) => `  - ${page}`).join('\n')
  );
}

console.log(`PASS 側欄 ${pages.length} 個 data-page 檔案都存在`);
process.exit(0);
