import React, { useState } from 'react';
import { X, RefreshCw, Trash2, Copy, Check } from 'lucide-react';
import { soundClick, soundJump } from '../utils/audio';

export function IncidentLogModal({ isOpen, onClose, incidents, onClearIncidents, onRetryChallenge }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    const text = incidents.map((inc, i) => `### [Koopa Incident #${i + 1}] Stage: ${inc.challengeId}
- 遭遇情境: ${inc.scenario || 'N/A'}
- 錯誤指令: \`${inc.failedOptionText || 'N/A'}\`
- 實戰原理與解析:
${inc.cpentNote || 'N/A'}
`).join('\n\n---\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="pixel-box" style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        background: '#0b0f19',
        border: '4px solid var(--mario-red)',
        boxShadow: '8px 8px 0 #000, 0 0 30px rgba(229, 37, 33, 0.3)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '4px solid #000', paddingBottom: '14px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.95rem', color: 'var(--mario-red)' }}>
              🐢 庫巴失誤筆記本 (INCIDENT LOG / 錯題本)
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              自動收錄撞到障礙或被防火牆反噬的指令紀錄，反覆練習邁向全三星通關！
            </p>
          </div>
          <button 
            className="pixel-btn pixel-btn-secondary"
            onClick={() => { soundClick(); onClose(); }}
            style={{ padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: '#cbd5e1' }}>
            失誤記錄數: {incidents.length}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            {incidents.length > 0 && (
              <>
                <button 
                  className="pixel-btn pixel-btn-secondary"
                  onClick={handleCopyAll}
                  style={{ padding: '6px 10px', fontSize: '0.55rem' }}
                >
                  {copied ? <Check size={12} color="var(--mario-pipe-light)" /> : <Copy size={12} />}
                  <span>{copied ? '已複製筆記' : '匯出 Markdown'}</span>
                </button>
                <button 
                  className="pixel-btn pixel-btn-red"
                  onClick={onClearIncidents}
                  style={{ padding: '6px 10px', fontSize: '0.55rem' }}
                >
                  <Trash2 size={12} />
                  <span>清除</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* List */}
        {incidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#05070d', border: '3px solid #1e293b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⭐</div>
            <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: 'var(--mario-block)', marginBottom: '8px' }}>
              無任何撞刺紀錄！
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              你的滲透跳躍精準無比，尚未在任何關卡觸發警報！
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {incidents.map((inc, index) => (
              <div 
                key={index}
                style={{
                  background: '#05070d',
                  border: '3px solid #334155',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--mario-red)' }}>
                    [INCIDENT #{index + 1}] // {inc.worldId}
                  </span>
                  <button 
                    className="pixel-btn pixel-btn-gold"
                    onClick={() => {
                      soundJump();
                      onRetryChallenge(inc.worldId, inc.challengeId);
                    }}
                    style={{ padding: '4px 8px', fontSize: '0.55rem' }}
                  >
                    <RefreshCw size={10} />
                    <span>重新破關</span>
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '8px' }}>
                  {inc.scenario}
                </div>

                <div style={{
                  background: '#000',
                  padding: '8px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--mario-red)',
                  marginBottom: '10px',
                  borderLeft: '4px solid var(--mario-red)'
                }}>
                  ❌ 撞擊指令: {inc.failedOptionText}
                </div>

                <div style={{
                  background: 'rgba(252, 188, 60, 0.08)',
                  borderLeft: '4px solid var(--mario-block)',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  lineHeight: '1.5'
                }}>
                  <strong style={{ color: 'var(--mario-block)' }}>💡 CPENT 破關原理解析：</strong>
                  <br />
                  {inc.cpentNote}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
