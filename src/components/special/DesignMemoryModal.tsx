import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CanvasDocument } from '../../engine/LayerModel';
import { StyleExtractor, DesignMemory } from '../../algorithms/styleExtractor';
import { LocalStorageManager } from '../../lib/storage';
import { Sparkles, Check, Bookmark, Plus, ArrowRight } from 'lucide-react';

export interface DesignMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: CanvasDocument;
  onApplyStyle: (updatedDoc: CanvasDocument) => void;
}

export const DesignMemoryModal: React.FC<DesignMemoryModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onApplyStyle,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'extract'>('library');
  const [newStyleName, setNewStyleName] = useState('Brand Visual Style');
  const [selectedMemory, setSelectedMemory] = useState<DesignMemory | null>(null);

  // Load saved memories from storage + standard defaults
  const savedMemories = LocalStorageManager.getDesignMemories();

  const handleExtractAndSave = () => {
    const memory = StyleExtractor.extractMemory(doc, newStyleName.trim() || 'My Visual Style');
    LocalStorageManager.saveDesignMemory(memory);
    setSelectedMemory(memory);
    setActiveTab('library');
  };

  const handleApply = (memory: DesignMemory) => {
    const updated = StyleExtractor.applyMemory(doc, memory);
    onApplyStyle(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Design Memory"
      subtitle="Extract, save, and transfer cohesive typography, palettes, and styling across designs"
      maxWidth="680px"
    >
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
        <Button
          variant={activeTab === 'library' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('library')}
        >
          Saved Styles Library
        </Button>
        <Button
          variant={activeTab === 'extract' ? 'primary' : 'ghost'}
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => setActiveTab('extract')}
        >
          Save Current Design's Style
        </Button>
      </div>

      {/* TAB 1: Library */}
      {activeTab === 'library' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {savedMemories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--text-muted)' }}>
              No saved design memories yet. Click &quot;Save Current Design&apos;s Style&quot; to remember this composition&apos;s visual style!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {savedMemories.map((mem) => {
                const isSelected = selectedMemory?.id === mem.id;

                return (
                  <div
                    key={mem.id}
                    style={{
                      backgroundColor: 'var(--bg-panel-elevated)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bookmark size={15} color="var(--accent-special)" />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {mem.name}
                        </span>
                      </div>

                      <Button
                        variant="special"
                        size="sm"
                        icon={<Sparkles size={14} />}
                        onClick={() => handleApply(mem)}
                      >
                        Apply to Active Design
                      </Button>
                    </div>

                    {/* Preview Cards */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '10px',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {/* Typography Preview */}
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Typography
                        </span>
                        <div style={{ marginTop: '4px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 700, fontFamily: mem.typography.headlineFont, color: mem.palette.text }}>
                            Aa Headline
                          </p>
                          <p style={{ fontSize: '11px', fontFamily: mem.typography.bodyFont, color: mem.palette.secondary }}>
                            Body text pair
                          </p>
                        </div>
                      </div>

                      {/* Palette Preview */}
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Palette
                        </span>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                          {[mem.palette.dominant, mem.palette.secondary, mem.palette.accent, mem.palette.background].map(
                            (c, i) => (
                              <div
                                key={i}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '3px',
                                  backgroundColor: c,
                                  border: '1px solid var(--border-subtle)',
                                }}
                              />
                            )
                          )}
                        </div>
                      </div>

                      {/* Button Preview */}
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          CTA Button
                        </span>
                        <div
                          style={{
                            marginTop: '6px',
                            backgroundColor: mem.buttonStyle.fill,
                            color: mem.buttonStyle.textColor,
                            borderRadius: `${mem.buttonStyle.radius}px`,
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            textAlign: 'center',
                            boxShadow: `0 2px 8px ${mem.shadowProfile.color}`,
                          }}
                        >
                          ACTION
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Extract & Save */}
      {activeTab === 'extract' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Style Memory Name</span>
            <input
              type="text"
              value={newStyleName}
              onChange={(e) => setNewStyleName(e.target.value)}
              placeholder="e.g. Modern Cyber Neon"
              style={{
                width: '100%',
                marginTop: '6px',
                backgroundColor: 'var(--bg-panel-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '8px 10px',
                fontSize: '13px',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-panel-elevated)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              What will be remembered:
            </span>
            <ul style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>Headline & body font families and weight hierarchy</li>
              <li>Dominant, accent, background, and text colors</li>
              <li>Corner radius profiles for cards, images, and shapes</li>
              <li>Drop shadow and elevation styling</li>
              <li>CTA button colors and typography</li>
            </ul>
          </div>

          <Button variant="special" icon={<Sparkles size={16} />} onClick={handleExtractAndSave}>
            Extract & Save Style
          </Button>
        </div>
      )}
    </Modal>
  );
};
