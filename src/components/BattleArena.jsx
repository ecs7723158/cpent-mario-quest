import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, Award, Terminal as TerminalIcon, 
  HelpCircle, Flag, Sparkles, BookOpen, ShieldAlert, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TerminalCLI } from './TerminalCLI';
import { TutorDrawer } from './TutorDrawer';
import { 
  soundCoin, soundFireball, soundStomp, 
  soundDamage, soundAlarm, soundStageClear, soundPowerUp, soundClick 
} from '../utils/audio';

export function BattleArena({
  world,
  challengeIndex,
  onFinishChallenge,
  onExitArena,
  player,
  inventory,
  useItem,
  gameMode // 'practice' | 'exam'
}) {
  const challenge = world.challenges[challengeIndex] || world.challenges[0];
  const [isAnswered, setIsAnswered] = useState(false);
  const [showTutor, setShowTutor] = useState(gameMode === 'practice');
  const [targetHp, setTargetHp] = useState(100);
  const [marioAction, setMarioAction] = useState('idle'); // 'idle' | 'attack' | 'hurt' | 'clear'
  const [bossAction, setBossAction] = useState('idle'); // 'idle' | 'hurt'
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [inputMode, setInputMode] = useState('cli'); // 'cli' | 'options'

  // Gear bonuses
  const hasFireFlower = inventory.some(i => i.id === 'item_fire_flower' && i.equipped);
  const hasGreenPipe = inventory.some(i => i.id === 'item_green_pipe' && i.equipped);

  useEffect(() => {
    setIsAnswered(false);
    setShowTutor(gameMode === 'practice');
    setTargetHp(100);
    setMarioAction('idle');
    setBossAction('idle');

    const initialLogs = [
      { type: 'info', text: `[★ ${world.name.split('//')[0].trim()} • ${challenge.stage}] 守衛魔王: ${world.bossName}` },
      { type: 'info', text: `[+] 目標主機: ${challenge.targetHost} [${challenge.targetOS}]` },
      { type: 'info', text: `[?] ${gameMode === 'exam' ? '【實際考試模式】請在下方終端輸入真實滲透指令，或提交 flag{...}！' : '【練習暗示模式】可參考奇諾比奧導師提示，輸入指令或按 Tab 自動補齊！'}` }
    ];

    if (hasGreenPipe && world.id === 'world_3') {
      initialLogs.push({ type: 'tutor', text: `[*] 【綠色水管被動生效】已啟用隧道快速解析！` });
    }

    setTerminalLogs(initialLogs);
  }, [challengeIndex, world.id, gameMode]);

  // Command Execution Handler
  const handleExecuteCommand = (rawCmd) => {
    if (isAnswered) return;
    const cmd = rawCmd.trim();

    // Check against expected command or keywords
    const isKeywordMatch = challenge.commandKeywords.every(kw => cmd.toLowerCase().includes(kw.toLowerCase()));
    const isExactMatch = cmd.toLowerCase() === challenge.expectedCommand.toLowerCase();

    // Specific check for missing critical flags
    if (challenge.id === 'w2_1' && cmd.includes('GetUserSPNs') && !cmd.includes('-request')) {
      soundDamage();
      setTerminalLogs(prev => [
        ...prev,
        { type: 'cmd', text: `root@kali:~# ${cmd}` },
        { type: 'error', text: `[-] 語法缺陷：缺少 '-request' 參數！KDC 僅會列出 SPN 表格，不會返回 TGS 票證！` },
        { type: 'tutor', text: `💡 導師提示：請加上 -request 參數以提取 $krb5tgs$ 雜湊！` }
      ]);
      return;
    }

    if (challenge.id === 'w1_1' && cmd.startsWith('nmap') && !cmd.includes('-p-')) {
      soundDamage();
      setTerminalLogs(prev => [
        ...prev,
        { type: 'cmd', text: `root@kali:~# ${cmd}` },
        { type: 'error', text: `[-] 掃描範圍不足：缺少 '-p-'！目標服務運行在高位 49821 端口，預設前 1000 埠無法發現目標！` }
      ]);
      return;
    }

    if (isKeywordMatch || isExactMatch) {
      // SUCCESS!
      soundFireball();
      setMarioAction('attack');
      setBossAction('hurt');

      setTimeout(() => {
        soundStomp();
        soundCoin();
        setTargetHp(0);
      }, 300);

      setTimeout(() => {
        setMarioAction('clear');
        soundStageClear();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 700);

      setIsAnswered(true);

      setTerminalLogs(prev => [
        ...prev,
        { type: 'cmd', text: `root@kali:~# ${cmd}` },
        { type: 'success', text: challenge.simulatedOutput },
        { type: 'success', text: `\n[★ STAGE CLEARED] Exploit 執行成功！已捕獲 Flag: ${challenge.flag}` },
        { type: 'info', text: `[+] 獲得 100 積分金幣與 30 EXP！` }
      ]);

      onFinishChallenge({
        success: true,
        challengeId: challenge.id,
        worldId: world.id,
        isCritical: hasFireFlower,
        cpentNote: challenge.cpentNote
      });

    } else {
      // FAIL
      soundDamage();
      soundAlarm();
      setMarioAction('hurt');
      setTimeout(() => setMarioAction('idle'), 600);

      const damage = 25;
      setTerminalLogs(prev => [
        ...prev,
        { type: 'cmd', text: `root@kali:~# ${cmd}` },
        { type: 'error', text: `[-] 指令無效或被防火牆阻斷 (WAF / IDS Reset Connection)` },
        { type: 'error', text: `[-] 受到防禦反噬，扣除 ${damage} HP！` }
      ]);

      onFinishChallenge({
        success: false,
        challengeId: challenge.id,
        worldId: world.id,
        damageTaken: damage,
        failedOptionText: cmd,
        scenario: challenge.scenario,
        cpentNote: challenge.cpentNote
      });
    }
  };

  // Flag Submission Handler
  const handleSubmitFlag = (submittedFlag) => {
    if (isAnswered) return;
    const clean = submittedFlag.trim();

    if (clean === challenge.flag) {
      soundStageClear();
      setTargetHp(0);
      setMarioAction('clear');
      setIsAnswered(true);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      setTerminalLogs(prev => [
        ...prev,
        { type: 'cmd', text: `[SUBMIT FLAG] ${clean}` },
        { type: 'success', text: `[★ FLAG VERIFIED!] 恭喜捕獲目標 Flag！滲透驗收通過！` }
      ]);

      onFinishChallenge({
        success: true,
        challengeId: challenge.id,
        worldId: world.id,
        isCritical: true,
        cpentNote: challenge.cpentNote
      });
    } else {
      soundDamage();
      soundAlarm();
      setTerminalLogs(prev => [
        ...prev,
        { type: 'cmd', text: `[SUBMIT FLAG] ${clean}` },
        { type: 'error', text: `[-] Flag 驗證失敗！該 Flag 不符合目標伺服器金鑰。` }
      ]);
    }
  };

  const hasNext = challengeIndex < world.challenges.length - 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Stage Header Banner */}
      <div className="pixel-box" style={{ padding: '14px 20px', background: '#0b0f19', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="pixel-btn pixel-btn-secondary"
            onClick={() => { soundClick(); onExitArena(); }}
            style={{ padding: '6px 10px' }}
          >
            <ArrowLeft size={14} />
            <span>地圖</span>
          </button>
          <div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: world.themeColor }}>
              {world.name} • {challenge.stage}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              TARGET: {challenge.targetHost} ({challenge.targetOS})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {gameMode === 'practice' && (
            <button
              onClick={() => setShowTutor(prev => !prev)}
              className="pixel-btn pixel-btn-gold"
              style={{ padding: '6px 10px', fontSize: '0.6rem' }}
            >
              🍄 {showTutor ? '隱藏導師' : '召喚導師指導'}
            </button>
          )}

          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.65rem',
            padding: '4px 8px',
            border: '2px solid #000',
            background: gameMode === 'exam' ? 'var(--mario-red)' : 'var(--mario-pipe-light)',
            color: gameMode === 'exam' ? '#fff' : '#000'
          }}>
            {gameMode === 'exam' ? '🎯 實際考試' : '🧪 練習教學'}
          </span>
        </div>
      </div>

      {/* Mario VS Boss Retro Battleground */}
      <div className="pixel-box" style={{
        background: world.skyBg,
        minHeight: '200px',
        padding: '20px 30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderBottom: '8px solid var(--mario-brick)'
      }}>
        
        {/* Floating Question Block (Practice Mode) */}
        {gameMode === 'practice' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => {
                soundPowerUp();
                setShowTutor(true);
              }}
              className="mario-qblock"
              title="頂開問號磚塊獲得導師深度提示"
              style={{ cursor: 'pointer' }}
            >
              ?
            </button>
          </div>
        )}

        {/* Mario & Boss sprites */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          
          {/* Mario */}
          <div style={{
            textAlign: 'center',
            transform: marioAction === 'attack' ? 'translateX(40px) scale(1.15)' : marioAction === 'hurt' ? 'rotate(-20deg) scale(0.9)' : 'scale(1)',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{ fontSize: '3rem', filter: marioAction === 'clear' ? 'drop-shadow(0 0 10px #ffbe0b)' : 'none' }}>
              {marioAction === 'clear' ? '🚩' : marioAction === 'attack' ? '🔥' : '🍄'}
            </div>
            <div style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.65rem',
              color: '#fff',
              background: '#000',
              padding: '2px 6px',
              border: '2px solid #000',
              marginTop: '4px'
            }}>
              MARIO
            </div>
          </div>

          {/* Target Host Info Badge */}
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            border: '2px solid #000',
            padding: '6px 12px',
            borderRadius: '4px',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>TARGET HOST</div>
            <div style={{ color: 'var(--mario-pipe-light)', fontWeight: 'bold' }}>{challenge.targetHost}</div>
          </div>

          {/* Boss */}
          <div style={{
            textAlign: 'center',
            transform: bossAction === 'hurt' ? 'scale(0.85) rotate(15deg)' : 'scale(1)',
            filter: targetHp === 0 ? 'grayscale(1) opacity(0.4)' : 'none',
            transition: 'all 0.25s ease'
          }}>
            <div style={{ fontSize: '3rem' }}>
              {targetHp === 0 ? '💥' : world.id === 'world_2' ? '🐲' : '👾'}
            </div>
            
            {/* Boss HP Bar */}
            <div style={{ width: '120px', height: '12px', background: '#000', border: '2px solid #fff', margin: '4px auto' }}>
              <div style={{
                height: '100%',
                width: `${targetHp}%`,
                background: 'var(--mario-red)',
                transition: 'width 0.3s ease'
              }} />
            </div>

            <div style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.6rem',
              color: 'var(--mario-block)',
              background: '#000',
              padding: '2px 6px',
              border: '2px solid #000'
            }}>
              {world.bossName.split(' ')[0]}
            </div>
          </div>

        </div>

      </div>

      {/* Scenario Briefing */}
      <div className="pixel-box" style={{ padding: '16px', background: '#0b0f19' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: '#fff', marginBottom: '8px' }}>
          {challenge.title}
        </div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          borderLeft: `4px solid ${world.themeColor}`,
          padding: '12px 14px',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          color: '#e2e8f0'
        }}>
          {challenge.scenario}
        </div>
      </div>

      {/* Interactive Terminal CLI */}
      <TerminalCLI 
        challenge={challenge}
        mode={gameMode}
        onExecuteCommand={handleExecuteCommand}
        onSubmitFlag={handleSubmitFlag}
        terminalLogs={terminalLogs}
        isSolved={isAnswered}
      />

      {/* Tutor Drawer (Practice Mode) */}
      {gameMode === 'practice' && (
        <TutorDrawer 
          challenge={challenge}
          isOpen={showTutor}
          onClose={() => setShowTutor(false)}
        />
      )}

      {/* Exam Mode Stage Clear Notification */}
      {isAnswered && (
        <div className="pixel-box" style={{
          background: '#000',
          border: '4px solid var(--mario-block)',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 0 25px rgba(252, 188, 60, 0.4)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mario-block)', fontFamily: 'var(--font-pixel)', fontSize: '0.85rem', marginBottom: '6px' }}>
              <Award size={18} /> ★ STAGE CLEARED // 關卡驗收通過！
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              {challenge.cpentNote}
            </p>
          </div>

          <button
            className="pixel-btn pixel-btn-gold"
            onClick={() => {
              soundClick();
              onFinishChallenge({ goToNext: true });
            }}
            style={{ fontSize: '0.75rem', padding: '12px 20px', flexShrink: 0 }}
          >
            <span>{hasNext ? '推進下一關卡 ▶' : '完成本世界破關！★'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
