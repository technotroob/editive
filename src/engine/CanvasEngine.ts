import {
  CanvasDocument,
  EditorLayer,
  ImageLayer,
  TextLayer,
  ShapeLayer,
  DrawLayer,
  DrawPath,
} from './LayerModel';
import { TransformController, HandleType } from './TransformController';
import { SnapController, SnapGuide } from './SnapController';
import { TextRenderer } from './TextRenderer';
import { ShapeRenderer } from './ShapeRenderer';
import { DrawingEngine } from './DrawingEngine';
import { ImageAdjuster } from './ImageAdjuster';

export type ToolType =
  | 'select'
  | 'move'
  | 'crop'
  | 'text'
  | 'shape'
  | 'draw'
  | 'image'
  | 'region-select';

export interface CanvasEngineCallbacks {
  onDocumentChange?: (doc: CanvasDocument) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onHoverHandleChange?: (handle: HandleType) => void;
}

export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private document: CanvasDocument;
  private callbacks: CanvasEngineCallbacks;

  // Viewport
  private zoom = 1;
  private panX = 0;
  private panY = 0;

  // Active Tool & State
  private activeTool: ToolType = 'select';
  private isInteracting = false;
  private activeHandle: HandleType = 'none';
  private dragStartX = 0;
  private dragStartY = 0;
  private initialLayerStates: Map<string, EditorLayer> = new Map();

  // Snapping
  private activeGuides: SnapGuide[] = [];

  // Freehand Drawing
  private activeDrawPath: DrawPath | null = null;
  private activeDrawColor = '#3B82F6';
  private activeDrawWidth = 4;
  private activeDrawTool: DrawPath['tool'] = 'brush';

  // Image Element Cache
  private imageCache: Map<string, HTMLImageElement> = new Map();

  constructor(
    canvas: HTMLCanvasElement,
    initialDoc: CanvasDocument,
    callbacks: CanvasEngineCallbacks = {}
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2D canvas context');
    this.ctx = context;
    this.document = initialDoc;
    this.callbacks = callbacks;

    this.render();
  }

  // -------------------------------------------------------------
  // Getters & Setters
  // -------------------------------------------------------------

  public getDocument(): CanvasDocument {
    return this.document;
  }

  public setDocument(doc: CanvasDocument, emitChange = true): void {
    this.document = doc;
    this.render();
    if (emitChange && this.callbacks.onDocumentChange) {
      this.callbacks.onDocumentChange(this.document);
    }
  }

  public getZoom(): number {
    return this.zoom;
  }

  public setZoom(zoom: number): void {
    this.zoom = Math.max(0.1, Math.min(5, zoom));
    this.render();
  }

  public getPan(): { x: number; y: number } {
    return { x: this.panX, y: this.panY };
  }

  public setPan(x: number, y: number): void {
    this.panX = x;
    this.panY = y;
    this.render();
  }

  public setActiveTool(tool: ToolType): void {
    this.activeTool = tool;
  }

  public setDrawSettings(color: string, width: number, tool: DrawPath['tool']): void {
    this.activeDrawColor = color;
    this.activeDrawWidth = width;
    this.activeDrawTool = tool;
  }

  public getSelectedLayers(): EditorLayer[] {
    return this.document.layers.filter((l) =>
      this.document.selectedLayerIds.includes(l.id)
    );
  }

  // -------------------------------------------------------------
  // Layer Management Operations
  // -------------------------------------------------------------

  public addLayer(layer: EditorLayer): void {
    this.document.layers.push(layer);
    this.document.selectedLayerIds = [layer.id];
    this.notifyChange();
  }

  public updateLayer(id: string, updates: Partial<EditorLayer>): void {
    this.document.layers = this.document.layers.map((l) => {
      if (l.id === id) {
        return { ...l, ...updates } as EditorLayer;
      }
      return l;
    });
    this.notifyChange();
  }

  public removeLayer(id: string): void {
    this.document.layers = this.document.layers.filter((l) => l.id !== id);
    this.document.selectedLayerIds = this.document.selectedLayerIds.filter((sid) => sid !== id);
    this.notifyChange();
  }

  public selectLayer(id: string | null, multi = false): void {
    if (!id) {
      this.document.selectedLayerIds = [];
    } else if (multi) {
      if (this.document.selectedLayerIds.includes(id)) {
        this.document.selectedLayerIds = this.document.selectedLayerIds.filter((i) => i !== id);
      } else {
        this.document.selectedLayerIds.push(id);
      }
    } else {
      this.document.selectedLayerIds = [id];
    }

    if (this.callbacks.onSelectionChange) {
      this.callbacks.onSelectionChange(this.document.selectedLayerIds);
    }
    this.render();
  }

  public reorderLayer(id: string, newIndex: number): void {
    const layerIndex = this.document.layers.findIndex((l) => l.id === id);
    if (layerIndex === -1) return;

    const [layer] = this.document.layers.splice(layerIndex, 1);
    this.document.layers.splice(newIndex, 0, layer);
    this.notifyChange();
  }

  public bringForward(id: string): void {
    const idx = this.document.layers.findIndex((l) => l.id === id);
    if (idx < this.document.layers.length - 1) {
      this.reorderLayer(id, idx + 1);
    }
  }

  public sendBackward(id: string): void {
    const idx = this.document.layers.findIndex((l) => l.id === id);
    if (idx > 0) {
      this.reorderLayer(id, idx - 1);
    }
  }

  public duplicateLayer(id: string): void {
    const layer = this.document.layers.find((l) => l.id === id);
    if (!layer) return;

    const cloned: EditorLayer = JSON.parse(JSON.stringify(layer));
    cloned.id = 'layer_' + Math.random().toString(36).substr(2, 9);
    cloned.name = `${layer.name} Copy`;
    cloned.x += 20;
    cloned.y += 20;

    this.document.layers.push(cloned);
    this.document.selectedLayerIds = [cloned.id];
    this.notifyChange();
  }

  private notifyChange(): void {
    this.render();
    if (this.callbacks.onDocumentChange) {
      this.callbacks.onDocumentChange(this.document);
    }
    if (this.callbacks.onSelectionChange) {
      this.callbacks.onSelectionChange(this.document.selectedLayerIds);
    }
  }

  // -------------------------------------------------------------
  // Coordinate Transforms
  // -------------------------------------------------------------

  public screenToCanvasCoords(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left - this.panX) / this.zoom;
    const y = (clientY - rect.top - this.panY) / this.zoom;
    return { x, y };
  }

  // -------------------------------------------------------------
  // Pointer Event Handlers
  // -------------------------------------------------------------

  public handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>): void {
    const { x, y } = this.screenToCanvasCoords(e.clientX, e.clientY);
    this.dragStartX = x;
    this.dragStartY = y;

    // Handle Freehand Drawing Tool
    if (this.activeTool === 'draw') {
      this.isInteracting = true;
      this.activeDrawPath = {
        points: [{ x, y }],
        color: this.activeDrawColor,
        width: this.activeDrawWidth,
        tool: this.activeDrawTool,
        opacity: 1,
      };
      this.render();
      return;
    }

    // Handle Selection & Transform
    const selectedLayers = this.getSelectedLayers();
    if (selectedLayers.length === 1) {
      const handle = TransformController.hitTest(x, y, selectedLayers[0], this.zoom);
      if (handle !== 'none') {
        this.isInteracting = true;
        this.activeHandle = handle;
        this.initialLayerStates.clear();
        this.initialLayerStates.set(
          selectedLayers[0].id,
          JSON.parse(JSON.stringify(selectedLayers[0]))
        );
        return;
      }
    }

    // Hit test top-most visible and unlocked layer
    let clickedLayer: EditorLayer | null = null;
    for (let i = this.document.layers.length - 1; i >= 0; i--) {
      const l = this.document.layers[i];
      if (!l.visible || l.locked) continue;
      const hit = TransformController.hitTest(x, y, l, this.zoom);
      if (hit === 'body') {
        clickedLayer = l;
        break;
      }
    }

    if (clickedLayer) {
      this.selectLayer(clickedLayer.id, e.shiftKey);
      this.isInteracting = true;
      this.activeHandle = 'body';
      this.initialLayerStates.clear();
      this.getSelectedLayers().forEach((l) => {
        this.initialLayerStates.set(l.id, JSON.parse(JSON.stringify(l)));
      });
    } else {
      if (!e.shiftKey) {
        this.selectLayer(null);
      }
    }
  }

  public handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>): void {
    const { x, y } = this.screenToCanvasCoords(e.clientX, e.clientY);

    // Active Drawing Path
    if (this.isInteracting && this.activeTool === 'draw' && this.activeDrawPath) {
      this.activeDrawPath.points.push({ x, y });
      this.render();
      return;
    }

    // Active Transformation / Move
    if (this.isInteracting && this.activeHandle !== 'none') {
      const selected = this.getSelectedLayers();
      if (selected.length === 0) return;

      const primary = selected[0];
      const initial = this.initialLayerStates.get(primary.id);
      if (!initial) return;

      const dx = x - this.dragStartX;
      const dy = y - this.dragStartY;

      if (this.activeHandle === 'body') {
        // Moving Layer(s) with Snapping
        const candidateX = initial.x + dx;
        const candidateY = initial.y + dy;

        const snapResult = SnapController.calculateSnap(
          { ...primary, x: candidateX, y: candidateY },
          this.document.layers,
          this.document.width,
          this.document.height,
          !e.altKey // Hold Alt to disable snap
        );

        this.activeGuides = snapResult.guides;
        primary.x = snapResult.snappedX;
        primary.y = snapResult.snappedY;

        // Move any other multi-selected layers by same delta
        selected.forEach((l) => {
          if (l.id !== primary.id) {
            const initL = this.initialLayerStates.get(l.id);
            if (initL) {
              l.x = initL.x + (primary.x - initial.x);
              l.y = initL.y + (primary.y - initial.y);
            }
          }
        });
      } else if (this.activeHandle === 'rotate') {
        // Rotating Layer
        const cx = initial.x + initial.width / 2;
        const cy = initial.y + initial.height / 2;
        const angleRad = Math.atan2(y - cy, x - cx);
        let angleDeg = (angleRad * 180) / Math.PI + 90;

        if (e.shiftKey) {
          // Snap rotation to 15-degree increments
          angleDeg = Math.round(angleDeg / 15) * 15;
        }

        primary.rotation = (angleDeg + 360) % 360;
      } else {
        // Resizing Layer
        this.handleResizeTransform(primary, initial, this.activeHandle, dx, dy, e.shiftKey);
      }

      this.render();
      return;
    }

    // Hover Cursor Feedback
    const selected = this.getSelectedLayers();
    if (selected.length === 1) {
      const handle = TransformController.hitTest(x, y, selected[0], this.zoom);
      if (this.callbacks.onHoverHandleChange) {
        this.callbacks.onHoverHandleChange(handle);
      }
    }
  }

  public handlePointerUp(): void {
    if (!this.isInteracting) return;

    if (this.activeTool === 'draw' && this.activeDrawPath) {
      if (this.activeDrawPath.points.length > 1) {
        // Commit drawing stroke to a DrawLayer
        const existingDrawLayer = this.document.layers.find(
          (l): l is DrawLayer => l.type === 'draw' && !l.locked && l.visible
        );

        if (existingDrawLayer) {
          existingDrawLayer.paths.push(this.activeDrawPath);
        } else {
          const newDrawLayer: DrawLayer = {
            id: 'draw_' + Math.random().toString(36).substr(2, 9),
            name: 'Drawing Layer',
            type: 'draw',
            x: 0,
            y: 0,
            width: this.document.width,
            height: this.document.height,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            paths: [this.activeDrawPath],
            effects: {
              shadow: { enabled: false, color: 'rgba(0,0,0,0.5)', blur: 0, offsetX: 0, offsetY: 0 },
              glow: { enabled: false, color: '', blur: 0 },
              innerShadow: { enabled: false, color: '', blur: 0, offsetX: 0, offsetY: 0 },
              border: { enabled: false, color: '', width: 0, style: 'solid' },
              duotone: { enabled: false, primaryColor: '', secondaryColor: '' },
            },
          };
          this.document.layers.push(newDrawLayer);
        }
      }
      this.activeDrawPath = null;
    }

    this.isInteracting = false;
    this.activeHandle = 'none';
    this.activeGuides = [];
    this.notifyChange();
  }

  private handleResizeTransform(
    layer: EditorLayer,
    initial: EditorLayer,
    handle: HandleType,
    dx: number,
    dy: number,
    preserveRatio = false
  ): void {
    let newW = initial.width;
    let newH = initial.height;
    let newX = initial.x;
    let newY = initial.y;

    const ratio = initial.width / initial.height;

    switch (handle) {
      case 'se':
        newW = Math.max(10, initial.width + dx);
        newH = preserveRatio ? newW / ratio : Math.max(10, initial.height + dy);
        break;
      case 'e':
        newW = Math.max(10, initial.width + dx);
        if (preserveRatio) newH = newW / ratio;
        break;
      case 's':
        newH = Math.max(10, initial.height + dy);
        if (preserveRatio) newW = newH * ratio;
        break;
      case 'nw':
        newW = Math.max(10, initial.width - dx);
        newH = preserveRatio ? newW / ratio : Math.max(10, initial.height - dy);
        newX = initial.x + (initial.width - newW);
        newY = initial.y + (initial.height - newH);
        break;
      case 'w':
        newW = Math.max(10, initial.width - dx);
        if (preserveRatio) newH = newW / ratio;
        newX = initial.x + (initial.width - newW);
        break;
      case 'n':
        newH = Math.max(10, initial.height - dy);
        if (preserveRatio) newW = newH * ratio;
        newY = initial.y + (initial.height - newH);
        break;
      case 'ne':
        newW = Math.max(10, initial.width + dx);
        newH = preserveRatio ? newW / ratio : Math.max(10, initial.height - dy);
        newY = initial.y + (initial.height - newH);
        break;
      case 'sw':
        newW = Math.max(10, initial.width - dx);
        newH = preserveRatio ? newW / ratio : Math.max(10, initial.height + dy);
        newX = initial.x + (initial.width - newW);
        break;
    }

    layer.width = Math.round(newW);
    layer.height = Math.round(newH);
    layer.x = Math.round(newX);
    layer.y = Math.round(newY);
  }

  // -------------------------------------------------------------
  // Rendering Pipeline
  // -------------------------------------------------------------

  public render(): void {
    const ctx = this.ctx;
    const doc = this.document;

    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply Viewport Pan & Zoom
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.zoom, this.zoom);

    // 1. Draw Canvas Background
    ctx.fillStyle = doc.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, doc.width, doc.height);

    // 2. Render Layers in Z-Index Order
    for (const layer of doc.layers) {
      if (!layer.visible) continue;
      this.renderLayer(ctx, layer);
    }

    // 3. Render Active Freehand Drawing Stroke
    if (this.activeDrawPath && this.activeDrawPath.points.length > 1) {
      DrawingEngine.render(ctx, {
        id: 'temp_draw',
        name: 'Temp Draw',
        type: 'draw',
        x: 0,
        y: 0,
        width: doc.width,
        height: doc.height,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        paths: [this.activeDrawPath],
        effects: {
          shadow: { enabled: false, color: '', blur: 0, offsetX: 0, offsetY: 0 },
          glow: { enabled: false, color: '', blur: 0 },
          innerShadow: { enabled: false, color: '', blur: 0, offsetX: 0, offsetY: 0 },
          border: { enabled: false, color: '', width: 0, style: 'solid' },
          duotone: { enabled: false, primaryColor: '', secondaryColor: '' },
        },
      });
    }

    // 4. Render Smart Guides
    if (this.activeGuides.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 1 / this.zoom;
      ctx.setLineDash([4 / this.zoom, 4 / this.zoom]);

      for (const guide of this.activeGuides) {
        ctx.beginPath();
        if (guide.type === 'vertical') {
          ctx.moveTo(guide.position, guide.start);
          ctx.lineTo(guide.position, guide.end);
        } else {
          ctx.moveTo(guide.start, guide.position);
          ctx.lineTo(guide.end, guide.position);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Render Selection Bounding Box & Handles
    const selected = this.getSelectedLayers();
    for (const layer of selected) {
      if (layer.visible) {
        TransformController.renderSelectionOverlay(ctx, layer, this.zoom);
      }
    }

    ctx.restore();
  }

  private renderLayer(ctx: CanvasRenderingContext2D, layer: EditorLayer): void {
    ctx.save();
    ctx.globalAlpha = layer.opacity ?? 1;
    if (layer.blendMode) {
      ctx.globalCompositeOperation = layer.blendMode;
    }

    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;
    const rad = ((layer.rotation || 0) * Math.PI) / 180;

    ctx.translate(cx, cy);
    ctx.rotate(rad);
    ctx.translate(-layer.width / 2, -layer.height / 2);

    switch (layer.type) {
      case 'image':
        this.renderImageLayer(ctx, layer);
        break;
      case 'text':
        TextRenderer.render(ctx, layer);
        break;
      case 'shape':
        ShapeRenderer.render(ctx, layer);
        break;
      case 'draw':
        DrawingEngine.render(ctx, layer);
        break;
    }

    ctx.restore();
  }

  private renderImageLayer(ctx: CanvasRenderingContext2D, layer: ImageLayer): void {
    let img = this.imageCache.get(layer.src);
    if (!img) {
      img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = layer.src;
      img.onload = () => {
        this.imageCache.set(layer.src, img!);
        this.render();
      };
      return;
    }

    ctx.save();

    // Corner Radius Clipping
    if (layer.cornerRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, layer.width, layer.height, layer.cornerRadius);
      ctx.clip();
    }

    // Flip Transforms
    if (layer.flipHorizontal || layer.flipVertical) {
      ctx.translate(layer.flipHorizontal ? layer.width : 0, layer.flipVertical ? layer.height : 0);
      ctx.scale(layer.flipHorizontal ? -1 : 1, layer.flipVertical ? -1 : 1);
    }

    // Real-time CSS Filter application
    ctx.filter = ImageAdjuster.toCSSFilter(layer.adjustments);

    // Apply Effects
    if (layer.effects.shadow.enabled) {
      ctx.shadowColor = layer.effects.shadow.color;
      ctx.shadowBlur = layer.effects.shadow.blur;
      ctx.shadowOffsetX = layer.effects.shadow.offsetX;
      ctx.shadowOffsetY = layer.effects.shadow.offsetY;
    }

    ctx.drawImage(img, 0, 0, layer.width, layer.height);

    // Border Effect
    if (layer.effects.border.enabled && layer.effects.border.width > 0) {
      ctx.strokeStyle = layer.effects.border.color;
      ctx.lineWidth = layer.effects.border.width;
      if (layer.cornerRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(0, 0, layer.width, layer.height, layer.cornerRadius);
        ctx.stroke();
      } else {
        ctx.strokeRect(0, 0, layer.width, layer.height);
      }
    }

    ctx.restore();
  }

  // -------------------------------------------------------------
  // Export Rasterization
  // -------------------------------------------------------------

  public exportCanvas(format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png', quality = 0.95): string {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = this.document.width;
    exportCanvas.height = this.document.height;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return '';

    // Draw Background
    if (format !== 'image/png' || this.document.backgroundColor !== 'transparent') {
      expCtx.fillStyle = this.document.backgroundColor || '#FFFFFF';
      expCtx.fillRect(0, 0, this.document.width, this.document.height);
    }

    // Draw All Visible Layers
    for (const layer of this.document.layers) {
      if (!layer.visible) continue;
      this.renderLayer(expCtx, layer);
    }

    return exportCanvas.toDataURL(format, quality);
  }
}
