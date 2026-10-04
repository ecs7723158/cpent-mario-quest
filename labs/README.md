# 🐳 CPENT Real Docker Labs (Hack The Box Style)

本目錄提供真實可打的 Docker 容器靶機環境，模擬 CPENT 考試的六大核心維度。

---

## 🚀 快速啟動靶機 (Spin up Labs)

```bash
cd labs
docker compose up -d
```

### 檢視靶機運行狀態
```bash
docker ps --filter "name=cpent"
```

---

## 🎯 靶機拓撲與測試目標

| 服務名稱 | 容器名稱 | IP / 連接埠 | 對應關卡 | 實戰練習項目 |
| :--- | :--- | :--- | :--- | :--- |
| **recon-target** | `cpent-recon-gateway` | `10.10.10.200` (對外 `49821`, `8080`) | **World 1** | Nmap 全端口高速掃描、非標準 SSH 端口發現、HTTP 標頭探測 |
| **modbus-plc** | `cpent-modbus-simulator` | `10.10.10.204` (對外 `5020:502`) | **World 4** | Modbus TCP 保持暫存器 (FC03) 讀取、PLC 水冷聯鎖數值解讀 |
| **suid-privesc** | `cpent-suid-privesc` | `10.10.10.206` (對外 `2222:22`) | **World 6** | SUID 二進制搜尋 (`find / -perm -u=s`)、GTFOBins 逃逸提權 |

---

## 💻 與本機 Kali 容器直連

若您本機已運行 `kali-desktop`，可將其加入 `cpent-net` 網橋：

```bash
docker network connect labs_cpent-net kali-desktop
```

接著在 Kali 內即可直連 `10.10.10.200`、`10.10.10.204` 等內網 IP 展開實機滲透！
