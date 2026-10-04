import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft, Flag, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import { soundClick, soundFireball, soundDamage, soundCoin } from '../utils/audio';

export function TerminalCLI({
  challenge,
  mode, // 'practice' | 'exam'
  onExecuteCommand,
  onSubmitFlag,
  terminalLogs,
  isSolved
}) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx + 1 < history.length ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabComplete();
    }
  };

  const handleTabComplete = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      if (challenge.expectedCommand) {
        const firstToken = challenge.expectedCommand.split(' ')[0];
        setInputVal(firstToken + ' ');
      }
      return;
    }
    // Autocomplete matching keyword
    const match = challenge.commandKeywords.find(kw => kw.toLowerCase().startsWith(trimmed.toLowerCase()));
    if (match) {
      setInputVal(match + ' ');
    } else if (challenge.expectedCommand.toLowerCase().startsWith(trimmed.toLowerCase())) {
      setInputVal(challenge.expectedCommand);
    }
  };

  const handleSubmit = () => {
    const cmd = inputVal.trim();
    if (!cmd) return;

    setHistory(prev => [...prev, cmd]);
    setHistoryIdx(-1);
    setInputVal('');

    // Check if it's a flag submission: flag{...}
    if (cmd.startsWith('flag{') || cmd.startsWith('FLAG{')) {
      onSubmitFlag(cmd);
      return;
    }

    onExecuteCommand(cmd);
  };

  const handleInsertToken = (token) => {
    soundClick();
    setInputVal(prev => (prev ? `${prev} ${token}` : token));
    inputRef.current?.focus();
  };

  return (
    <div className="pixel-box" style={{ background: '#070a12', border: '3px solid #1e293b', padding: '0', display: 'flex', flexDirection: 'column' }}>
      
      {/* Terminal Top Chrome Bar */}
      <div style={{
        background: '#0e1526',
        borderBottom: '2px solid #1e293b',
        padding: '8px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbe0b' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00e800' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', marginLeft: '6px' }}>
            root@kali-offensive:~# {mode === 'exam' ? '[PROCTORED EXAM ENVIRONMENT]' : '[PRACTICE LAB CLI]'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.6rem',
            padding: '2px 6px',
            background: mode === 'exam' ? 'var(--mario-red)' : 'var(--mario-pipe-light)',
            color: mode === 'exam' ? '#fff' : '#000',
            border: '1px solid #000'
          }}>
            {mode === 'exam' ? 'EXAM MODE' : 'TUTOR MODE'}
          </span>
        </div>
      </div>

      {/* Terminal Log Screen */}
      <div style={{
        height: '240px',
        overflowY: 'auto',
        padding: '12px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        lineHeight: '1.6',
        color: '#e2e8f0',
        background: '#04060a'
      }}>
        {terminalLogs.map((log, idx) => (
          <div 
            key={idx}
            style={{
              color: log.type === 'error' ? '#ff5555' :
                     log.type === 'success' ? '#00e800' :
                     log.type === 'cmd' ? '#00f3ff' :
                     log.type === 'tutor' ? '#ffbe0b' : '#94a3b8',
              marginBottom: '3px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            {log.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Parameter Helper Chips (Practice Mode only) */}
      {mode === 'practice' && !isSolved && (
        <div style={{
          background: '#090e1a',
          borderTop: '1px solid #1e293b',
          borderBottom: '1px solid #1e293b',
          padding: '6px 12px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-pixel)', color: '#64748b' }}>
            快速指令片語:
          </span>
          {challenge.commandKeywords.map((kw, i) => (
            <button
              key={i}
              onClick={() => handleInsertToken(kw)}
              className="pixel-btn pixel-btn-secondary"
              style={{ padding: '3px 7px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', textTransform: 'none' }}
              title="點擊插入此關鍵參數"
            >
              + {kw}
            </button>
          ))}
          <button
            onClick={() => handleInsertToken(challenge.expectedCommand)}
            className="pixel-btn pixel-btn-gold"
            style={{ padding: '3px 8px', fontSize: '0.6rem', marginLeft: 'auto' }}
            title="貼上完整指令"
          >
            <Sparkles size={11} /> 帶入完整指令
          </button>
        </div>
      )}

      {/* Input Prompt Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 14px',
        background: '#080d1a',
        gap: '8px'
      }}>
        <span style={{ color: 'var(--mario-pipe-light)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 'bold' }}>
          root@kali:~#
        </span>

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSolved}
          placeholder={mode === 'exam' ? '請輸入實戰滲透指令，或直接提交 flag{...}' : '輸入實戰指令或按 Tab 自動補齊...'}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={!inputVal.trim() || isSolved}
          className="pixel-btn pixel-btn-green"
          style={{ padding: '6px 12px', fontSize: '0.65rem' }}
        >
          <CornerDownLeft size={12} />
          <span>執行</span>
        </button>

        {challenge.flag && (
          <button
            onClick={() => {
              if (inputVal.trim()) {
                onSubmitFlag(inputVal.trim());
                setInputVal('');
              } else {
                setInputVal(challenge.flag);
              }
            }}
            disabled={isSolved}
            className="pixel-btn pixel-btn-gold"
            style={{ padding: '6px 10px', fontSize: '0.6rem' }}
            title="提交捕獲之 CTF Flag"
          >
            <Flag size={11} />
            <span>提交 Flag</span>
          </button>
        )}
      </div>

    </div>
  );
}
