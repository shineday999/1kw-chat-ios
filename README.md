# 1kw Chat - iPhone App

對接 1kw 主機本地 LLM (Qwen3.8-27B / Qwen3.6-27B) 的 iOS App。

## 📦 怎麼拿到 App

**不用 Mac，不用付 USD 99，CI 自動 build**：

1. 進入 GitHub Actions 頁面
2. 選最新的 "Build iOS App" run
3. 底部 **Artifacts** 下載 `1kw-chat-ipa`
4. 解壓縮得到 `1kw-chat.ipa`
5. iPhone 安裝 [AltStore](https://altstore.io/)
6. AltStore → My Apps → ＋ → 選 `1kw-chat.ipa`
7. 完成！主畫面會出現 1kw Chat

**簽名有效期 7 天**，AltStore 會在背景自動重簽，你不用動。

## 🔧 設定 API 連線

打開 App 後，展開「進階」設定：
- **API**: `http://100.117.83.39:8082/v1`
- **Key**: `qwen_local_access`
- **模型**: `/data3/models/Qwen3.8-27B-Uncensored-Q5_K_M.gguf`

按「儲存」就連上 1kw 開始聊。

## 🛠️ 開發

### 本機開發（純 PWA）
```bash
cd /data3/iphone-chat-pwa
python3 -m http.server 8095 -d dist  # 或 nginx 已部署到 http://1kw:8095
```

### 改 PWA → 重新 build iOS
```bash
# 1. 改 index.html / CSS / JS
# 2. 同步到 dist + ios
cp index.html manifest.json sw.js dist/
npx cap sync ios

# 3. commit + push
git add -A
git commit -m "feat: 某某功能"
git push

# 4. GitHub Actions 自動 build 新 ipa（3-5 分鐘）
```

### 改原生 iOS 設定
```bash
# Info.plist → ATS, app name 等
# 用 Xcode 開 ios/App/App.xcodeproj 改（需要 Mac）
# 或直接編輯 Info.plist 後 commit
```

## 📁 檔案結構

```
iphone-chat-pwa/
├── index.html         # 主程式（vanilla JS，無框架）
├── manifest.json      # PWA manifest
├── sw.js              # Service worker
├── icon-*.png         # App icons
├── capacitor.config.ts # Capacitor 配置
├── package.json       # Node deps
├── dist/              # build 產物（要 commit，給 Capacitor 用）
└── ios/               # Xcode 專案
    └── App/
        ├── App/Info.plist
        └── App/public/  # = dist 同步過來的 web assets
```

## 🔐 為什麼能用 HTTP？

iOS 預設不讓 App 打 HTTP（要 HTTPS）。我們在 Info.plist 加了：

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsLocalNetworking</key>
  <true/>
</dict>
```

讓 App 可以打 `http://100.x.x.x`（tailscale private IP）跟 `http://localhost`。
**這只放行 private network**，對外的 HTTPS 還是強制，安全無虞。

## ❓ FAQ

**Q: 7 天後 App 不能用？**
A: AltStore 會自動重簽，背景執行。你只要 iPhone + AltStore 開著就好。

**Q: 能上架 App Store 嗎？**
A: 要付 USD 99/年 Apple Developer + 過審查。自用 AltStore 完勝。

**Q: iPad 能用嗎？**
A: 能，universal app。

**Q: 為什麼不用 React Native / Flutter？**
A: Capacitor 直接包 PWA，零成本重用現有 web 代碼。對小工具是最務實的選擇。

## 🐛 故障排除

| 現象 | 解法 |
|---|---|
| 連不到 1kw | 確認手機在 tailscale 網路，ping 100.117.83.39 |
| 連得到但沒回應 | 確認 1kw llama-server 8082 還活著：`curl http://100.117.83.39:8082/health` |
| AltStore 簽名失敗 | Apple ID 不能開 2FA，或用 app-specific password |
| App 打開閃退 | 重新安裝；Info.plist 改壞了要 `npx cap sync ios` |
