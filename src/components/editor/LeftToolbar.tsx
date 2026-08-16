import React from 'react';
import {
  MousePointer2,
  Type,
  ImagePlus,
  Shapes,
  PenLine,
  Layers,
  AlignCenterVertical,
  ScanLine,
  Crop,
  Palette,
  Wand2,
  Sparkles,
} from 'lucide-react';

export type ActiveDrawerTab =
  | 'text'
  | 'image'
  | 'shapes'
  | 'draw'
  | 'smart'
  | 'ai'
  | null;

export interface LeftToolbarProps {
  activeDrawerTab: ActiveDrawerTab;
  onSelectDrawerTab: (tab: ActiveDrawerTab) => void;
  isSelectToolActive: boolean;
  onActivateSelectTool: () => void;
  onActivateTool?: (tool: string) => void;
  onOpenRightTab?: (tab: 'inspector' | 'layers' | 'structure') => void;
  onOpenUnlockModal?: () => void;
  onOpenReframeModal?: () => void;
  onOpenMemoryModal?: () => void;
}

interface ToolItem {
  id: ActiveDrawerTab | 'select' | 'crop' | 'adjust' | 'effects' | 'layers' | 'structure' | 'unlock' | 'reframe' | 'memory' | 'align';
  label: string;
  description?: string;
  icon: React.ReactNode;
  isAI?: boolean;
}

interface ToolSection {
  label: string;
  tools: ToolItem[];
}

const sections: ToolSection[] = [
  {
    label: 'Create',
    tools: [
      { id: 'image', label: 'Image', description: 'Add photos and uploads', icon: <ImagePlus size={18} color="#60A5FA" /> },
      { id: 'text', label: 'Text', description: 'Add headings & body', icon: <Type size={18} color="#FBBF24" /> },
      { id: 'shapes', label: 'Shapes', description: 'Rectangles, circles', icon: <Shapes size={18} color="#34D397" /> },
      { id: 'draw', label: 'Draw', description: 'Brush, pencil, marker', icon: <PenLine size={18} color="#EC4899" /> },
    ],
  },
  {
    label: 'Edit',
    tools: [
      { id: 'select', label: 'Select', description: 'Select and move', icon: <MousePointer2 size={18} color="#93C5FD" /> },
      { id: 'crop', label: 'Crop', description: 'Crop your image', icon: <Crop size={18} color="#38BDF8" /> },
      { id: 'adjust', label: 'Adjust', description: 'Brightness, contrast', icon: <Palette size={18} color="#FACC15" /> },
      { id: 'effects', label: 'Effects', description: 'Shadows, glows, blur', icon: <Sparkles size={18} color="#A78BFA" /> },
    ],
  },
  {
    label: 'Organize',
    tools: [
      { id: 'layers', label: 'Layers', description: 'Layer list & order', icon: <Layers size={18} color="#CBD5E1" /> },
      { id: 'align', label: 'Align & Arrange', description: 'Align, distribute, order', icon: <AlignCenterVertical size={18} color="#94A3B8" /> },
      { id: 'structure', label: 'Structure', description: 'Semantic hierarchy', icon: <ScanLine size={18} color="#94A3AE" /> },
    ],
  },
  {
    label: 'Intelligence',
    tools: [
      { id: 'unlock', label: 'Unlock Design', description: 'Reconstruct a flat image', icon: <Wand2 size={18} color="#34D397" />, isAI: true },
      { id: 'reframe', label: 'Smart Reframe', description: 'Adapt to any format', icon: <Layers size={18} color="#FBBF24" />, isAI: true },
      { id: 'memory', label: 'Design Memory', description: 'Save & reuse styles', icon: <Palette size={18} color="#A78BFA" />, isAI: true },
      { id: 'ai', label: 'AI Tools', description: 'Remove BG, OCR, Upscale', icon: <Sparkles size={18} color="#60A5FA" />, isAI: true },
    ],
  },
];

const getIsActive = (id: ToolItem['id'], activeDrawerTab: ActiveDrawerTab, isSelectToolActive: boolean): boolean => {
  if (id === 'select') return isSelectToolActive && activeDrawerTab === null;
  return activeDrawerTab === id;
};

export const LeftToolbar: React.FC<LeftToolbarProps> = ({
  activeDrawerTab,
  onSelectDrawerTab,
  isSelectToolActive,
  onActivateSelectTool,
  onActivateTool,
  onOpenRightTab,
  onOpenUnlockModal,
  onOpenReframeModal,
  onOpenMemoryModal,
}) => {
  return (
    <nav
      style={{
        width: '92px',
        backgroundColor: 'var(--bg-panel)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 0 16px',
        gap: 0,
        zIndex: 80,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'var(--grad-hero)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '15px',
            color: '#FFFFFF',
            letterSpacing: '-0.5px',
            flexShrink: 0,
            boxShadow: '0 6px 18px rgba(79, 142, 247, 0.4)',
          }}
        >
          E
        </div>
      </div>

      {sections.map((section, si) => (
        <div
          key={section.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: si < sections.length - 1 ? '4px' : 0,
          }}
        >
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '8px 0 6px',
            }}
          >
            {section.label}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', padding: '0 8px' }}>
            {section.tools.map((tool) => {
              const isActive = getIsActive(tool.id, activeDrawerTab, isSelectToolActive);
              return (
                <button
                  key={String(tool.id)}
                  type="button"
                  className={`edv-tool-btn edv-tool-btn--sm${isActive ? ' active' : ''}${tool.isAI ? ' ai-tool' : ''}`}
                  onClick={() => {
                    switch (tool.id) {
                      case 'select':
                        onActivateSelectTool();
                        onSelectDrawerTab(null);
                        break;
                      case 'crop':
                        onActivateTool?.('crop');
                        onOpenRightTab?.('inspector');
                        break;
                      case 'adjust':
                        onOpenRightTab?.('inspector');
                        break;
                      case 'effects':
                        onOpenRightTab?.('inspector');
                        break;
                      case 'layers':
                        onOpenRightTab?.('layers');
                        break;
                      case 'align':
                        onOpenRightTab?.('layers');
                        break;
                      case 'structure':
                        onOpenRightTab?.('structure');
                        break;
                      case 'unlock':
                        onOpenUnlockModal?.();
                        break;
                      case 'reframe':
                        onOpenReframeModal?.();
                        break;
                      case 'memory':
                        onOpenMemoryModal?.();
                        break;
                      case 'ai':
                        onSelectDrawerTab('ai');
                        break;
                      default:
                        onSelectDrawerTab(tool.id as ActiveDrawerTab);
                    }
                  }}
                  title={tool.description || tool.label}
                  style={{
                    color: isActive ? (tool.isAI ? 'var(--accent-ai)' : 'var(--accent)') : undefined,
                  }}
                >
                  <span className="edv-tool-btn__icon">{tool.icon}</span>
                  <span className="edv-tool-btn__label">{tool.label}</span>
                </button>
              );
            })}
          </div>

          {si < sections.length - 1 && (
            <div
              style={{
                height: '1px',
                background: 'var(--border-subtle)',
                margin: '8px 16px 0',
              }}
            />
          )}
        </div>
      ))}
    </nav>
  );
};
