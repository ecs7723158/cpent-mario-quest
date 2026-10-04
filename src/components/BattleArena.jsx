import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, ChevronRight, Award, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  soundCoin, soundJump, soundFireball, soundStomp, 
  soundDamage, soundAlarm, soundStageClear, soundPowerUp, soundClick 
} from '../utils/audio';

export function BattleArena({
  world,
  challengeIndex,
  onFinishChallenge,
  onExitArena,
  player,
  inventory,
  onUseItem
}) {
  const challenge = world.challenges[challengeIndex] || world.challenges[0];
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [targetHp, setTargetHp] = useState(100);
  const [marioAction, setMarioAction] = useState('idle'); // 'idle' | 'attack' | 'hurt' | 'clear'
  const [bossAction, setBossAction] = useState('idle'); // 'idle' | 'hurt'
  const [battleLogs, setBattleLogs] = useState([]);
  const [disabledOptions, setDisabledOptions] = useState([]);

  // Check equipped gear
  const hasFireFlower = inventory.some(i => i.id === 'item_fire_flower' && i.equipped);
  const hasGreenPipe = inventory.some(i => i.id === 'item_green_pipe' && i.equipped);

  useEffect(() => {
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setShowHint(false);
    setTargetHp(100);
    setMarioAction('idle');
    setBossAction('idle');

    setBattleLogs([
      `[★ WORLD ${world.worldNum} - ${challenge.stage}] 遭遇守衛: ${world.bossName}`,
      `[+] 目標主機: ${challenge.targetHost} [OS: ${challenge.targetOS}]`,
      `[?] 踩下問號磚塊或發射精準 Exploit 指令進行攻擊！`
    ]);

    // Green Pipe gear bonus: eliminate 1 decoy in Pivot world
    if (hasGreenPipe && world.id === 'world_3') {
      const wrong = challenge.options
        .map((opt, i) => (!opt.isCorrect ? i : null))
        .filter(i => i !== null);
      if (wrong.length > 0) {
        setDisabledOptions([wrong[0]]);
        setBattleLogs(prev => [
          ...prev,
          `[*] 【綠色水管被動生效】已為你排除干擾指令 #${wrong[0] + 1}！`
        ]);
      }
    } else {
      setDisabledOptions([]);
    }
  }, [challengeIndex, world.id]);

  const handleSelectOption = (index) => {
    if (isAnswered || disabledOptions.includes(index)) return;
    setSelectedOptionIndex(index);
    setIsAnswered(true);

    const chosen = challenge.options[index];

    if (chosen.isCorrect) {
      soundFireball();
      setMarioAction('attack');
      setBossAction('hurt');

      setTimeout(() => {
        soundStomp();
        soundCoin();
        setTargetHp(0);
      }, 250);

      setTimeout(() => {
        setMarioAction('clear');
        soundStageClear();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }, 700);

      setBattleLogs(prev => [
        ...prev,
        `> EXPLOIT LAUNCHED: ${chosen.text}`,
        `[★ STAGE HIT!] ${chosen.feedback}`,
        `[+] 獲得 100 積分金幣與 30 EXP！`
      ]);

      onFinishChallenge({
        success: true,
        challengeId: challenge.id,
        worldId: world.id,
        isCritical: chosen.isCritical || hasFireFlower,
        cpentNote: challenge.cpentNote
      });

    } else {
      soundDamage();
      soundAlarm();
      setMarioAction('hurt');
      setTimeout(() => setMarioAction('idle'), 600);

      const damage = 25;
      setBattleLogs(prev => [
        ...prev,
        `> EXPLOIT FAILED: ${chosen.text}`,
        `[!] 撞擊到守衛尖刺！${chosen.feedback}`,
        `[-] 扣除 ${damage} HP！`
      ]);

      onFinishChallenge({
        success: false,
        challengeId: challenge.id,
        worldId: world.id,
        damageTaken: damage,
        failedOptionText: chosen.text,
        scenario: challenge.scenario,
        cpentNote: challenge.cpentNote
      });
    }
  };

  const handleOpenHint = () => {
    if (showHint || player.focus < 10) return;
    soundPowerUp();
    setShowHint(true);
    onUseItem('spend_focus_hint', 10);
    setBattleLogs(prev => [
      ...prev,
      `[🍄 問號磚塊開啟] 消耗 10 Focus 取得提示: ${challenge.hint}`
    ]);
  };

  const hasNext = challengeIndex < world.challenges.length - 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Stage Banner & Back Button */}
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

        <div style={{ textAlign: 'right' }}>
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.65rem',
            padding: '4px 8px',
            border: '2px solid #000',
            background: challenge.difficulty === 'Hard' ? 'var(--mario-red)' : 'var(--mario-block)',
            color: challenge.difficulty === 'Hard' ? '#fff' : '#000'
          }}>
            {challenge.difficulty} STAGE
          </span>
        </div>
      </div>

      {/* Mario VS Boss Battleground Arena */}
      <div className="pixel-box" style={{
        background: world.skyBg,
        minHeight: '220px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderBottom: '8px solid var(--mario-brick)'
      }}>
        
        {/* Floating Question Mark Block for Hint */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleOpenHint}
            disabled={showHint || player.focus < 10 || isAnswered}
            className="mario-qblock"
            title="點擊頂開問號磚塊獲得提示 (-10 Focus)"
            style={{
              cursor: showHint ? 'default' : 'pointer',
              opacity: showHint ? 0.6 : 1
            }}
          >
            {showHint ? '✓' : '?'}
          </button>
        </div>

        {/* Mario & Boss Characters confrontation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 40px' }}>
          
          {/* Mario Sprite */}
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

          {/* Boss Sprite & Health */}
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

      {/* Challenge Scenario & 4 Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(280px, 0.8fr)', gap: '16px' }}>
        
        {/* Left: Challenge & Options */}
        <div className="pixel-box" style={{ padding: '20px', background: '#0b0f19' }}>
          
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: '#fff', marginBottom: '12px', lineHeight: '1.5' }}>
            {challenge.title}
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            borderLeft: `4px solid ${world.themeColor}`,
            padding: '12px 14px',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            color: '#e2e8f0',
            marginBottom: '16px'
          }}>
            {challenge.scenario}
          </div>

          {showHint && (
            <div style={{
              background: 'rgba(252, 188, 60, 0.1)',
              border: '2px dashed var(--mario-block)',
              padding: '10px 14px',
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.65rem',
              color: 'var(--mario-block)',
              marginBottom: '14px',
              lineHeight: '1.6'
            }}>
              💡 [HINT] {challenge.hint}
            </div>
          )}

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {challenge.options.map((opt, idx) => {
              const isDisabled = disabledOptions.includes(idx);
              const isSelected = selectedOptionIndex === idx;

              let btnClass = 'pixel-btn-secondary';
              if (isAnswered) {
                if (opt.isCorrect) btnClass = 'pixel-btn-green';
                else if (isSelected && !opt.isCorrect) btnClass = 'pixel-btn-red';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered || isDisabled}
                  onClick={() => handleSelectOption(idx)}
                  className={`pixel-btn ${btnClass}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    textAlign: 'left',
                    padding: '12px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    opacity: isDisabled ? 0.35 : 1
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem' }}>
                    [{idx + 1}]
                  </span>
                  <span style={{ flex: 1, wordBreak: 'break-all', lineHeight: '1.4' }}>
                    {isDisabled ? `[PIPE FILTERED] ${opt.text}` : opt.text}
                  </span>
                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 size={16} color="#000" style={{ flexShrink: 0 }} />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <XCircle size={16} color="#fff" style={{ flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* CPENT Study Notes banner after answer */}
          {isAnswered && (
            <div style={{
              background: '#000',
              border: '3px solid var(--mario-block)',
              padding: '16px',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mario-block)', fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', marginBottom: '8px' }}>
                <Award size={14} /> CPENT 破關筆記 (EXAM INTEL)
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                {challenge.cpentNote}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                <button
                  className="pixel-btn pixel-btn-gold"
                  onClick={() => {
                    soundClick();
                    onFinishChallenge({ goToNext: true });
                  }}
                  style={{ fontSize: '0.7rem' }}
                >
                  <span>{hasNext ? '推進下一關卡 ▶' : '完成本世界破關！★'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right: Retro Terminal Combat Log */}
        <div className="pixel-box" style={{ padding: '16px', background: '#0b0f19', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.65rem',
            color: 'var(--mario-pipe-light)',
            borderBottom: '2px solid #334155',
            paddingBottom: '8px',
            marginBottom: '10px'
          }}>
            // MARIO EXPLOIT LOG
          </div>

          <div style={{
            flex: 1,
            minHeight: '260px',
            maxHeight: '380px',
            overflowY: 'auto',
            background: '#000',
            border: '2px solid #1e293b',
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            color: '#a7f3d0'
          }}>
            {battleLogs.map((log, i) => (
              <div 
                key={i}
                style={{
                  color: log.startsWith('[!]') || log.startsWith('[-]') ? 'var(--mario-red)' : log.startsWith('[★') || log.startsWith('[+]') ? 'var(--mario-pipe-light)' : '#cbd5e1',
                  marginBottom: '4px',
                  wordBreak: 'break-all'
                }}
              >
                {log}
              </div>
            ))}
          </div>

          {/* Quick Item Drawer */}
          <div style={{ marginTop: '12px', borderTop: '2px solid #334155', paddingTop: '10px' }}>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: '#64748b', marginBottom: '8px' }}>
              // 快速補給 (ITEMS):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                className="pixel-btn pixel-btn-secondary"
                disabled={player.hp >= player.maxHp}
                onClick={() => { soundPowerUp(); onUseItem('item_mushroom'); }}
                style={{ padding: '6px 4px', fontSize: '0.55rem' }}
              >
                🍄 補血 (+50 HP)
              </button>
              <button
                className="pixel-btn pixel-btn-secondary"
                disabled={player.focus >= player.maxFocus}
                onClick={() => { soundPowerUp(); onUseItem('item_starman'); }}
                style={{ padding: '6px 4px', fontSize: '0.55rem' }}
              >
                ⭐ 專注 (+35)
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
