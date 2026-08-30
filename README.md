# 興嘉國小親子共讀護照 V2.3.5

本次修正：
- 「今日閱讀金句」恢復，並固定放在「全校親子共讀概況」上方。
- 「各年級參與狀況」改為長條統計圖。
- 另新增小型圓餅圖，呈現 1～6 年級占全校參與家庭的比例。
- 圖表直接使用 GAS `getPublicDashboard()` 回傳的 gradeStats，自動更新。
- 保留右上角「進入我的親子共讀護照」選單遮蔽修正。
- 後端 Code.gs 不需修改（前提是目前 getPublicDashboard 已回傳 quote 與 gradeStats）。

部署：
只需用本版 index.html 覆蓋 GitHub Pages 舊檔；assets 資料夾保持不變。
