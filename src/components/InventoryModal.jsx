import React from 'react';
import { X, Check } from 'lucide-react';
import { MARIO_SHOP_ITEMS } from '../data/cpentData';
import { soundCoin, soundPowerUp, soundClick } from '../utils/audio';

export function InventoryModal({ isOpen, onClose, player, inventory, onBuyItem, onToggleEquip }) {
  if (!isOpen) return null;

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
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        background: '#0b0f19',
        border: '4px solid var(--mario-block)',
        boxShadow: '8px 8px 0 #000, 0 0 30px rgba(252, 188, 60, 0.3)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '4px solid #000', paddingBottom: '14px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1rem', color: 'var(--mario-block)' }}>
              🍄 奇諾比奧道具屋 (TOAD'S SHOP)
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              使用過關收集的金幣 (Coins) 兌換神奇的破關道具與特異功能裝備！
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

        {/* Coin Balance Badge */}
        <div style={{
          background: '#000',
          border: '3px solid var(--mario-block)',
          padding: '10px 16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.8rem'
        }}>
          <span style={{ color: '#fff' }}>當前持有金幣:</span>
          <span style={{ color: 'var(--mario-block)' }}>🪙 x {player.credits}</span>
        </div>

        {/* Item List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
          {MARIO_SHOP_ITEMS.map((item) => {
            const owned = inventory.find(i => i.id === item.id);
            const isOwned = !!owned;
            const isEquipped = owned && owned.equipped;
            const canAfford = player.credits >= item.price;

            return (
              <div 
                key={item.id}
                style={{
                  background: '#05070d',
                  border: isEquipped ? '3px solid var(--mario-pipe-light)' : '3px solid #1e293b',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: '#fff' }}>
                          {item.name}
                        </h4>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                          {item.category === 'gear' ? '常駐裝備 (GEAR)' : '強化道具 (POWER-UP)'}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--mario-block)' }}>
                      🪙 {item.price}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    {item.description}
                  </p>
                </div>

                {/* Purchase / Equip Button */}
                <div style={{ borderTop: '2px solid #1e293b', paddingTop: '10px' }}>
                  {item.category === 'gear' ? (
                    isOwned ? (
                      <button
                        className={`pixel-btn ${isEquipped ? 'pixel-btn-green' : 'pixel-btn-secondary'}`}
                        onClick={() => { soundPowerUp(); onToggleEquip(item.id); }}
                        style={{ width: '100%', fontSize: '0.6rem', padding: '8px' }}
                      >
                        {isEquipped ? (
                          <>
                            <Check size={14} /> 已裝備 (EQUIPPED)
                          </>
                        ) : '穿上裝備 (EQUIP)'}
                      </button>
                    ) : (
                      <button
                        className="pixel-btn pixel-btn-gold"
                        disabled={!canAfford}
                        onClick={() => { soundCoin(); soundPowerUp(); onBuyItem(item); }}
                        style={{ width: '100%', fontSize: '0.6rem', padding: '8px' }}
                      >
                        購買 (🪙 {item.price})
                      </button>
                    )
                  ) : (
                    <button
                      className="pixel-btn pixel-btn-red"
                      disabled={!canAfford}
                      onClick={() => { soundCoin(); soundPowerUp(); onBuyItem(item); }}
                      style={{ width: '100%', fontSize: '0.6rem', padding: '8px' }}
                    >
                      補給購買 (🪙 {item.price})
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
