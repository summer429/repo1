#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ALERT_CODE = 'ALERT_02_LOGIN_REDIRECT';
const repoRoot = path.resolve(__dirname, '../..');
const loginHtmlPath = path.join(repoRoot, 'login.html');

function fail(message, details) {
  console.error(ALERT_CODE);
  console.error(message);
  if (details) {
    console.error(details);
  }
  process.exit(2);
}

function extractSuccessBlock(source) {
  const successIf =
    /if\s*\(\s*account\s*===\s*['"]ebiz['"]\s*&&\s*password\s*===\s*['"]ebiz['"]\s*\)\s*\{/;
  const match = successIf.exec(source);
  if (!match) {
    return null;
  }

  const start = match.index + match[0].length;
  let depth = 1;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, i);
      }
    }
  }
  return null;
}

function hasMainRedirect(block) {
  const patterns = [
    /location\s*\.\s*href\s*=\s*['"][^'"]*main\.html['"]/,
    /location\s*\.\s*assign\s*\(\s*['"][^'"]*main\.html['"]\s*\)/,
    /location\s*\.\s*replace\s*\(\s*['"][^'"]*main\.html['"]\s*\)/,
    /window\s*\.\s*location\s*=\s*['"][^'"]*main\.html['"]/,
    /window\s*\.\s*location\s*\.\s*href\s*=\s*['"][^'"]*main\.html['"]/,
  ];
  return patterns.some((re) => re.test(block));
}

if (!fs.existsSync(loginHtmlPath)) {
  fail('找不到 login.html', loginHtmlPath);
}

const html = fs.readFileSync(loginHtmlPath, 'utf8');
const successBlock = extractSuccessBlock(html);

if (!successBlock) {
  fail(
    '找不到成功登入分支（account === "ebiz" && password === "ebiz"）',
    'login.html 必須有正確帳密的成功路徑'
  );
}

console.log('OK\t找到成功登入分支（ebiz / ebiz）');

if (!hasMainRedirect(successBlock)) {
  fail(
    '成功登入後未導向 main.html',
    [
      '成功分支目前沒有 location.href / assign / replace 指向 main.html',
      '成功分支摘要：',
      successBlock.trim().slice(0, 400) || '(空)',
    ].join('\n')
  );
}

console.log('OK\t成功分支含導向 main.html');
console.log('PASS 登入成功會導向 main.html');
process.exit(0);
