import React from 'react';
import { ActiveDrawerTab } from './LeftToolbar';
import { ShapeType } from '../../engine/LayerModel';
import {
  Type,
  ImagePlus,
  Upload,
  Square,
  Circle,
  Triangle,
  Star,
  ArrowRight,
  Minus,
  PenLine,
  Wand2,
  LayoutTemplate,
  Sparkles,
  Scissors,
  Aperture,
  Eraser,
  RefreshCw,
  Maximize2,
  FileText,
  MousePointerClick,
  Crop,
  X,
  ScanLine,
  Layers,
  Info,
  CheckCircle2,
} from 'lucide-react';

export interface ToolTrayProps {
  activeTab: ActiveDrawerTab;
  onClose: () => void;
  onAddHeading: () => void;
  onAddSubheading: () => void;
  onAddBodyText: () => void;
  onAddShape: (type: ShapeType) => void;
  onTriggerUpload: () => void;
  onOpenUnlockModal: () => void;
  onOpenReframeModal: () => void;
  onOpenMemoryModal: () => void;
  onOpenRegionModal: () => void;
  onRunAITool: (toolId: string) => void;
  isImageSelected: boolean;
  isAIProcessing?: boolean;
  aiProgress?: number;
  aiStatus?: string;
}

/* ── Reusable sub-components ────────────────────────────── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="edv-section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {children}
  </div>
);

const AIToolButton = ({
  icon,
  label,
  description,
  disabled,
  onClick,
  iconColor,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  disabled?: boolean;
  onClick: () => void;
  iconColor?: string;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="edv-ai-card"
    style={{
      textAlign: 'left',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      width: '100%',
      border: 'none',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: '30px',
          height: '30px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-panel-elevated)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor || 'var(--accent-ai)',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {label}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
          {description}
        </div>
      </div>
    </div>
  </button>
);

const FlagshipCard = ({
  icon,
  label,
  description,
  badge,
  accentColor,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  badge?: string;
  accentColor?: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="edv-hero-card ai"
    style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: `${accentColor || 'var(--accent-ai)'}18`,
            border: `1px solid ${accentColor || 'var(--accent-ai)'}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor || 'var(--accent-ai)',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              lineHeight: 1.2,
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.35 }}>
            {description}
          </div>
        </div>
      </div>
      {badge && (
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: accentColor || 'var(--accent-ai)',
            color: '#FFFFFF',
            padding: '2px 6px',
            borderRadius: 'var(--radius-xs)',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  </button>
);

/* ── Main ToolTray ──────────────────────────────────────── */

