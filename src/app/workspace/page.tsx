'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CanvasDocument, EditorLayer, ImageLayer } from '../../engine/LayerModel';
import { LocalStorageManager } from '../../lib/storage';
import {
  LayoutTemplate,
  Upload,
  Sparkles,
  Plus,
  Layers,
  Trash2,
  Copy,
  Edit3,
  FileText,
  ImageIcon,
  Smartphone,
  Video,
  Wand2,
  MoreVertical,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { UnlockDesignModal } from '../../components/special/UnlockDesignModal';

interface FormatPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  icon: React.ReactNode;
  color: string;
}

const FORMAT_PRESETS: FormatPreset[] = [
  { id: 'ig_post', name: 'Instagram Post', width: 1080, height: 1080, aspectRatio: '1:1', icon: <LayoutTemplate size={20} />, color: '#EC4899' },
  { id: 'ig_story', name: 'Instagram Story', width: 1080, height: 1920, aspectRatio: '9:16', icon: <Smartphone size={20} />, color: '#8B5CF6' },
  { id: 'yt_thumb', name: 'YouTube Thumbnail', width: 1280, height: 720, aspectRatio: '16:9', icon: <Video size={20} />, color: '#EF4444' },
  { id: 'linkedin_post', name: 'LinkedIn Post', width: 1200, height: 627, aspectRatio: '1.91:1', icon: <LayoutTemplate size={20} />, color: '#3B82F6' },
  { id: 'poster', name: 'Portrait Poster', width: 1080, height: 1350, aspectRatio: '4:5', icon: <FileText size={20} />, color: '#10B981' },
];

