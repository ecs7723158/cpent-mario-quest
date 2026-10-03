import React from 'react';
import { CPENT_ZONES } from '../data/cpentData';
import { Network, Shuffle, Compass, Cpu, Terminal, Trophy, ChevronRight, Lock } from 'lucide-react';
import { soundClick } from '../utils/audio';

const iconMap = {
  Network: Network,
  Shuffle: Shuffle,
  Compass: Compass,
  Cpu: Cpu,
  Terminal: Terminal,
  Trophy: Trophy
};

export function ZoneSelector({ onSelectZone, domainStats, playerLevel }) {
  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff', letterSpacing: '1px' }}>
            // 實戰滲透網段選擇 (TARGET SUBNETS)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            請選擇欲入侵的目標網段以展開滲透攻防。每個網段包含真實 CPENT 題庫與 Boss 節點。
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '16px'
      }}>
        {CPENT_ZONES.map((zone, index) => {
          const IconComponent = iconMap[zone.icon] || Network;
          const stat = domainStats[zone.id] || { solved: 0, total: zone.challenges.length };
          const isComplete = stat.solved >= stat.total && stat.total > 0;
          const progressPercent = Math.min(100, (stat.solved / stat.total) * 100);

          return (
            <div 
              key={zone.id}
              className="cyber-card cyber-cut"
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderColor: isComplete ? 'var(--neon-green)' : 'var(--border-subtle)',
                background: zone.bgGradient
              }}
              onClick={() => {
                soundClick();
                onSelectZone(zone);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.5)',
                    border: `1px solid ${zone.themeColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 12px ${zone.themeColor}40`
                  }}>
                    <IconComponent size={20} color={zone.themeColor} />
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: zone.themeColor, fontWeight: 'bold' }}>
                      {zone.code}
                    </span>
                    <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: '600' }}>
                      {zone.name.split('//')[1] || zone.name}
                    </h3>
                  </div>
                </div>

                {isComplete && (
                  <span className="cyber-badge" style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)' }}>
                    PWNED 100%
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '16px', minHeight: '36px' }}>
                {zone.description}
              </p>

              {/* Boss Info */}
              <div style={{ 
                background: 'rgba(0,0,0,0.4)', 
                padding: '8px 12px', 
                borderRadius: '4px', 
                marginBottom: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                borderLeft: `3px solid ${zone.themeColor}`
              }}>
                <span style={{ color: 'var(--text-muted)' }}>網段守護主神 (Boss):</span>
                <span style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{zone.bossName}</span>
              </div>

              {/* Progress & Enter Button */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>攻陷進度 (BREACHED)</span>
                  <span style={{ color: zone.themeColor }}>{stat.solved} / {stat.total}</span>
                </div>
                <div className="stat-bar-track" style={{ marginBottom: '14px' }}>
                  <div 
                    className="stat-bar-fill" 
                    style={{ 
                      width: `${progressPercent}%`, 
                      background: zone.themeColor,
                      boxShadow: `0 0 8px ${zone.themeColor}60`
                    }} 
                  />
                </div>

                <button 
                  className="cyber-btn cyber-btn-cyan" 
                  style={{ width: '100%', fontSize: '0.8rem' }}
                >
                  <span>進入滲透節點</span>
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
