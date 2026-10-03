import React from 'react';

export function RadarChart({ domainStats }) {
  // 6 Worlds for Mario CPENT
  const domains = [
    { key: 'world_1', label: 'W1 邊界', short: 'RECON' },
    { key: 'world_2', label: 'W2 AD域控', short: 'AD' },
    { key: 'world_3', label: 'W3 隧道', short: 'PIVOT' },
    { key: 'world_4', label: 'W4 工控', short: 'OT' },
    { key: 'world_5', label: 'W5 逆向', short: 'BIN' },
    { key: 'world_6', label: 'W6 提權', short: 'CTF' }
  ];

  const size = 260;
  const center = size / 2;
  const radius = 95;
  const total = domains.length;

  const getCoordinates = (index, valuePercent) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = radius * (valuePercent / 100);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = gridLevels.map(lvl => {
    const points = domains.map((_, i) => {
      const { x, y } = getCoordinates(i, lvl);
      return `${x},${y}`;
    }).join(' ');
    return { lvl, points };
  });

  const statPoints = domains.map((d, i) => {
    const stat = domainStats[d.key] || { solved: 0, total: 3 };
    const percent = Math.min(100, Math.max(15, (stat.solved / Math.max(1, stat.total)) * 100));
    const { x, y } = getCoordinates(i, percent);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="pixel-box" style={{ padding: '16px', background: '#0b0f19', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--mario-block)' }}>
          ★ 六大世界能力星圖
        </h3>
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#64748b' }}>
          RADAR
        </span>
      </div>

      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="marioStarFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fcbc3c" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#e52521" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Web grid polygons */}
          {gridPolygons.map(({ lvl, points }) => (
            <polygon 
              key={lvl} 
              points={points} 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.12)" 
              strokeWidth="2" 
              strokeDasharray={lvl === 100 ? 'none' : '3,3'}
            />
          ))}

          {/* Axis lines */}
          {domains.map((_, i) => {
            const outer = getCoordinates(i, 100);
            return (
              <line 
                key={i} 
                x1={center} 
                y1={center} 
                x2={outer.x} 
                y2={outer.y} 
                stroke="rgba(252, 188, 60, 0.25)" 
                strokeWidth="1.5" 
              />
            );
          })}

          {/* Player stats filled area */}
          <polygon 
            points={statPoints} 
            fill="url(#marioStarFill)" 
            stroke="var(--mario-block)" 
            strokeWidth="3" 
            style={{ filter: 'drop-shadow(0 0 8px rgba(252, 188, 60, 0.7))' }}
          />

          {/* Dots on points */}
          {domains.map((d, i) => {
            const stat = domainStats[d.key] || { solved: 0, total: 3 };
            const percent = Math.min(100, Math.max(15, (stat.solved / Math.max(1, stat.total)) * 100));
            const { x, y } = getCoordinates(i, percent);
            return (
              <circle 
                key={i} 
                cx={x} 
                cy={y} 
                r="4.5" 
                fill="#ffffff" 
                stroke="#e52521" 
                strokeWidth="2" 
              />
            );
          })}

          {/* Labels on outer edge */}
          {domains.map((d, i) => {
            const { x, y } = getCoordinates(i, 122);
            return (
              <text 
                key={i} 
                x={x} 
                y={y + 4} 
                textAnchor="middle" 
                fill="#cbd5e1" 
                fontSize="8" 
                fontFamily="var(--font-pixel)"
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Mini Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', width: '100%', marginTop: '8px' }}>
        {domains.map(d => {
          const stat = domainStats[d.key] || { solved: 0, total: 3 };
          return (
            <div key={d.key} style={{ textAlign: 'center', background: '#000', border: '1px solid #1e293b', padding: '4px' }}>
              <div style={{ fontSize: '0.55rem', color: '#64748b', fontFamily: 'var(--font-pixel)' }}>{d.short}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: stat.solved > 0 ? 'var(--mario-pipe-light)' : '#64748b', fontFamily: 'var(--font-pixel)', marginTop: '2px' }}>
                {stat.solved}/{stat.total}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