export default function StartExperiencePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<CanvasDocument[]>([]);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isCustomSizeModalOpen, setIsCustomSizeModalOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  const [customTitle, setCustomTitle] = useState('Untitled Design');
  const [moreMenuOpenId, setMoreMenuOpenId] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProjects(LocalStorageManager.getProjects());
  }, []);

  const createAndOpenProject = (
    width: number,
    height: number,
    title = 'Untitled Design',
    initialImage?: string
  ) => {
    const newDoc: CanvasDocument = {
      id: 'project_' + Math.random().toString(36).substr(2, 9),
      title,
      width,
      height,
      backgroundColor: '#0F1219',
      layers: initialImage
        ? [
            {
              id: 'img_' + Math.random().toString(36).substr(2, 9),
              name: 'Uploaded Image',
              type: 'image',
              src: initialImage,
              naturalWidth: width,
              naturalHeight: height,
              x: 0,
              y: 0,
              width,
              height,
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              flipHorizontal: false,
              flipVertical: false,
              cornerRadius: 0,
              adjustments: {
                brightness: 0, contrast: 0, saturation: 0, exposure: 0,
                hue: 0, temperature: 0, tint: 0, blur: 0,
                sharpen: 0, grayscale: 0, sepia: 0, invert: 0,
              },
              effects: {
                shadow: { enabled: false, color: '', blur: 0, offsetX: 0, offsetY: 0 },
                glow: { enabled: false, color: '', blur: 0 },
                innerShadow: { enabled: false, color: '', blur: 0, offsetX: 0, offsetY: 0 },
                border: { enabled: false, color: '', width: 0, style: 'solid' },
                duotone: { enabled: false, primaryColor: '', secondaryColor: '' },
              },
            } as ImageLayer,
          ]
        : [],
      selectedLayerIds: [],
    };

    LocalStorageManager.saveProject(newDoc);
    localStorage.setItem('editive_active_project_id', newDoc.id);
    router.push('/editor');
  };

  const handleCreateBlankPreset = (preset: FormatPreset) => {
    createAndOpenProject(preset.width, preset.height, `${preset.name}`);
  };

  const handleCreateCustom = () => {
    setIsCustomSizeModalOpen(false);
    createAndOpenProject(customWidth || 1080, customHeight || 1080, customTitle || 'Untitled Design');
  };

  const handleImageFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const src = e.target.result as string;
        const img = new Image();
        img.src = src;
        img.onload = () => {
          createAndOpenProject(
            img.naturalWidth || 1080,
            img.naturalHeight || 1080,
            file.name.split('.')[0] || 'Image Edit',
            src
          );
        };
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenExistingProject = (p: CanvasDocument) => {
    localStorage.setItem('editive_active_project_id', p.id);
    router.push('/editor');
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    LocalStorageManager.deleteProject(id);
    setProjects(LocalStorageManager.getProjects());
    setMoreMenuOpenId(null);
  };

  const handleDuplicateProject = (p: CanvasDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    const clone: CanvasDocument = JSON.parse(JSON.stringify(p));
    clone.id = 'project_' + Math.random().toString(36).substr(2, 9);
    LocalStorageManager.saveProject(clone);
    setProjects(LocalStorageManager.getProjects());
    setMoreMenuOpenId(null);
  };

  const handleRenameProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const name = prompt('Rename project', projects.find((p) => p.id === id)?.title || 'Untitled Design');
    if (name && name.trim()) {
      const updated = projects.map((p) => (p.id === id ? { ...p, title: name.trim() } : p));
      updated.forEach((p) => LocalStorageManager.saveProject(p));
      setProjects(LocalStorageManager.getProjects());
      setMoreMenuOpenId(null);
    }
  };

  const getProjectThumb = (p: CanvasDocument) => {
    const firstImg = p.layers.find((l): l is ImageLayer => l.type === 'image');
    if (firstImg && firstImg.src) return firstImg.src;
    return null;
  };

  const moreMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !(moreMenuRef.current as any).contains(e.target as Node)) {
        setMoreMenuOpenId(null);
      }
    };
    if (moreMenuOpenId) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [moreMenuOpenId]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-workspace)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
      className="studio-canvas-bg"
    >
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleImageFileUpload(e.target.files[0]);
          }
        }}
      />

      <header
        style={{
          height: '64px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'var(--grad-hero)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '18px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              flexShrink: 0,
              boxShadow: '0 6px 18px rgba(79, 142, 247, 0.35)',
            }}
          >
            E
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '18px',
              letterSpacing: '1px',
              color: 'var(--text-primary)',
            }}
          >
            EDITIVE
          </span>
        </div>
        <Button variant="secondary" size="sm" icon={<Sparkles size={15} />} onClick={() => setIsUnlockModalOpen(true)}>
          Unlock Design
        </Button>
      </header>

      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '36px 32px',
        }}
      >
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: '#FFFFFF',
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
            }}
          >
            What do you want to create?
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.55 }}>
            A modern visual workspace. Create from scratch, open a saved project, import a Photoshop file,
            upload an image, or turn a flat design into editable layers.
          </p>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <ActionCard icon={<Plus size={26} />} color="var(--accent)" title="Blank Canvas" desc="Start a new design" onClick={() => setIsPresetModalOpen(true)} />
          <ActionCard icon={<Layers size={26} />} color="var(--status-info)" title="Open Project" desc="Continue editing" onClick={() => setProjects(LocalStorageManager.getProjects())} />
          <ActionCard icon={<FileText size={26} />} color="var(--status-warning)" title="Import PSD" desc="From a Photoshop file" onClick={() => alert('PSD import coming soon')} />
          <ActionCard icon={<Upload size={26} />} color="var(--accent-emerald)" title="Upload Image" desc="Edit a photo you own" onClick={() => uploadInputRef.current?.click()} />
          <ActionCard icon={<Wand2 size={26} />} color="var(--accent-ai)" title="Unlock Design" desc="Reconstruct a flat image" onClick={() => setIsUnlockModalOpen(true)} />
        </section>

        <section style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-info)" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Recent Projects
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {projects.length === 1 ? '1 design' : `${projects.length} designs`}
            </span>
          </div>

          {projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '16px',
              }}
            >
              {projects.map((p) => {
                const thumb = getProjectThumb(p);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleOpenExistingProject(p)}
                    style={{
                      backgroundColor: 'var(--bg-panel)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all var(--t-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      style={{
                        height: '130px',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: p.backgroundColor || '#090B10',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {thumb ? (
                        <img src={thumb} alt={p.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      ) : (
                        <ImageIcon size={32} color="var(--text-muted)" />
                      )}
                    </div>
                    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }} title={p.title}>
                          {p.title}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {p.width} × {p.height} px
                        </span>
                      </div>
                      <div style={{ position: 'relative' }} ref={moreMenuOpenId === p.id ? moreMenuRef : undefined}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setMoreMenuOpenId(moreMenuOpenId === p.id ? null : p.id); }}
                          style={{
                            width: '28px',
                            height: '26px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid transparent',
                            background: moreMenuOpenId === p.id ? 'var(--bg-active)' : 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MoreVertical size={13} />
                        </button>
                        {moreMenuOpenId === p.id && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '30px',
                              right: '0',
                              backgroundColor: 'var(--bg-panel-elevated)',
                              border: '1px solid var(--border-medium)',
                              borderRadius: 'var(--radius-sm)',
                              overflow: 'hidden',
                              minWidth: '140px',
                              boxShadow: 'var(--shadow-md)',
                              zIndex: 200,
                            }}
                          >
                            <button type="button" onClick={(e) => handleOpenExistingProject(p)} style={menuBtn}>Open</button>
                            <button type="button" onClick={(e) => handleRenameProject(p.id, e)} style={menuBtn}>Rename</button>
                            <button type="button" onClick={(e) => handleDuplicateProject(p, e)} style={menuBtn}>Duplicate</button>
                            <button type="button" onClick={(e) => handleDeleteProject(p.id, e)} style={{ ...menuBtn, color: 'var(--status-error)' }}>Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {(isPresetModalOpen || isCustomSizeModalOpen) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(8, 11, 18, 0.82)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 300,
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => { setIsPresetModalOpen(false); setIsCustomSizeModalOpen(false); }}
          className="animate-fade-in"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-panel)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '560px',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '24px 26px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Choose a canvas format
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Select a preset or define a custom size.
              </p>
            </div>
            {isCustomSizeModalOpen ? (
              <div style={{ padding: '24px 26px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Title</span>
                    <input type="text" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="edv-input" style={{ marginTop: '6px' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Width (px)</span>
                      <input type="number" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="edv-number" style={{ marginTop: '6px' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Height (px)</span>
                      <input type="number" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} className="edv-number" style={{ marginTop: '6px' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                  <Button variant="ghost" onClick={() => setIsCustomSizeModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleCreateCustom}>Create Canvas</Button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '8px 14px 16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                  {FORMAT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => { handleCreateBlankPreset(preset); setIsPresetModalOpen(false); }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-medium)',
                        background: 'var(--bg-panel-elevated)',
                        cursor: 'pointer',
                        transition: 'all var(--t-fast)',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = preset.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div style={{ color: preset.color }}>{preset.icon}</div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{preset.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {preset.width} × {preset.height}
                      </span>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => { setCustomWidth(1080); setCustomHeight(1080); setIsCustomSizeModalOpen(true); setIsPresetModalOpen(false); }}
                    style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    + Custom Canvas Size
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <UnlockDesignModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onApplyUnlockedDesign={(reconstructed, w, h) => {
          const newDoc: CanvasDocument = {
            id: 'project_' + Math.random().toString(36).substr(2, 9),
            title: 'Unlocked Design',
            width: w,
            height: h,
            backgroundColor: '#0F172A',
            layers: reconstructed as EditorLayer[],
            selectedLayerIds: reconstructed.length > 0 ? [reconstructed[reconstructed.length - 1].id] : [],
          };
          LocalStorageManager.saveProject(newDoc);
          localStorage.setItem('editive_active_project_id', newDoc.id);
          router.push('/editor');
        }}
      />
    </div>
  );
}

const menuBtn: React.CSSProperties = {
  fontSize: '12px', color: 'var(--text-primary)', background: 'transparent',
  border: 'none', padding: '6px 10px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left',
};

interface ActionCardProps {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  onClick: () => void;
}

const ActionCard = ({ icon, color, title, desc, onClick }: ActionCardProps) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      backgroundColor: 'var(--bg-panel-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all var(--t-fast)',
      height: '100%',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 12px 26px ${color}24`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-medium)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{ color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
    <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</span>
  </button>
);

const EmptyState = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '14px',
      padding: '44px 24px',
      backgroundColor: 'var(--bg-panel)',
      border: '1px dashed var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: '56px',
        height: '56px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--grad-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(79, 142, 247, 0.3)',
      }}
    >
      <Layers size={26} color="#FFFFFF" />
    </div>
    <div>
      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
        No projects yet
      </span>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
        Create a blank canvas, upload an image, or unlock a design to get started.
      </span>
    </div>
  </div>
);