export const ToolTray: React.FC<ToolTrayProps> = ({
  activeTab,
  onClose,
  onAddHeading,
  onAddSubheading,
  onAddBodyText,
  onAddShape,
  onTriggerUpload,
  onOpenUnlockModal,
  onOpenReframeModal,
  onOpenMemoryModal,
  onOpenRegionModal,
  onRunAITool,
  isImageSelected,
  isAIProcessing = false,
  aiProgress = 0,
  aiStatus = '',
}) => {
  if (!activeTab) return null;

  const tabTitles: Record<NonNullable<ActiveDrawerTab>, string> = {
    text: 'Text',
    image: 'Image',
    shapes: 'Shapes',
    draw: 'Draw',
    smart: 'Smart Workflows',
    ai: 'AI Studio',
  };

  return (
    <aside
      style={{
        width: '280px',
        backgroundColor: 'var(--bg-panel-elevated)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 70,
        boxShadow: 'var(--shadow-md)',
        flexShrink: 0,
      }}
      className="animate-slide-left"
    >
      {/* Drawer Header */}
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {tabTitles[activeTab]}
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            borderRadius: 'var(--radius-xs)',
            transition: 'color var(--t-fast), background var(--t-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'var(--bg-panel-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Drawer Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* ── 1. TEXT ─────────────────────────────────────── */}
        {activeTab === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SectionLabel>Click to add to canvas</SectionLabel>

            <button
              type="button"
              onClick={onAddHeading}
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color var(--t-fast), background var(--t-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'var(--bg-panel-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-panel)';
              }}
            >
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                Add a Heading
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Large title — 52px Bold</div>
            </button>

            <button
              type="button"
              onClick={onAddSubheading}
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color var(--t-fast), background var(--t-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'var(--bg-panel-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-panel)';
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Add a Subheading
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>Section subtitle — 28px</div>
            </button>

            <button
              type="button"
              onClick={onAddBodyText}
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color var(--t-fast), background var(--t-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'var(--bg-panel-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-panel)';
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Add a little bit of body text
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>Paragraph — 18px Regular</div>
            </button>
          </div>
        )}

        {/* ── 2. IMAGE ─────────────────────────────────────── */}
        {activeTab === 'image' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SectionLabel>Upload an asset</SectionLabel>

            <button
              type="button"
              onClick={onTriggerUpload}
              style={{
                border: '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '28px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--bg-panel)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'border-color var(--t-fast), background var(--t-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'var(--accent-subtle)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.background = 'var(--bg-panel)';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-subtle)',
                  border: '1px solid var(--border-focus)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <Upload size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Upload Image
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  JPG, PNG, WebP or SVG
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ── 3. SHAPES ────────────────────────────────────── */}
        {activeTab === 'shapes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SectionLabel>Vector shapes</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                { type: 'rect',         label: 'Rectangle', icon: <Square size={18} /> },
                { type: 'rounded-rect', label: 'Rounded',   icon: <Square size={18} style={{ borderRadius: '4px' }} /> },
                { type: 'circle',       label: 'Circle',    icon: <Circle size={18} /> },
                { type: 'triangle',     label: 'Triangle',  icon: <Triangle size={18} /> },
                { type: 'star',         label: 'Star',      icon: <Star size={18} /> },
                { type: 'arrow',        label: 'Arrow',     icon: <ArrowRight size={18} /> },
                { type: 'line',         label: 'Line',      icon: <Minus size={18} /> },
              ].map((s) => (
                <button
                  key={s.type}
                  type="button"
                  onClick={() => onAddShape(s.type as ShapeType)}
                  style={{
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    transition: 'all var(--t-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'var(--bg-panel-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'var(--bg-panel)';
                  }}
                >
                  {s.icon}
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. DRAW ──────────────────────────────────────── */}
        {activeTab === 'draw' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SectionLabel>Freehand drawing</SectionLabel>

            <div
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-subtle)',
                  border: '1px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}
              >
                <PenLine size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Brush Active</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Click and drag on canvas to draw
                </div>
              </div>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, padding: '0 2px' }}>
              Switch back to <strong style={{ color: 'var(--text-secondary)' }}>Select</strong> mode when done drawing.
            </p>
          </div>
        )}

        {/* ── 5. SMART WORKFLOWS ───────────────────────────── */}
        {activeTab === 'smart' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SectionLabel>EDITIVE Intelligence</SectionLabel>

            {/* HERO: Unlock Design */}
            <FlagshipCard
              icon={<Wand2 size={17} />}
              label="Unlock Design"
              description="Turn a finished JPG/PNG into editable layers, text, and vector elements."
              badge="Hero"
              accentColor="var(--accent-ai)"
              onClick={onOpenUnlockModal}
            />

            <FlagshipCard
              icon={<LayoutTemplate size={17} />}
              label="Smart Reframe"
              description="Adapt your design to a new format — Story, Landscape, Square, Poster."
              accentColor="var(--accent)"
              onClick={onOpenReframeModal}
            />

            <FlagshipCard
              icon={<Layers size={17} />}
              label="Design Memory"
              description="Save and reuse typography, colors, and visual styling across designs."
              accentColor="#D29922"
              onClick={onOpenMemoryModal}
            />

            <FlagshipCard
              icon={<ScanLine size={17} />}
              label="Manual Region Cut"
              description="Slice any missed element on an image into an independent layer."
              accentColor="var(--status-info)"
              onClick={onOpenRegionModal}
            />
          </div>
        )}

        {/* ── 6. AI STUDIO ─────────────────────────────────── */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Context hint */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: isImageSelected ? 'rgba(63, 185, 80, 0.08)' : 'rgba(72, 79, 88, 0.3)',
                border: `1px solid ${isImageSelected ? 'rgba(63,185,80,0.25)' : 'var(--border-subtle)'}`,
              }}
            >
              {isImageSelected ? (
                <CheckCircle2 size={13} color="var(--status-success)" />
              ) : (
                <Info size={13} color="var(--text-muted)" />
              )}
              <span style={{ fontSize: '11px', color: isImageSelected ? 'var(--status-success)' : 'var(--text-muted)', fontWeight: 500 }}>
                {isImageSelected ? 'Image selected — AI tools ready' : 'Select an image on canvas to use AI tools'}
              </span>
            </div>

            {/* Processing progress */}
            {isAIProcessing && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-panel-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {aiStatus || 'Processing image...'}
                </span>
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'var(--bg-active)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${aiProgress}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-ai)',
                      transition: 'width 150ms ease-out',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Background */}
            <div>
              <SectionLabel>Background</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <AIToolButton
                  icon={<Scissors size={15} />}
                  label="Remove Background"
                  description="Powered by remove.bg"
                  iconColor="var(--accent)"
                  disabled={!isImageSelected || isAIProcessing}
                  onClick={() => onRunAITool('remove_bg')}
                />
                <AIToolButton
                  icon={<Aperture size={15} />}
                  label="Blur Background"
                  description="Optical bokeh depth effect"
                  iconColor="var(--accent-ai)"
                  disabled={!isImageSelected || isAIProcessing}
                  onClick={() => onRunAITool('blur_bg')}
                />
              </div>
            </div>

            {/* Objects */}
            <div>
              <SectionLabel>Object Editing</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <AIToolButton
                  icon={<Eraser size={15} />}
                  label="Remove Object / Cleanup"
                  description="Powered by Clipdrop Cleanup"
                  iconColor="#F85149"
                  disabled={!isImageSelected || isAIProcessing}
                  onClick={() => onRunAITool('remove_object')}
                />
                <AIToolButton
                  icon={<MousePointerClick size={15} />}
                  label="Smart Object Select"
                  description="AI segmentation"
                  iconColor="#58A6FF"
                  disabled={!isImageSelected || isAIProcessing}
                  onClick={() => onRunAITool('smart_select')}
                />
              </div>
            </div>

            {/* Enhance */}
            <div>
              <SectionLabel>Enhance</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <AIToolButton
                  icon={<Sparkles size={15} />}
                  label="Smart Enhance"
                  description="Auto tone and exposure balance"
                  iconColor="#D29922"
                  disabled={!isImageSelected || isAIProcessing}
                  onClick={() => onRunAITool('smart_enhance')}
                />
                <AIToolButton
                  icon={<Maximize2 size={15} />}
                  label="AI Upscale 2×"
                  description="Powered by Clipdrop Upscaling"
                  iconColor="#3FB950"
                  disabled={!isImageSelected || isAIProcessing}
                  onClick={() => onRunAITool('ai_upscale')}
                />
              </div>
            </div>

            {/* Canvas & Text */}
            <div>
              <SectionLabel>Canvas & Text</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <AIToolButton
                  icon={<RefreshCw size={15} />}
                  label="AI Expand / Uncrop"
                  description="Powered by Clipdrop Uncrop"
                  iconColor="#818CF8"
                  disabled={!isImageSelected || isAIProcessing}
                  onClick={() => onRunAITool('ai_expand')}
                />
                <AIToolButton
                  icon={<FileText size={15} />}
                  label="Extract Text (OCR)"
                  description="Powered by OCR.Space"
                  iconColor="#F78166"
                  disabled={!isImageSelected || isAIProcessing}
                  onClick={() => onRunAITool('extract_text')}
                />
                <AIToolButton
                  icon={<Crop size={15} />}
                  label="Smart Crop"
                  description="Subject-aware rule of thirds"
                  iconColor="#A78BFA"
                  disabled={!isImageSelected || isAIProcessing}
                  onClick={() => onRunAITool('smart_crop')}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
