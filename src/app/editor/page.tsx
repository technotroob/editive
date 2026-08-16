'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CanvasDocument,
  EditorLayer,
  ImageLayer,
  TextLayer,
  ShapeLayer,
  ShapeType,
  DEFAULT_LAYER_EFFECTS,
  DEFAULT_IMAGE_ADJUSTMENTS,
} from '../../engine/LayerModel';
import { CanvasEngine, ToolType } from '../../engine/CanvasEngine';
import { HistoryManager } from '../../engine/HistoryManager';
import { HandleType } from '../../engine/TransformController';
import { LocalStorageManager } from '../../lib/storage';
import { AIProcessors, AIToolResult } from '../../algorithms/aiProcessors';
import { Upload, FileText, Square } from 'lucide-react';

// Redesigned Approachable Editor Components
import { TopBar, SaveState } from '../../components/editor/TopBar';
import { LeftToolbar, ActiveDrawerTab } from '../../components/editor/LeftToolbar';
import { ToolTray } from '../../components/editor/ToolTray';
import { FloatingActionBar } from '../../components/editor/FloatingActionBar';
import { CanvasViewport } from '../../components/editor/CanvasViewport';
import { ContextualPanel } from '../../components/editor/ContextualPanel';
import { LayersPanel } from '../../components/editor/LayersPanel';
import { DesignStructureView } from '../../components/editor/DesignStructureView';
import { StatusBar } from '../../components/editor/StatusBar';

// Special Hero Feature Modals
import { UnlockDesignModal } from '../../components/special/UnlockDesignModal';
import { RegionToLayerModal } from '../../components/special/RegionToLayerModal';
import { DesignMemoryModal } from '../../components/special/DesignMemoryModal';
import { SmartReframeModal } from '../../components/special/SmartReframeModal';
import { RemoveObjectModal } from '../../components/special/RemoveObjectModal';
import { AIResultPreviewPanel } from '../../components/special/AIResultPreviewPanel';
import { ExportModal } from '../../components/export/ExportModal';
import { ToastContainer, ToastMessage } from '../../components/ui/Toast';

