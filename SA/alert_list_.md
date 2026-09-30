依目前 ECIF 原型，建議可加的**Slack 頻道告警情境**（Cursor Agent 任務失敗時，由 Automation 以 **Send to Slack** 送到指定 channel）：

| 優先 | 情境 | 觸發條件（範例） | 為什麼值得告警 |
|---|---|---|---|
| 高 | 側欄死連結 | Agent 補齊缺頁後，`main.html` 仍指向不存在的 `*.html` | 多數選單目前會 iframe 載入失敗 |
| 高 | 登入流程斷鏈 | 帳密正確後未導向 `main.html` | 原型核心路徑不通 |
| 高 | 查詢無真實結果 | 「查詢」仍只 `console.log`、表格永遠寫死王小明 | 查詢功能形同未接 |
| 中 | 限閱戶未提示 | 查詢結果為限閱戶卻沒有提示／未記錄行為 | `prompts.html` 需求有寫、頁面沒做 |
| 中 | 權限遮罩失效 | 非授權欄位（身分證、電話等）未隱藏／遮罩 | 個資合規風險 |
| 中 | 缺頁回歸 | CI／煙霧測試發現 `account_query`、`customer_history`、報表頁等仍 404 | 側欄規劃了 10 頁、實作只有 1 頁 |
| 低 | 靜態資源未引用 | `style.css` 未被任何 HTML 引用卻被當成已套用 | 樣式預期與實際不一致 |
| 低 | Prompt／原型不同步 | `prompts.html` 需求與實際頁面欄位不一致 | AI 再生成時會走偏 |

**實作方式建議：** 在 [Cursor Automations](https://cursor.com/automations) 啟用工具 **Send to Slack**，指定告警 channel（例如 `#cursor-alerts`）；針對上表各情境，用可驗證的失敗指令或檢查腳本當觸發，不必等真後端。Agent 失敗結束時，把情境代碼與摘要貼到該 channel。

**Slack 顯示驗證（時間戳記）：** 用 `SA/checks/00-mobile-alert-timestamp.js`（每次必失敗、exit 2）。stderr 會輸出 `VERIFY_TOKEN` 與 `TIMESTAMP_TAIPEI`；Agent 回覆第一行寫入同一組時間與代碼後結束這一輪，並用 Send to Slack 送到指定 channel。對照 Slack 訊息與 Agent 內文，確認是「這一次」告警成功。任務文案見 `prompts.html`「Slack 告警測試 → 步驟 3B」。
