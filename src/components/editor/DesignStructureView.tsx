import React from 'react';
import { EditorLayer, SemanticRole } from '../../engine/LayerModel';
import { ArrowDown, Layers, CheckCircle2 } from 'lucide-react';

export interface DesignStructureViewProps {
  layers: EditorLayer[];
  selectedLayerIds: string[];
  onSelectLayer: (id: string) => void;
}

export const DesignStructureView: React.FC<DesignStructureViewProps> = ({
  layers,
  selectedLayerIds,
  onSelectLayer,
}) => {
  const roleHierarchy: { role: SemanticRole; label: string; color: string }[] = [
    { role: 'background', label: 'BACKGROUND CANVAS', color: '#64748B' },
    { role: 'subject', label: 'MAIN SUBJECT / PRODUCT', color: '#3B82F6' },
    { role: 'headline', label: 'PRIMARY HEADLINE', color: '#EC4899' },
    { role: 'subtitle', label: 'SUBTITLE / COPY', color: '#8B5CF6' },
    { role: 'price', label: 'PRICE / OFFER BADGE', color: '#10B981' },
    { role: 'cta', label: 'CALL TO ACTION', color: '#F59E0B' },
    { role: 'shape', label: 'GRAPHIC ACCENTS', color: '#06B6D4' },
    { role: 'generic', label: 'GENERAL ELEMENTS', color: '#94A3B8' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-panel)',
        color: 'var(--text-primary)',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: '14px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Design Structure View
        </h4>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Semantic composition hierarchy of your visual design
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
        {roleHierarchy.map((item, index) => {
          const matchingLayers = layers.filter((l) => (l.semanticRole || 'generic') === item.role);
          if (matchingLayers.length === 0) return null;

          return (
            <React.Fragment key={item.role}>
              {index > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0' }}>
                  <ArrowDown size={14} color="var(--text-muted)" />
                </div>
              )}

              <div
                style={{
                  backgroundColor: 'var(--bg-panel-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: item.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {matchingLayers.length} {matchingLayers.length === 1 ? 'layer' : 'layers'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                  {matchingLayers.map((l) => {
                    const isSelected = selectedLayerIds.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => onSelectLayer(l.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '5px 8px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: isSelected ? 'var(--bg-active)' : 'rgba(0,0,0,0.15)',
                          border: isSelected ? '1px solid var(--accent-primary)' : '1px solid transparent',
                          fontSize: '11px',
                          color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {l.name}
                        </span>
                        {isSelected && <CheckCircle2 size={12} color="var(--accent-primary)" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
