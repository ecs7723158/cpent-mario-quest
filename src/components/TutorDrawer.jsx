import React, { useState } from 'react';
import { BookOpen, Sparkles, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { soundClick, soundPowerUp } from '../utils/audio';

export function TutorDrawer({ challenge, isOpen, onClose }) {
  const [hintTier, setHintTier] = useState(1);
  const [copiedFlag, setCopiedFlag] = useState(null);

  if (!isOpen) return null;

  const guide = challenge.tutorGuide || {};

  const handleCopyCmd = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedFlag(cmd);
    soundPowerUp();
    setTimeout(() => setCopiedFlag(null), 2000);
  };

  return (
    <div className="pixel-box" style={{
      background: '#090d18',
      border: '4px solid var(--mario-block)',
      padding: '16px',
      marginTop: '16px',
      boxShadow: '6px 6px 0 #000'
    }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '3px solid #1e293b',
        paddingBottom: '10px',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>🍄</span>
          <div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: 'var(--mario-block)' }}>
              奇諾比奧導師指導 (TOAD'S OFFENSIVE TUTOR)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              CPENT 實戰滲透指令拆解與作戰引導
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="pixel-btn pixel-btn-secondary"
          style={{ padding: '4px 8px', fontSize: '0.6rem' }}
        >
          收起導師 ▲
        </button>
      </div>

      {/* Grid: Methodology & Pitfalls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '14px' }}>
        
        {/* Offensive Methodology */}
        <div style={{ background: '#05070d', border: '2px solid #1e293b', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', marginBottom: '6px' }}>
            <ShieldCheck size={14} /> 🎯 攻擊思維導航 (METHODOLOGY)
          </div>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            {guide.concept || '依據目標開放端口與架構，選用最精準且符合限時考試標準的指令。'}
          </p>
        </div>

        {/* Exam Pitfalls */}
        <div style={{ background: '#05070d', border: '2px solid #1e293b', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--mario-red)', fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', marginBottom: '6px' }}>
            <AlertTriangle size={14} /> ⚠️ 考試扣分與踩坑提醒 (PITFALLS)
          </div>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            {guide.pitfalls || '注意參數語法完整度，缺少關鍵 flag 將導致工具無有效輸出。'}
          </p>
        </div>

      </div>

      {/* Flags Breakdown Table */}
      {challenge.flagsExplained && challenge.flagsExplained.length > 0 && (
        <div style={{ background: '#05070d', border: '2px solid #1e293b', padding: '12px', marginBottom: '14px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--mario-pipe-light)', marginBottom: '8px' }}>
            🔍 指令參數逐一拆解字典 (COMMAND FLAGS BREAKDOWN):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {challenge.flagsExplained.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '6px 10px',
                  borderLeft: '3px solid var(--mario-pipe-light)'
                }}
              >
                <code style={{
                  color: 'var(--mario-block)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  minWidth: '130px'
                }}>
                  {item.flag}
                </code>
                <div style={{ flex: 1, fontSize: '0.75rem', color: '#94a3b8' }}>
                  <strong style={{ color: '#fff' }}>{item.name}：</strong> {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-Tier Progressive Hints */}
      <div style={{ background: '#05070d', border: '2px solid #1e293b', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--mario-block)' }}>
            💡 三階段漸進式暗示教學 (TIERED HINTS):
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3].map(lvl => (
              <button
                key={lvl}
                onClick={() => { soundClick(); setHintTier(lvl); }}
                className={`pixel-btn ${hintTier === lvl ? 'pixel-btn-gold' : 'pixel-btn-secondary'}`}
                style={{ padding: '2px 8px', fontSize: '0.55rem' }}
              >
                LEVEL {lvl}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          background: 'rgba(252, 188, 60, 0.06)',
          borderLeft: '4px solid var(--mario-block)',
          padding: '10px 14px',
          fontSize: '0.8rem',
          lineHeight: '1.5',
          color: '#e2e8f0',
          fontFamily: 'var(--font-mono)'
        }}>
          {hintTier === 1 && <div><strong>【Tier 1 思路引導】：</strong> {guide.level1Hint}</div>}
          {hintTier === 2 && <div><strong>【Tier 2 關鍵參數】：</strong> {guide.level2Hint}</div>}
          {hintTier === 3 && (
            <div>
              <strong>【Tier 3 完整指令語法】：</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', background: '#000', padding: '6px 10px', border: '1px solid #334155' }}>
                <code style={{ color: 'var(--mario-pipe-light)', flex: 1, wordBreak: 'break-all' }}>
                  {challenge.expectedCommand}
                </code>
                <button
                  onClick={() => handleCopyCmd(challenge.expectedCommand)}
                  className="pixel-btn pixel-btn-green"
                  style={{ padding: '4px 8px', fontSize: '0.55rem' }}
                >
                  {copiedFlag ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedFlag ? '已複製' : '複製'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
