import React, { useState } from 'react';
import { MARIO_WORLDS } from '../data/cpentData';
import { soundCoin, soundPipe } from '../utils/audio';

export function WorldMap({ onSelectWorld, domainStats }) {
  const [selectedWorldId, setSelectedWorldId] = useState(MARIO_WORLDS[0].id);
  const activeWorld = MARIO_WORLDS.find(w => w.id === selectedWorldId) || MARIO_WORLDS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* World Select Header Tabs (World 1 ~ World 6) */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        borderBottom: '4px solid #000'
      }}>
        {MARIO_WORLDS.map(world => {
          const isSelected = world.id === selectedWorldId;
          const stat = domainStats[world.id] || { solved: 0, total: world.challenges.length };
          const isAllCleared = stat.solved >= stat.total && stat.total > 0;

          return (
            <button
              key={world.id}
              onClick={() => {
                soundCoin();
                setSelectedWorldId(world.id);
              }}
              className={`pixel-btn ${isSelected ? 'pixel-btn-gold' : 'pixel-btn-secondary'}`}
              style={{
                flex: '0 0 auto',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderColor: isAllCleared ? 'var(--mario-pipe-light)' : '#000'
              }}
            >
              <span>WORLD {world.worldNum}</span>
              {isAllCleared && <span style={{ color: 'var(--mario-pipe-light)' }}>★</span>}
            </button>
          );
        })}
      </div>

      {/* Main World Overworld Screen */}
      <div className="pixel-box" style={{
        padding: '24px',
        background: activeWorld.skyBg,
        minHeight: '360px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* World Header Info */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.75)',
          border: '3px solid #000',
          padding: '12px 18px',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.85rem', color: activeWorld.themeColor, marginBottom: '4px' }}>
              {activeWorld.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              {activeWorld.description}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.7rem',
              color: 'var(--mario-block)',
              background: '#000',
              padding: '4px 8px',
              border: '2px solid #000'
            }}>
              BOSS: {activeWorld.bossName}
            </span>
          </div>
        </div>

        {/* Mario Stage Progression Path (Like SMB3 / Super Mario World Overworld) */}
        <div style={{
          margin: '40px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
          flexWrap: 'wrap',
          zIndex: 2
        }}>
          {activeWorld.challenges.map((chal, idx) => {
            const isCleared = (domainStats[activeWorld.id]?.solved || 0) > idx;
            const isCurrent = (domainStats[activeWorld.id]?.solved || 0) === idx;
            const isCastle = chal.stage.includes('🏰') || idx === activeWorld.challenges.length - 1 && activeWorld.challenges.length > 1;

            return (
              <React.Fragment key={chal.id}>
                {idx > 0 && (
                  <div style={{
                    width: '32px',
                    height: '8px',
                    background: isCleared ? 'var(--mario-pipe-light)' : '#000',
                    border: '2px solid #000',
                    boxShadow: '2px 2px 0 #000'
                  }} />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  {isCurrent && (
                    <div style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: '0.65rem',
                      color: 'var(--mario-red)',
                      animation: 'coinSpin 1s infinite alternate'
                    }}>
                      ▼ MARIO
                    </div>
                  )}

                  <div 
                    className={`stage-node ${isCleared ? 'stage-node-cleared' : isCurrent ? 'stage-node-active' : 'stage-node-locked'}`}
                    style={{
                      width: isCastle ? '62px' : '52px',
                      height: isCastle ? '62px' : '52px'
                    }}
                  >
                    <div style={{ fontSize: isCastle ? '1.2rem' : '0.75rem' }}>
                      {isCastle ? '🏰' : chal.stage}
                    </div>
                    {isCleared && (
                      <span style={{ fontSize: '0.55rem', color: '#000', fontWeight: 'bold' }}>
                        ★ CLEAR
                      </span>
                    )}
                  </div>

                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#cbd5e1', maxWidth: '80px', textAlign: 'center' }}>
                    {chal.title.split('：')[0].slice(0, 8)}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Warp Pipe & Ground Floor Texture */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '6px solid var(--mario-brick)',
          paddingTop: '16px',
          background: 'rgba(0, 0, 0, 0.4)',
          margin: '0 -24px -24px -24px',
          padding: '16px 24px',
          zIndex: 2
        }}>
          
          {/* Decorative Green Warp Pipe */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
            <div>
              <div className="mario-pipe-rim" style={{ width: '56px', height: '18px' }} />
              <div className="mario-pipe-body" style={{ width: '48px', height: '36px', margin: '0 auto' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: '#fff' }}>
              <div>[?] 破關條件：</div>
              <div style={{ color: 'var(--mario-block)', marginTop: '4px' }}>
                精準選用 CPENT 滲透指令擊潰所有關卡守衛
              </div>
            </div>
          </div>

          {/* Launch Stage Button */}
          <button
            className="pixel-btn pixel-btn-red"
            onClick={() => {
              soundPipe();
              onSelectWorld(activeWorld);
            }}
            style={{ fontSize: '0.75rem', padding: '14px 22px' }}
          >
            <span>進入 {activeWorld.stageCode} 破關！</span>
            <span>▶</span>
          </button>

        </div>

      </div>

    </div>
  );
}
