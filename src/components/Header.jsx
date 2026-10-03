import React from 'react';
import { Volume2, VolumeX, Monitor, ShoppingBag, BookOpen, Heart, Zap } from 'lucide-react';
import { MARIO_RANKS } from '../data/cpentData';
import { soundCoin, soundClick } from '../utils/audio';

export function Header({
  player,
  isMuted,
  toggleSound,
  hasScanlines,
  toggleScanlines,
  openShop,
  openLog,
  incidentCount,
  currentWorldName
}) {
  const currentRank = MARIO_RANKS.slice().reverse().find(r => player.level >= r.minLevel) || MARIO_RANKS[0];
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));

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

        {/* Time / Focus */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.65rem', marginBottom: '4px' }}>FOCUS</div>
          <div style={{ color: 'var(--neon-cyan)', fontSize: '0.85rem' }}>
            {player.focus} / {player.maxFocus}
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

      {/* Secondary Controls & Action Drawer */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        
        {/* Title Rank Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="mario-qblock" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
            ?
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: currentRank.color }}>
              {currentRank.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              CPENT 滲透闖關地下城 • 8-Bit Edition
            </div>
          </div>
        </div>

        {/* Health bar visual */}
        <div style={{ flex: '1 1 200px', maxWidth: '300px' }}>
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          <button 
            className="pixel-btn pixel-btn-gold"
            onClick={() => { soundCoin(); openShop(); }}
            title="開啟奇諾比奧道具屋 (Shop)"
            style={{ padding: '8px 12px' }}
          >
            <ShoppingBag size={14} />
            <span>道具屋</span>
          </button>

          <button 
            className="pixel-btn pixel-btn-red"
            onClick={() => { soundClick(); openLog(); }}
            title="失誤庫巴手冊 (錯題本)"
            style={{ padding: '8px 12px', position: 'relative' }}
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
