import React, { useState } from 'react';
import { X, Server, Terminal, Play, RotateCcw, Copy, Check, ExternalLink, ShieldAlert } from 'lucide-react';
import { soundClick, soundPowerUp } from '../utils/audio';

export function DockerLabModal({ isOpen, onClose, currentWorld }) {
  const [copiedText, setCopiedText] = useState(null);
  const [isSpawning, setIsSpawning] = useState(false);
  const [labStatus, setLabStatus] = useState('ONLINE');
  const [ipAddress, setIpAddress] = useState(currentWorld?.targetIp || '10.10.10.200');

  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    soundPowerUp();
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleResetTarget = () => {
    soundClick();
    setIsSpawning(true);
    setLabStatus('REBOOTING...');
    setTimeout(() => {
      setIsSpawning(false);
      setLabStatus('ONLINE');
      soundPowerUp();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="pixel-box" style={{
        width: '100%',
        maxWidth: '740px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        background: '#0b0f19',
        border: '4px solid var(--neon-cyan)',
        boxShadow: '8px 8px 0 #000, 0 0 40px rgba(0, 243, 255, 0.3)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '4px solid #000', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={24} color="var(--neon-cyan)" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.95rem', color: 'var(--neon-cyan)' }}>
                HTB 實機靶機連線中樞 (DOCKER LAB SPAWNER)
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                Hack The Box 風格實體容器靶機生成與本機 Kali 橋接控制台
              </p>
            </div>
          </div>
          <button 
            className="pixel-btn pixel-btn-secondary"
            onClick={() => { soundClick(); onClose(); }}
            style={{ padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Machine Status Dashboard (HTB Style) */}
        <div style={{
          background: '#040711',
          border: '3px solid #1e293b',
          padding: '16px',
          marginBottom: '18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: '#64748b', marginBottom: '4px' }}>
              TARGET MACHINE
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>
              {currentWorld?.dockerService || 'cpent-target-vm'}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: '#64748b', marginBottom: '4px' }}>
              TARGET IP
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--mario-pipe-light)', fontWeight: 'bold' }}>
              {ipAddress}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: '#64748b', marginBottom: '4px' }}>
              STATUS
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.65rem',
              color: labStatus === 'ONLINE' ? '#00e800' : '#ffbe0b'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: labStatus === 'ONLINE' ? '#00e800' : '#ffbe0b', display: 'inline-block' }} />
              {labStatus}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={handleResetTarget}
              disabled={isSpawning}
              className="pixel-btn pixel-btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.55rem' }}
            >
              <RotateCcw size={12} />
              <span>{isSpawning ? '重啟中...' : '重置靶機'}</span>
            </button>
          </div>
        </div>

        {/* Dual Mode Access Methods */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
          
          {/* Method A: In-Browser Simulated Terminal */}
          <div style={{ background: '#05070d', border: '2px solid var(--mario-pipe-light)', padding: '14px' }}>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--mario-pipe-light)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={14} /> 方案 A: 瀏覽器虛擬終端 (即開即練)
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '10px' }}>
              無須配置任何環境，直接在遊戲畫面下方的 Terminal 鍵入真實指令，模擬 Nmap、Impacket、Ligolo-ng 的完整標準輸出。
            </p>
            <div style={{
              background: '#000',
              padding: '6px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: '#00e800',
              border: '1px solid #1e293b'
            }}>
              $ 點擊下方終端直接輸入指令
            </div>
          </div>

          {/* Method B: Local Docker Compose Real Lab */}
          <div style={{ background: '#05070d', border: '2px solid var(--neon-cyan)', padding: '14px' }}>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--neon-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={14} /> 方案 B: 本機 Docker 實機靶機 (實體連線)
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '10px' }}>
              已為您在專案提供 `labs/docker-compose.yml`，包含本機真實 Samba AD、Modbus 模擬器、Brainpan x86 靶機與本地 Kali 橋接。
            </p>
            <button
              onClick={() => handleCopy('docker compose -f labs/docker-compose.yml up -d')}
              className="pixel-btn pixel-btn-gold"
              style={{ width: '100%', padding: '6px', fontSize: '0.55rem' }}
            >
              {copiedText?.includes('docker') ? <Check size={12} /> : <Copy size={12} />}
              <span>複製 Docker Compose 啟動指令</span>
            </button>
          </div>

        </div>

        {/* Quick Connection Strings */}
        <div style={{ background: '#05070d', border: '2px solid #1e293b', padding: '14px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--mario-block)', marginBottom: '8px' }}>
            // 實戰常用連線指令快速複製 (HTB QUICK STRINGS):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Nmap SYN 全端口探測', cmd: `nmap -sS -p- --min-rate 2000 -Pn ${ipAddress}` },
              { label: 'Impacket GetUserSPNs 提取', cmd: `impacket-GetUserSPNs corp.local/guest01:Password123 -dc-ip ${ipAddress} -request` },
              { label: 'Ligolo-ng 本機路由轉發', cmd: `sudo ip route add 172.16.50.0/24 dev ligolo` }
            ].map((s, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#000',
                  padding: '6px 12px',
                  border: '1px solid #1e293b'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  <span style={{ color: '#64748b' }}>[{s.label}] </span>
                  <span style={{ color: '#e2e8f0' }}>{s.cmd}</span>
                </div>
                <button
                  onClick={() => handleCopy(s.cmd)}
                  className="pixel-btn pixel-btn-secondary"
                  style={{ padding: '3px 7px', fontSize: '0.55rem' }}
                >
                  {copiedText === s.cmd ? <Check size={10} color="#00e800" /> : <Copy size={10} />}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
