# 🍄 CPENT Quest: Super Mario Offensive Security RPG

> **將枯燥的 CPENT 滲透實戰考試轉化為超級瑪利歐 8-Bit 像素大冒險！**  
> 結合真實滲透測試情境（Active Directory 攻擊鏈、Ligolo/Chisel 雙層穿透、OT/SCADA、二進制逆向、SUID 提權）與紅白機經典破關爽快感。

---

## 🌟 核心特色 (Key Features)

### 1. 🕹️ 經典 NES 頂部儀表板 (NES Mario HUD)
* **MARIO 積分與等級**：由 `Small Mario` 逐步進階為 `Super Mario`、`Fire Mario`、`Cape Mario`，最終問鼎 `CPENT World Champion`！
* **旋轉金幣櫃 (Coins)**：每擊破一題或完成爆擊即可斬獲過關金幣 `🪙`。
* **狀態監控**：即時 HP 完整度、專注力 (Focus) 與當前世界關卡代號（`WORLD 1-1` 至 `WORLD 6-CASTLE`）。

### 2. 🗺️ 6 大世界闖關地圖 (Overworld Level Map)
依循 CPENT 實戰考核核心領域規劃六大世界地圖：
* **WORLD 1 // 邊界平原 (Perimeter Recon)**：Nmap 參數優化、全連接埠快速掃描、WAF 與防火牆繞過。
* **WORLD 2 // 地底域控古堡 (Active Directory)**：AS-REP Roasting、GetUserSPNs Kerberoasting、BloodHound 節點、Pass-the-Ticket 黃金票證偽造。
* **WORLD 3 // 水管穿透深淵 (Double Pivoting)**：Ligolo-ng TUN 虛擬網卡打通、Chisel 反向 SOCKS5 代理、雙層內網穿透。
* **WORLD 4 // 工控齒輪工廠 (OT & SCADA)**：Modbus TCP 保持暫存器 (FC03) 讀寫、PLC 閥門安全聯鎖與工控探測。
* **WORLD 5 // 岩漿逆向熔爐 (Binary Exploit & IoT)**：x86 緩衝區溢位 EIP 精確偏移計算、壞字元排除、JMP ESP 踏板構造。
* **WORLD 6 // 星星雲端王座 (CTF & Root Sovereign)**：Linux SUID 異常檔案提權 (GTFOBins)、SSTI 模板注入、奪取 ROOT 終極大旗！

### 3. ⚔️ 瑪利歐對決魔王舞台 (Battle Arena)
* **黃金問號磚塊 `[ ? ]`**：點擊頂開問號磚塊，消耗 Focus 掉出 CPENT Man-Page 考點提示！
* **發射 Exploit 火球**：選對正確攻擊指令，瑪利歐投擲火球 `🔥` 衝撞魔王，魔王受創閃爍，金幣彈出！
* **拉響過關大樂章**：通關時觸發全彩煙火紙花，並播放原汁原味 Super Mario 旗桿過關大奏鳴曲！

### 4. 🎵 純 Web Audio 8-bit 晶片音效引擎
無須外部音訊檔案，純瀏覽器合成器即時運算：
* 🪙 吃金幣聲（B5 ➜ E6 經典雙音）
* 🦘 跳躍音效（Sweep-up 方波）
* 🍄 超級蘑菇升級聲
* 🧪 鑽入綠色水管聲
* 🔥 火球發射與踩踏打擊聲
* 🚩 經典關卡過關完整歡呼樂！

### 5. 🍄 奇諾比奧道具屋 (Toad's Item Shop)
使用過關金幣換購特異功能裝備：
* **超級紅蘑菇**：立即回復 50 HP。
* **火焰花**：攻擊附帶火球特效，AD / Pivoting 爆擊率 +30%。
* **無敵金星**：重置 IDS 警報，免疫一次失誤傷害。
* **綠色縮時水管**：遭遇隧道難題自動過濾 1 個干擾錯誤選項。
* **1-UP 綠蘑菇**：備用命！HP 歸零時自動滿血復活。

### 6. 🐢 庫巴失誤筆記本 (Koopa Incident Log)
* 自動收錄所有撞刺或被防火牆阻斷的失誤紀錄。
* 提供官方 CPENT 考點原理深度剖析與常見踩坑解析。
* 支援「一鍵重新破關挑戰」與複製為 Markdown 筆記。

---

## 🛠️ 技術架構 (Tech Stack)

* **Core**: React 18/19, Vite
* **Styling**: Vanilla Modern CSS (8-Bit NES Pixel Bevels, CRT Scanlines)
* **Fonts**: `Press Start 2P`, `Fira Code`, `Orbitron`, `Outfit`
* **Audio**: HTML5 Web Audio API Retro Synthesizer
* **PWA**: PWA Web App Manifest, Standalone Mobile Support
* **State**: LocalStorage Auto-persistence

---

## 🚀 本地啟動與開發 (Getting Started)

```bash
# 1. 複製專案庫
git clone git@github.com:ecs7723158/cpent-mario-quest.git
cd cpent-mario-quest

# 2. 安裝依賴
npm install

# 3. 啟動本機開發伺服器
npm run dev
```

開啟瀏覽器前往 `http://localhost:5174/` 即可開始破關！

---

## 🗺️ 後續迭代路線 (Roadmap)

- [ ] 批量匯入個人 Markdown/PDF 筆記轉換為新題目
- [ ] 支援雙人/連線競速破關模式
- [ ] 增加更多工控 (S7comm, BACnet) 與 AD CS (AD 憑證服務) 關卡
- [ ] 部署至 GitHub Pages 一鍵即玩

---

*Powered by Antigravity IDE & Google DeepMind Agentic Coding.*
