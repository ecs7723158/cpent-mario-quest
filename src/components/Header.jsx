import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Monitor, ShoppingBag, BookOpen, Server, Clock, Award } from 'lucide-react';
import { MARIO_RANKS } from '../data/cpentData';
import { soundCoin, soundClick, soundAlarm } from '../utils/audio';

export function Header({
  player,
  isMuted,
  toggleSound,
  hasScanlines,
  toggleScanlines,
  openShop,
  openLog,
  openDockerLab,
  incidentCount,
  currentWorldName,
  gameMode, // 'practice' | 'exam'
  onToggleMode
}) {
  const currentRank = MARIO_RANKS.slice().reverse().find(r => player.level >= r.minLevel) || MARIO_RANKS[0];
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));

  // Exam mode 120-minute countdown simulation
  const [examSeconds, setExamSeconds] = useState(7200);

  useEffect(() => {
    if (gameMode !== 'exam') return;
    const interval = setInterval(() => {
      setExamSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameMode]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <header className="pixel-box" style={{ marginBottom: '20px', padding: '16px 20px', background: '#0b0f19' }}>
      
      {/* Top Retro Super Mario Bros NES HUD */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        borderBottom: '4px solid #000',
        paddingBottom: '14px',
        marginBottom: '14px',
        fontFamily: 'var(--font-pixel)',
        fontSize: '0.75rem',
        letterSpacing: '1px'
      }}>
        
        {/* Mario & Score */}
        <div>
          <div style={{ color: 'var(--mario-red)', marginBottom: '4px' }}>
            {player.name.toUpperCase()}
          </div>
          <div style={{ color: '#fff', fontSize: '0.85rem' }}>
            {String(player.exp * 100).padStart(6, '0')} PTS
          </div>
        </div>

        {/* Mario Coins */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="mario-coin" style={{ fontSize: '1.1rem' }}>🪙</span>
          <span style={{ color: 'var(--mario-block)', fontSize: '0.85rem' }}>
            x {String(player.credits).padStart(3, '0')}
          </span>
        </div>

        {/* World indicator */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.65rem', marginBottom: '4px' }}>WORLD</div>
          <div style={{ color: 'var(--mario-pipe-light)', fontSize: '0.85rem' }}>
            {currentWorldName ? currentWorldName.split('//')[0].trim() : 'WORLD 1'}
          </div>
        </div>

        {/* Time / Exam Timer */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.65rem', marginBottom: '4px' }}>
            {gameMode === 'exam' ? 'EXAM TIME' : 'FOCUS'}
          </div>
          <div style={{ color: gameMode === 'exam' ? 'var(--mario-red)' : 'var(--neon-cyan)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {gameMode === 'exam' ? (
              <>
                <Clock size={13} /> {formatTimer(examSeconds)}
              </>
            ) : (
              `${player.focus} / ${player.maxFocus}`
            )}
          </div>
        </div>

        {/* Mario Lives / HP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>{currentRank.sprite}</span>
          <div>
            <div style={{ fontSize: '0.65rem', color: currentRank.color }}>LV.{player.level}</div>
            <div style={{ color: player.hp < 30 ? 'var(--mario-red)' : '#fff', fontSize: '0.8rem' }}>
              HP {player.hp}/{player.maxHp}
            </div>
          </div>
        </div>

      </div>

      {/* Secondary Controls & Mode Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        
        {/* Mode Selector Toggle: Practice vs. Real Exam */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#040711', padding: '4px', border: '2px solid #1e293b' }}>
          <button
            onClick={() => { soundClick(); onToggleMode('practice'); }}
            className={`pixel-btn ${gameMode === 'practice' ? 'pixel-btn-green' : 'pixel-btn-secondary'}`}
            style={{ padding: '6px 10px', fontSize: '0.6rem' }}
          >
            🧪 練習暗示教學區
          </button>
          <button
            onClick={() => { soundAlarm(); onToggleMode('exam'); }}
            className={`pixel-btn ${gameMode === 'exam' ? 'pixel-btn-red' : 'pixel-btn-secondary'}`}
            style={{ padding: '6px 10px', fontSize: '0.6rem' }}
          >
            🎯 實際考試模擬區
          </button>
        </div>

        {/* Health bar visual */}
        <div style={{ flex: '1 1 180px', maxWidth: '240px' }}>
          <div style={{
            height: '14px',
            background: '#000',
            border: '2px solid #334155',
            padding: '2px'
          }}>
            <div style={{
              height: '100%',
              width: `${hpPercent}%`,
              background: player.hp < 30 ? 'var(--mario-red)' : 'var(--mario-pipe-light)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Action Buttons: Docker Lab, Shop, Incidents, Audio */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          <button 
            className="pixel-btn pixel-btn-secondary"
            onClick={() => { soundClick(); openDockerLab(); }}
            title="HTB 實機靶機連線中樞 (Docker Compose)"
            style={{ padding: '8px 10px', color: 'var(--neon-cyan)', borderColor: 'var(--neon-cyan)' }}
          >
            <Server size={14} />
            <span>實機靶機</span>
          </button>

          <button 
            className="pixel-btn pixel-btn-gold"
            onClick={() => { soundCoin(); openShop(); }}
            title="開啟奇諾比奧道具屋 (Shop)"
            style={{ padding: '8px 10px' }}
          >
            <ShoppingBag size={14} />
            <span>道具屋</span>
          </button>

          <button 
            className="pixel-btn pixel-btn-red"
            onClick={() => { soundClick(); openLog(); }}
            title="失誤庫巴手冊 (錯題本)"
            style={{ padding: '8px 10px', position: 'relative' }}
          >
            <BookOpen size={14} />
            <span>錯題本</span>
            {incidentCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ffbe0b',
                color: '#000',
                fontSize: '0.55rem',
                padding: '2px 4px',
                border: '2px solid #000'
              }}>
                {incidentCount}
              </span>
            )}
          </button>

          <button 
            className="pixel-btn pixel-btn-secondary"
            onClick={toggleScanlines}
            title="切換 CRT 復古螢幕濾鏡"
            style={{ padding: '8px' }}
          >
            <Monitor size={14} color={hasScanlines ? 'var(--neon-cyan)' : '#64748b'} />
          </button>

          <button 
            className="pixel-btn pixel-btn-secondary"
            onClick={toggleSound}
            title={isMuted ? '解除靜音' : '靜音'}
            style={{ padding: '8px' }}
          >
            {isMuted ? <VolumeX size={14} color="#64748b" /> : <Volume2 size={14} color="var(--mario-pipe-light)" />}
          </button>

        </div>

      </div>

    </header>
  );
}