export default function EditorPage() {
  const router = useRouter();

  // Document State
  const [doc, setDoc] = useState<CanvasDocument>(() => {
    if (typeof window !== 'undefined') {
      const recentId = localStorage.getItem('editive_active_project_id');
      if (recentId) {
        const saved = LocalStorageManager.getProject(recentId);
        if (saved) return saved;
      }
    }
    // Clean default: Fresh blank canvas
    return {
      id: 'project_' + Math.random().toString(36).substr(2, 9),
      title: 'Untitled Design',
      width: 1080,
      height: 1080,
      backgroundColor: '#FFFFFF',
      layers: [],
      selectedLayerIds: [],
    };
  });

  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [hoverHandle, setHoverHandle] = useState<HandleType>('none');
  const [zoom, setZoom] = useState(1);
  const [activeDrawerTab, setActiveDrawerTab] = useState<ActiveDrawerTab>(null);
  const [rightTab, setRightTab] = useState<'inspector' | 'layers' | 'structure'>('inspector');

  // Special Feature Modals State
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isReframeModalOpen, setIsReframeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // AI Operation State (Preview / Apply / Cancel workflow)
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStatus, setAiStatus] = useState('');
  const [pendingAIResult, setPendingAIResult] = useState<AIToolResult | null>(null);
  const [removeObjectLayer, setRemoveObjectLayer] = useState<ImageLayer | null>(null);

  // Hidden File Input for Image Upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Engines & Managers
  const engineRef = useRef<CanvasEngine | null>(null);
  const historyManagerRef = useRef<HistoryManager>(new HistoryManager(50));

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast_' + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Initialize CanvasEngine once DOM canvas is mounted
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const engine = new CanvasEngine(canvas, doc, {
      onDocumentChange: (updatedDoc) => {
        setDoc({ ...updatedDoc });
        setSaveState('unsaved');
      },
      onSelectionChange: (selectedIds) => {
        setDoc((prev) => ({ ...prev, selectedLayerIds: [...selectedIds] }));
      },
      onHoverHandleChange: (handle) => {
        setHoverHandle(handle);
      },
    });

    engineRef.current = engine;
    historyManagerRef.current.pushState(doc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        handleSaveProject();
        e.preventDefault();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (doc.selectedLayerIds.length > 0) {
          handleDeleteSelectedLayers();
          e.preventDefault();
        }
      } else if (e.key === 'Escape') {
        engineRef.current?.selectLayer(null);
        setActiveDrawerTab(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // History Actions
  const handleUndo = () => {
    const prev = historyManagerRef.current.undo(doc);
    if (prev) {
      setDoc(prev);
      engineRef.current?.setDocument(prev, false);
      showToast('Undo', 'info');
    }
  };

  const handleRedo = () => {
    const next = historyManagerRef.current.redo(doc);
    if (next) {
      setDoc(next);
      engineRef.current?.setDocument(next, false);
      showToast('Redo', 'info');
    }
  };

  const recordHistory = (newDoc: CanvasDocument) => {
    historyManagerRef.current.pushState(newDoc);
  };

  // Project Save
  const handleSaveProject = () => {
    setSaveState('saving');
    LocalStorageManager.saveProject(doc);
    setTimeout(() => {
      setSaveState('saved');
      showToast('Design saved', 'success');
    }, 300);
  };

  const handleProjectTitleChange = (newTitle: string) => {
    const updated = { ...doc, title: newTitle };
    setDoc(updated);
    engineRef.current?.setDocument(updated);
    recordHistory(updated);
  };

  // Layer CRUD Operations
  const handleUpdateLayer = (id: string, updates: Partial<EditorLayer>) => {
    const updatedLayers = doc.layers.map((l) => (l.id === id ? ({ ...l, ...updates } as EditorLayer) : l));
    const updatedDoc = { ...doc, layers: updatedLayers };
    setDoc(updatedDoc);
    engineRef.current?.setDocument(updatedDoc);
  };

  const handleAddTextWithPreset = (text: string, fontSize: number, fontWeight: number) => {
    const newText: TextLayer = {
      id: 'text_' + Math.random().toString(36).substr(2, 9),
      name: fontSize >= 40 ? 'Heading' : fontSize >= 24 ? 'Subheading' : 'Body Text',
      type: 'text',
      text,
      fontFamily: 'Outfit, sans-serif',
      fontSize,
      fontWeight,
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      fill: '#18181B',
      letterSpacing: 0,
      lineHeight: 1.2,
      x: Math.round((doc.width - 500) / 2),
      y: Math.round((doc.height - fontSize * 2) / 2),
      width: 500,
      height: fontSize * 2,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
    };

    const updatedDoc = {
      ...doc,
      layers: [...doc.layers, newText],
      selectedLayerIds: [newText.id],
    };
    setDoc(updatedDoc);
    engineRef.current?.setDocument(updatedDoc);
    recordHistory(updatedDoc);
    showToast('Text added to canvas', 'success');
  };

  const handleAddShape = (shapeType: ShapeType) => {
    const w = shapeType === 'circle' ? 240 : shapeType === 'line' || shapeType === 'arrow' ? 300 : 260;
    const h = shapeType === 'circle' ? 240 : shapeType === 'line' || shapeType === 'arrow' ? 40 : 160;

    const newShape: ShapeLayer = {
      id: 'shape_' + Math.random().toString(36).substr(2, 9),
      name: `${shapeType.toUpperCase()} Shape`,
      type: 'shape',
      shapeType,
      fill: shapeType === 'line' || shapeType === 'arrow' ? 'transparent' : '#3B82F6',
      stroke: shapeType === 'line' || shapeType === 'arrow' ? '#3B82F6' : 'transparent',
      strokeWidth: shapeType === 'line' || shapeType === 'arrow' ? 4 : 0,
      cornerRadius: shapeType === 'rounded-rect' ? 16 : 0,
      x: Math.round((doc.width - w) / 2),
      y: Math.round((doc.height - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
    };

    const updatedDoc = {
      ...doc,
      layers: [...doc.layers, newShape],
      selectedLayerIds: [newShape.id],
    };
    setDoc(updatedDoc);
    engineRef.current?.setDocument(updatedDoc);
    recordHistory(updatedDoc);
    showToast(`${shapeType} added`, 'success');
  };

  const handleInsertImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const src = e.target.result as string;
        const img = new Image();
        img.src = src;
        img.onload = () => {
          const maxDim = Math.min(doc.width, doc.height) * 0.7;
          const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1);
          const w = Math.round(img.naturalWidth * scale);
          const h = Math.round(img.naturalHeight * scale);

          const newImage: ImageLayer = {
            id: 'img_' + Math.random().toString(36).substr(2, 9),
            name: file.name.split('.')[0] || 'Image Asset',
            type: 'image',
            src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            x: Math.round((doc.width - w) / 2),
            y: Math.round((doc.height - h) / 2),
            width: w,
            height: h,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            flipHorizontal: false,
            flipVertical: false,
            cornerRadius: 0,
            adjustments: JSON.parse(JSON.stringify(DEFAULT_IMAGE_ADJUSTMENTS)),
            effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
          };

          const updatedDoc = {
            ...doc,
            layers: [...doc.layers, newImage],
            selectedLayerIds: [newImage.id],
          };
          setDoc(updatedDoc);
          engineRef.current?.setDocument(updatedDoc);
          recordHistory(updatedDoc);
          showToast('Image added', 'success');
        };
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteSelectedLayers = () => {
    const remaining = doc.layers.filter((l) => !doc.selectedLayerIds.includes(l.id));
    const updatedDoc = {
      ...doc,
      layers: remaining,
      selectedLayerIds: [],
    };
    setDoc(updatedDoc);
    engineRef.current?.setDocument(updatedDoc);
    recordHistory(updatedDoc);
    showToast('Deleted', 'info');
  };

  const handleDuplicateLayer = (id: string) => {
    engineRef.current?.duplicateLayer(id);
    showToast('Duplicated layer', 'success');
  };

  const handleQuickRemoveBG = async (layer: ImageLayer) => {
    if (isProcessingAI) return;
    setIsProcessingAI(true);
    setAiProgress(0);
    setAiStatus('Removing background...');
    try {
      const res = await AIProcessors.removeBackground(layer, (p, s) => {
        setAiProgress(p);
        setAiStatus(s);
      });
      if (res.success) {
        setPendingAIResult(res);
      } else {
        showToast(res.message || 'Background removal failed', 'error');
      }
    } catch (err: any) {
      showToast("We couldn't process this image. Try again or edit manually.", 'error');
    } finally {
      setIsProcessingAI(false);
      setAiProgress(0);
      setAiStatus('');
    }
  };

  // Commit an AI result to the canvas (recorded for Undo/Redo)
  const handleApplyAIResult = () => {
    if (!pendingAIResult) return;
    const result = pendingAIResult;
    setPendingAIResult(null);

    if (result.newLayers && result.newLayers.length > 0) {
      const updatedDoc: CanvasDocument = {
        ...doc,
        layers: [...doc.layers, ...result.newLayers],
        selectedLayerIds: [result.newLayers[result.newLayers.length - 1].id],
        versionState: 'edited',
      };
      setDoc(updatedDoc);
      engineRef.current?.setDocument(updatedDoc);
      recordHistory(updatedDoc);
    } else if (result.modifiedLayer) {
      const updatedDoc: CanvasDocument = {
        ...doc,
        layers: doc.layers.map((l) => (l.id === result.modifiedLayer!.id ? (result.modifiedLayer as EditorLayer) : l)),
        selectedLayerIds: [result.modifiedLayer.id],
        versionState: 'edited',
      };
      setDoc(updatedDoc);
      engineRef.current?.setDocument(updatedDoc);
      recordHistory(updatedDoc);
    }
    showToast(result.message, 'success');
  };

  const handleCancelAIResult = () => {
    setPendingAIResult(null);
    showToast('AI result discarded', 'info');
  };

  const handleRunAIToolFromDrawer = async (toolId: string) => {
    if (isProcessingAI) return;

    const selected = doc.layers.find((l) => doc.selectedLayerIds.includes(l.id));
    if (!selected || selected.type !== 'image') {
      showToast('Please select an image on canvas to apply AI tools', 'info');
      return;
    }

    const imgLayer = selected as ImageLayer;

    // Remove Object requires a user-painted mask first
    if (toolId === 'remove_object') {
      setRemoveObjectLayer(imgLayer);
      return;
    }

    setIsProcessingAI(true);
    setAiProgress(0);
    setAiStatus('Processing...');

    const progress = (p: number, s: string) => {
      setAiProgress(p);
      setAiStatus(s);
    };

    try {
      let result: AIToolResult;
      switch (toolId) {
        case 'remove_bg':
          result = await AIProcessors.removeBackground(imgLayer, progress);
          break;
        case 'blur_bg':
          result = await AIProcessors.blurBackground(imgLayer, progress);
          break;
        case 'smart_select':
          result = await AIProcessors.smartSelect(imgLayer, progress);
          break;
        case 'smart_enhance':
          result = await AIProcessors.smartEnhance(imgLayer, progress);
          break;
        case 'ai_upscale':
          result = await AIProcessors.aiUpscale(imgLayer, progress);
          break;
        case 'ai_expand':
          result = await AIProcessors.aiExpand(imgLayer, 100, 100, 100, 100, progress);
          break;
        case 'extract_text':
          result = await AIProcessors.extractText(imgLayer, progress);
          break;
        case 'smart_crop':
          result = await AIProcessors.smartCrop(imgLayer, '1:1', progress);
          break;
        default:
          result = { success: false, message: 'Unknown AI tool', error: { code: 'UNKNOWN_TOOL', message: toolId } };
      }

      if (result.success) {
        setPendingAIResult(result);
      } else {
        showToast(result.message || 'Operation could not be completed', 'error');
      }
    } catch (err: any) {
      showToast("We couldn't process this image. Try again or edit manually.", 'error');
    } finally {
      setIsProcessingAI(false);
      setAiProgress(0);
      setAiStatus('');
    }
  };

  const handleRemoveObjectRun = async (layer: ImageLayer, maskSrc: string) => {
    setRemoveObjectLayer(null);
    if (isProcessingAI) return;
    setIsProcessingAI(true);
    setAiProgress(0);
    setAiStatus('Cleaning up object...');
    try {
      const res = await AIProcessors.removeObject(layer, maskSrc, (p, s) => {
        setAiProgress(p);
        setAiStatus(s);
      });
      if (res.success) {
        setPendingAIResult(res);
      } else {
        showToast(res.message || 'Object cleanup failed', 'error');
      }
    } catch (err: any) {
      showToast("We couldn't process this image. Try again or edit manually.", 'error');
    } finally {
      setIsProcessingAI(false);
      setAiProgress(0);
      setAiStatus('');
    }
  };

  const handleApplyUnlockedDesign = (reconstructedLayers: EditorLayer[], width: number, height: number) => {
    const updatedDoc: CanvasDocument = {
      ...doc,
      width,
      height,
      backgroundColor: '#0F172A',
      layers: reconstructedLayers,
      selectedLayerIds: reconstructedLayers.length > 0 ? [reconstructedLayers[reconstructedLayers.length - 1].id] : [],
    };
    setDoc(updatedDoc);
    engineRef.current?.setDocument(updatedDoc);
    recordHistory(updatedDoc);
    showToast('🎉 Design successfully unlocked into editable layers!', 'success');
  };

  const handleApplyReframe = (reframedDoc: CanvasDocument) => {
    setDoc(reframedDoc);
    engineRef.current?.setDocument(reframedDoc);
    recordHistory(reframedDoc);
    showToast('Design reframed to new format', 'success');
  };

  const handleApplyStyleMemory = (styledDoc: CanvasDocument) => {
    setDoc(styledDoc);
    engineRef.current?.setDocument(styledDoc);
    recordHistory(styledDoc);
    showToast('Visual style transferred!', 'success');
  };

  // Helper variables
  const selectedLayers = doc.layers.filter((l) => doc.selectedLayerIds.includes(l.id));
  const selectedLayer = selectedLayers.length === 1 ? selectedLayers[0] : null;
  const isImageSelected = selectedLayer?.type === 'image';

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleInsertImageFile(e.target.files[0]);
          }
        }}
      />

      {/* 1. TOP BAR */}
      <TopBar
        projectTitle={doc.title}
        saveState={saveState}
        canUndo={historyManagerRef.current.canUndo()}
        canRedo={historyManagerRef.current.canRedo()}
        zoom={zoom}
        onProjectTitleChange={handleProjectTitleChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={() => {
          const z = Math.min(5, zoom * 1.15);
          setZoom(z);
          engineRef.current?.setZoom(z);
        }}
        onZoomOut={() => {
          const z = Math.max(0.2, zoom / 1.15);
          setZoom(z);
          engineRef.current?.setZoom(z);
        }}
        onResetZoom={() => {
          setZoom(1);
          engineRef.current?.setZoom(1);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenUnlockModal={() => setIsUnlockModalOpen(true)}
        onOpenReframeModal={() => setIsReframeModalOpen(true)}
        onGoToDashboard={() => router.push('/')}
      />

      {/* 2. MAIN WORKSPACE ROW */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Left Navigation Tool Rail (Visible text labels!) */}
        <LeftToolbar
          activeDrawerTab={activeDrawerTab}
          onSelectDrawerTab={(tab) => {
            setActiveDrawerTab(tab);
            if (tab === 'draw') {
              setActiveTool('draw');
              engineRef.current?.setActiveTool('draw');
            } else {
              setActiveTool('select');
              engineRef.current?.setActiveTool('select');
            }
          }}
          isSelectToolActive={activeTool === 'select'}
          onActivateSelectTool={() => {
            setActiveTool('select');
            engineRef.current?.setActiveTool('select');
          }}
          onActivateTool={(tool: string) => {
            setActiveTool(tool as ToolType);
            engineRef.current?.setActiveTool(tool as ToolType);
            if (tool !== 'draw') {
              setActiveDrawerTab(null);
            }
          }}
          onOpenRightTab={(tab) => setRightTab(tab)}
          onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        />

        {/* Canva-style Tool Tray / Drawer */}
        <ToolTray
          activeTab={activeDrawerTab}
          onClose={() => setActiveDrawerTab(null)}
          onAddHeading={() => handleAddTextWithPreset('Add a heading', 52, 800)}
          onAddSubheading={() => handleAddTextWithPreset('Add a subheading', 28, 600)}
          onAddBodyText={() => handleAddTextWithPreset('Add body text here', 18, 400)}
          onAddShape={handleAddShape}
          onTriggerUpload={() => fileInputRef.current?.click()}
          onOpenUnlockModal={() => setIsUnlockModalOpen(true)}
          onOpenReframeModal={() => setIsReframeModalOpen(true)}
          onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
          onOpenRegionModal={() => setIsRegionModalOpen(true)}
          onRunAITool={handleRunAIToolFromDrawer}
          isImageSelected={isImageSelected}
          isAIProcessing={isProcessingAI}
          aiProgress={aiProgress}
          aiStatus={aiStatus}
        />

        {/* Central Canvas Viewport with Floating Quick Action Bar */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }} className="studio-canvas-bg">
          {/* On-Canvas Floating Action Bar */}
          <FloatingActionBar
            selectedLayer={selectedLayer}
            document={doc}
            onUpdateLayer={handleUpdateLayer}
            onDuplicateLayer={handleDuplicateLayer}
            onDeleteLayer={handleDeleteSelectedLayers}
            onRunQuickRemoveBG={handleQuickRemoveBG}
          />

          {/* Subtle Empty State (only while the canvas has no layers) */}
          {doc.layers.length === 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '18px',
                pointerEvents: 'none',
                textAlign: 'center',
                zIndex: 20,
                padding: '24px',
              }}
              className="animate-fade-in"
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '11px',
                  background: 'var(--grad-hero)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '19px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 8px 24px rgba(79, 142, 247, 0.35)',
                  opacity: 0.85,
                }}
              >
                E
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  Start creating
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '240px' }}>
                  Add an image, text, shape, or drawing from the tools on the left.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 12px', borderRadius: 'var(--radius-sm)',
                    fontSize: '12px', fontWeight: 600,
                    color: 'var(--text-on-accent)', background: 'var(--accent-primary)',
                  }}
                >
                  <Upload size={13} />
                  Add image
                </button>
                <button
                  type="button"
                  onClick={() => handleAddTextWithPreset('Add a heading', 52, 800)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 12px', borderRadius: 'var(--radius-sm)',
                    fontSize: '12px', fontWeight: 600,
                    color: 'var(--text-primary)', background: 'var(--bg-panel-elevated)', border: '1px solid var(--border-medium)',
                  }}
                >
                  <FileText size={13} />
                  Add text
                </button>
                <button
                  type="button"
                  onClick={() => handleAddShape('rounded-rect')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 12px', borderRadius: 'var(--radius-sm)',
                    fontSize: '12px', fontWeight: 600,
                    color: 'var(--text-primary)', background: 'var(--bg-panel-elevated)', border: '1px solid var(--border-medium)',
                  }}
                >
                  <Square size={13} />
                  Add shape
                </button>
              </div>
            </div>
          )}

          <CanvasViewport
            engineRef={engineRef}
            canvasWidth={doc.width}
            canvasHeight={doc.height}
            activeTool={activeTool}
            hoverHandle={hoverHandle}
            onDropImage={handleInsertImageFile}
          />

          {/* AI Result Preview / Apply / Cancel */}
          {pendingAIResult && (
            <AIResultPreviewPanel
              result={pendingAIResult}
              onApply={handleApplyAIResult}
              onCancel={handleCancelAIResult}
            />
          )}
        </div>

        {/* Right Sidebar: Dynamic Contextual Inspector & Layers Panel */}
        <aside
          style={{
            width: '300px',
            backgroundColor: 'var(--bg-panel)',
            borderLeft: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 60,
          }}
        >
          {/* Right Panel Tabs */}
          <div className="edv-tab-bar">
            <button
              type="button"
              className={`edv-tab${rightTab === 'inspector' ? ' active' : ''}`}
              onClick={() => setRightTab('inspector')}
            >
              Properties
            </button>
            <button
              type="button"
              className={`edv-tab${rightTab === 'layers' ? ' active' : ''}`}
              onClick={() => setRightTab('layers')}
            >
              Layers {doc.layers.length > 0 ? `(${doc.layers.length})` : ''}
            </button>
            <button
              type="button"
              className={`edv-tab${rightTab === 'structure' ? ' active' : ''}`}
              onClick={() => setRightTab('structure')}
            >
              Structure
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {rightTab === 'inspector' && (
              <ContextualPanel
                document={doc}
                selectedLayers={selectedLayers}
                onUpdateLayer={handleUpdateLayer}
                onUpdateCanvas={(updates) => {
                  const updatedDoc = { ...doc, ...updates };
                  setDoc(updatedDoc);
                  engineRef.current?.setDocument(updatedDoc);
                  recordHistory(updatedDoc);
                }}
              />
            )}

            {rightTab === 'layers' && (
              <LayersPanel
                layers={doc.layers}
                selectedLayerIds={doc.selectedLayerIds}
                onSelectLayer={(id, multi) => engineRef.current?.selectLayer(id, multi)}
                onToggleVisibility={(id) => {
                  const target = doc.layers.find((l) => l.id === id);
                  if (target) handleUpdateLayer(id, { visible: !target.visible });
                }}
                onToggleLock={(id) => {
                  const target = doc.layers.find((l) => l.id === id);
                  if (target) handleUpdateLayer(id, { locked: !target.locked });
                }}
                onBringForward={(id) => engineRef.current?.bringForward(id)}
                onSendBackward={(id) => engineRef.current?.sendBackward(id)}
                onDuplicateLayer={(id) => engineRef.current?.duplicateLayer(id)}
                onDeleteLayer={(id) => engineRef.current?.removeLayer(id)}
              />
            )}

            {rightTab === 'structure' && (
              <DesignStructureView
                layers={doc.layers}
                selectedLayerIds={doc.selectedLayerIds}
                onSelectLayer={(id) => engineRef.current?.selectLayer(id)}
              />
            )}
          </div>
        </aside>
      </div>

      {/* 3. STATUS BAR */}
      <StatusBar
        canvasWidth={doc.width}
        canvasHeight={doc.height}
        zoom={zoom}
        activeTool={activeTool}
        selectedLayers={selectedLayers}
      />

      {/* 4. MODALS */}
      <UnlockDesignModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onApplyUnlockedDesign={handleApplyUnlockedDesign}
      />

      <RegionToLayerModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedImageLayer={selectedLayer?.type === 'image' ? (selectedLayer as ImageLayer) : null}
        onConvertRegionToLayer={(newLayer) => {
          const updated = {
            ...doc,
            layers: [...doc.layers, newLayer],
            selectedLayerIds: [newLayer.id],
          };
          setDoc(updated);
          engineRef.current?.setDocument(updated);
          recordHistory(updated);
          showToast('Region converted to layer', 'success');
        }}
      />

      <DesignMemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        document={doc}
        onApplyStyle={handleApplyStyleMemory}
      />

      <SmartReframeModal
        isOpen={isReframeModalOpen}
        onClose={() => setIsReframeModalOpen(false)}
        document={doc}
        onApplyReframe={handleApplyReframe}
      />

      <RemoveObjectModal
        isOpen={removeObjectLayer !== null}
        layer={removeObjectLayer}
        onClose={() => setRemoveObjectLayer(null)}
        onRun={handleRemoveObjectRun}
        onShowToast={showToast}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        engineRef={engineRef}
        projectTitle={doc.title}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
