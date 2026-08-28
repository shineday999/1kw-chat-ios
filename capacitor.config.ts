import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cc.cd.qwen.onekwchat',
  appName: '1kw Chat',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    // 不擋 HTTP private network（你連 1kw tailnet 是 100.x.x.x private IP）
    // App Transport Security 例外：只放行你的 API 網域
    // 注意：Capacitor 不直接處理 Info.plist，需要在 Xcode 設定
    // 我們會在 GitHub Actions build 時用 sed 自動加 ATS exception
  },
  server: {
    // 開發時可以用這個讓 iOS App 從遠端拉網頁，不過我們用 webDir='dist' 本地包
  }
};

export default config;
