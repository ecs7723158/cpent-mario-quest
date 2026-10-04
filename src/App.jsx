import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MARIO_WORLDS } from './data/cpentData';
import { Header } from './components/Header';
import { WorldMap } from './components/WorldMap';
import { BattleArena } from './components/BattleArena';
import { RadarChart } from './components/RadarChart';
import { InventoryModal } from './components/InventoryModal';
import { IncidentLogModal } from './components/IncidentLogModal';
import { DockerLabModal } from './components/DockerLabModal';
import { 
  setSoundMuted, soundPowerUp, 
  soundStageClear, soundClick 
} from './utils/audio';

const STORAGE_KEY = 'cpent_mario_rpg_state_v3';

const defaultPlayer = {
  name: 'MARIO',
  level: 1,
  exp: 0,
  expToNext: 80,
  hp: 100,
  maxHp: 100,
  focus: 50,
  maxFocus: 50,
  credits: 150 // Starting coins
};

export default function App() {
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.player || defaultPlayer;
      } catch { /* ignore corrupt localStorage */ }
    }
    return defaultPlayer;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.inventory || [];
      } catch { /* ignore corrupt localStorage */ }
    }
    return [
      { id: 'item_mushroom', name: '超級紅蘑菇', count: 1 }
    ];
  });

  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.incidents || [];
      } catch { /* ignore corrupt localStorage */ }
    }
    return [];
  });

  const [domainStats, setDomainStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.domainStats) return parsed.domainStats;
      } catch { /* ignore corrupt localStorage */ }
    }
    const initial = {};
    MARIO_WORLDS.forEach(w => {
      initial[w.id] = { solved: 0, total: w.challenges.length };
    });
    return initial;
  });

  const [currentView, setCurrentView] = useState('map'); // 'map' | 'battle'
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  // New Modes: 'practice' (練習暗示教學區) vs 'exam' (實際考試模擬區)
  const [gameMode, setGameMode] = useState('practice');

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isDockerLabOpen, setIsDockerLabOpen] = useState(false);
  const [hasScanlines, setHasScanlines] = useState(true);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const stateToSave = { player, inventory, incidents, domainStats, gameMode };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [player, inventory, incidents, domainStats, gameMode]);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
    soundClick();
  };

  const toggleScanlines = () => {
    soundClick();
    setHasScanlines(prev => !prev);
  };

  const handleSelectWorld = (world) => {
    setSelectedWorld(world);
    setCurrentChallengeIndex(0);
    setCurrentView('battle');
  };

  const handleExitArena = () => {
    setCurrentView('map');
    setSelectedWorld(null);
  };

  const handleFinishChallenge = (result) => {
    if (result.goToNext) {
      if (selectedWorld && currentChallengeIndex < selectedWorld.challenges.length - 1) {
        setCurrentChallengeIndex(prev => prev + 1);
      } else {
        // WORLD CLEARED!
        soundStageClear();
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 }
        });
        handleExitArena();
      }
      return;
    }

    if (result.success) {
      const expGain = result.isCritical ? 45 : 30;
      const coinGain = result.isCritical ? 40 : 25;

      setDomainStats(prev => {
        const cur = prev[result.worldId] || { solved: 0, total: 3 };
        return {
          ...prev,
          [result.worldId]: {
            ...cur,
            solved: Math.min(cur.total, cur.solved + 1)
          }
        };
      });

      setPlayer(prev => {
        let newExp = prev.exp + expGain;
        let newLevel = prev.level;
        let newExpToNext = prev.expToNext;
        let newMaxHp = prev.maxHp;
        let newHp = prev.hp;

        if (newExp >= newExpToNext) {
          newLevel += 1;
          newExp = newExp - newExpToNext;
          newExpToNext = Math.round(newExpToNext * 1.35);
          newMaxHp += 20;
          newHp = newMaxHp; // Full heal!
          soundPowerUp();
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        return {
          ...prev,
          level: newLevel,
          exp: newExp,
          expToNext: newExpToNext,
          hp: newHp,
          maxHp: newMaxHp,
          credits: prev.credits + coinGain,
          focus: Math.min(prev.maxFocus, prev.focus + 15)
        };
      });

    } else {
      const damage = result.damageTaken || 25;

      setIncidents(prev => [
        {
          timestamp: new Date().toISOString(),
          worldId: result.worldId,
          challengeId: result.challengeId,
          scenario: result.scenario,
          failedOptionText: result.failedOptionText,
          cpentNote: result.cpentNote
        },
        ...prev
      ]);

      setPlayer(prev => {
        let newHp = prev.hp - damage;
        const has1Up = inventory.some(i => i.id === 'item_1up' && i.equipped);
        if (newHp <= 0) {
          if (has1Up) {
            newHp = 40;
            soundPowerUp();
          } else {
            newHp = 20; // Keep Mario alive for practice
          }
        }
        return { ...prev, hp: newHp };
      });
    }
  };

  const handleUseItem = (itemId, cost) => {
    if (itemId === 'spend_focus_hint') {
      setPlayer(prev => ({
        ...prev,
        focus: Math.max(0, prev.focus - (cost || 10))
      }));
      return;
    }

    if (itemId === 'item_mushroom') {
      if (player.credits < 60) return;
      setPlayer(prev => ({
        ...prev,
        credits: prev.credits - 60,
        hp: Math.min(prev.maxHp, prev.hp + 50)
      }));
    } else if (itemId === 'item_starman') {
      if (player.credits < 90) return;
      setPlayer(prev => ({
        ...prev,
        credits: prev.credits - 90,
        focus: Math.min(prev.maxFocus, prev.focus + 35)
      }));
    }
  };

  const handleBuyItem = (item) => {
    if (player.credits < item.price) return;
    setPlayer(prev => ({
      ...prev,
      credits: prev.credits - item.price
    }));

    if (item.category === 'gear') {
      setInventory(prev => [
        ...prev,
        { ...item, equipped: true }
      ]);
    } else if (item.id === 'item_mushroom') {
      setPlayer(prev => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + 50)
      }));
    } else if (item.id === 'item_starman') {
      setPlayer(prev => ({
        ...prev,
        focus: Math.min(prev.maxFocus, prev.focus + 35)
      }));
    }
  };

  const handleToggleEquip = (itemId) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, equipped: !item.equipped };
      }
      return item;
    }));
  };

  const handleRetryChallenge = (worldId, challengeId) => {
    const targetWorld = MARIO_WORLDS.find(w => w.id === worldId);
    if (targetWorld) {
      const idx = targetWorld.challenges.findIndex(c => c.id === challengeId);
      setSelectedWorld(targetWorld);
      setCurrentChallengeIndex(idx >= 0 ? idx : 0);
      setCurrentView('battle');
      setIsLogOpen(false);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('確定要重置所有 Mario 關卡進度與金幣存檔嗎？')) {
      localStorage.removeItem(STORAGE_KEY);
      setPlayer(defaultPlayer);
      setInventory([{ id: 'item_mushroom', name: '超級紅蘑菇', count: 1 }]);
      setIncidents([]);
      const initial = {};
      MARIO_WORLDS.forEach(w => {
        initial[w.id] = { solved: 0, total: w.challenges.length };
      });
      setDomainStats(initial);
      setCurrentView('map');
    }
  };

  return (
    <>
      {hasScanlines && <div className="crt-overlay" />}

      <div className="container" style={{ paddingBottom: '40px' }}>
        
        {/* NES Mario Top HUD */}
        <Header 
          player={player}
          isMuted={muted}
          toggleSound={toggleSound}
          hasScanlines={hasScanlines}
          toggleScanlines={toggleScanlines}
          openShop={() => setIsShopOpen(true)}
          openLog={() => setIsLogOpen(true)}
          openDockerLab={() => setIsDockerLabOpen(true)}
          incidentCount={incidents.length}
          currentWorldName={selectedWorld ? selectedWorld.name : null}
          gameMode={gameMode}
          onToggleMode={(mode) => setGameMode(mode)}
        />

        {/* View Switching */}
        {currentView === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 280px', gap: '20px', alignItems: 'start' }}>
            
            {/* World Map Overworld Screen */}
            <div>
              <WorldMap 
                onSelectWorld={handleSelectWorld}
                domainStats={domainStats}
              />
            </div>

            {/* Sidebar: Radar Chart & Castle Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <RadarChart domainStats={domainStats} />

              <div className="pixel-box" style={{ padding: '16px', background: '#0b0f19' }}>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: 'var(--mario-block)', marginBottom: '8px' }}>
                  ★ 瑪利歐通關進度
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '12px' }}>
                  已攻陷 <strong>{Object.values(domainStats).reduce((acc, cur) => acc + cur.solved, 0)}</strong> 個城堡關卡。破除 6 大世界庫巴守衛，奪取 CPENT 宗師桂冠！
                </p>

                <button 
                  className="pixel-btn pixel-btn-secondary"
                  onClick={handleResetProgress}
                  style={{ width: '100%', fontSize: '0.6rem', padding: '6px' }}
                >
                  重置存檔 (RESET GAME)
                </button>
              </div>
            </div>

          </div>
        )}

        {currentView === 'battle' && selectedWorld && (
          <BattleArena 
            world={selectedWorld}
            challengeIndex={currentChallengeIndex}
            onFinishChallenge={handleFinishChallenge}
            onExitArena={handleExitArena}
            player={player}
            inventory={inventory}
            useItem={handleUseItem}
            gameMode={gameMode}
          />
        )}

        {/* Modals */}
        <InventoryModal 
          isOpen={isShopOpen}
          onClose={() => setIsShopOpen(false)}
          player={player}
          inventory={inventory}
          onBuyItem={handleBuyItem}
          onToggleEquip={handleToggleEquip}
        />

        <IncidentLogModal 
          isOpen={isLogOpen}
          onClose={() => setIsLogOpen(false)}
          incidents={incidents}
          onClearIncidents={() => setIncidents([])}
          onRetryChallenge={handleRetryChallenge}
        />

        <DockerLabModal 
          isOpen={isDockerLabOpen}
          onClose={() => setIsDockerLabOpen(false)}
          currentWorld={selectedWorld || MARIO_WORLDS[0]}
        />

      </div>
    </>
  );
}
