import {
  EditorLayer,
  ImageLayer,
  TextLayer,
  DEFAULT_LAYER_EFFECTS,
  DEFAULT_IMAGE_ADJUSTMENTS,
} from '../engine/LayerModel';
import {
  prepareImageForAPI,
  analyzeEnhancements,
  smartCropLocal,
  compositeBlurBackground,
} from '../engine/ImageTools';

export interface AIToolResult {
  success: boolean;
  message: string;
  previewUrl?: string;
  modifiedLayer?: EditorLayer;
  newLayers?: EditorLayer[];
  error?: {
    code: string;
    message: string;
  };
}

type ProgressCallback = (p: number, msg: string) => void;

/**
 * All AI tools talk to real Next.js API routes backed by real external
 * providers (remove.bg, Clipdrop, OCR.Space, Replicate) or genuine local
 * pixel processing. No fake results, no placeholder success messages.
 */
export class AIProcessors {
  public static async removeBackground(
    layer: ImageLayer,
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    try {
      if (onProgress) onProgress(10, 'Preparing image for remove.bg...');
      const { src } = await prepareImageForAPI(layer.src, 2000);

      if (onProgress) onProgress(25, 'Sending image to remove.bg...');
      const res = await fetch('/api/ai/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageSrc: src }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (onProgress) onProgress(100, 'Failed');
        return {
          success: false,
          message: data.error?.message || 'Background removal failed. Please try again.',
          error: data.error,
        };
      }

      if (onProgress) onProgress(85, 'Building transparent cutout layer...');
      const cutout: ImageLayer = {
        ...layer,
        id: 'cutout_' + Math.random().toString(36).substr(2, 9),
        name: `${layer.name} (Cutout)`,
        src: data.outputUrl || layer.src,
        adjustments: JSON.parse(JSON.stringify(DEFAULT_IMAGE_ADJUSTMENTS)),
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      };
      if (onProgress) onProgress(100, 'Done');
      return {
        success: true,
        message: 'Background removed — transparent cutout created.',
        previewUrl: cutout.src,
        newLayers: [cutout],
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Background removal could not be completed. Please try again.',
        error: { code: 'AI_PROCESSING_FAILED', message: err.message },
      };
    }
  }

  public static async removeObject(
    layer: ImageLayer,
    maskSrc?: string,
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    try {
      if (onProgress) onProgress(10, 'Preparing image for Clipdrop Cleanup...');
      const { src } = await prepareImageForAPI(layer.src, 2000);

      if (onProgress) onProgress(30, 'Sending image and mask to Clipdrop...');
      const res = await fetch('/api/ai/remove-object', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageSrc: src, maskSrc }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (onProgress) onProgress(100, 'Failed');
        return {
          success: false,
          message: data.error?.message || 'Object cleanup could not be completed. Please try again.',
          error: data.error,
        };
      }

      if (onProgress) onProgress(90, 'Applying cleaned result...');
      const updated: ImageLayer = {
        ...layer,
        src: data.outputUrl || layer.src,
        adjustments: JSON.parse(JSON.stringify(DEFAULT_IMAGE_ADJUSTMENTS)),
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      };
      if (onProgress) onProgress(100, 'Done');
      return {
        success: true,
        message: 'Object removed and region cleaned up.',
        previewUrl: updated.src,
        modifiedLayer: updated,
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Unable to reach object removal service.',
        error: { code: 'NETWORK_ERROR', message: err.message },
      };
    }
  }

  public static async aiUpscale(
    layer: ImageLayer,
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    try {
      if (onProgress) onProgress(10, 'Preparing image for Clipdrop Upscale...');
      const prepared = await prepareImageForAPI(layer.src, 2000);

      if (onProgress) onProgress(30, 'Running super-resolution neural upscaling...');
      const res = await fetch('/api/ai/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageSrc: prepared.src,
          targetWidth: prepared.width,
          targetHeight: prepared.height,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (onProgress) onProgress(100, 'Failed');
        return {
          success: false,
          message: data.error?.message || 'Image upscale failed. Please try again.',
          error: data.error,
        };
      }

      if (onProgress) onProgress(85, 'Compositing 2x result...');
      const updated: ImageLayer = {
        ...layer,
        id: 'upscaled_' + Math.random().toString(36).substr(2, 9),
        name: `${layer.name} (2X Upscaled)`,
        src: data.outputUrl || layer.src,
        naturalWidth: layer.naturalWidth * 2,
        naturalHeight: layer.naturalHeight * 2,
        width: Math.min(layer.width * 2, Math.round((layer.width * layer.naturalWidth * 2) / layer.naturalWidth)),
        height: Math.min(layer.height * 2, Math.round((layer.height * layer.naturalHeight * 2) / layer.naturalHeight)),
        adjustments: { ...layer.adjustments, sharpen: Math.min(100, layer.adjustments.sharpen + 15) },
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      };
      if (onProgress) onProgress(100, 'Done');
      return {
        success: true,
        message: 'Image upscaled to 2x resolution.',
        previewUrl: updated.src,
        modifiedLayer: updated,
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Image upscaling failed. Please try again.',
        error: { code: 'UPSCALE_FAILED', message: err.message },
      };
    }
  }

  public static async aiExpand(
    layer: ImageLayer,
    extendLeft = 100,
    extendRight = 100,
    extendUp = 100,
    extendDown = 100,
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    try {
      if (onProgress) onProgress(10, 'Preparing image for Clipdrop Uncrop...');
      const { src } = await prepareImageForAPI(layer.src, 2000);

      if (onProgress) onProgress(35, 'Synthesizing outpainting content...');
      const res = await fetch('/api/ai/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageSrc: src, extendLeft, extendRight, extendUp, extendDown }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (onProgress) onProgress(100, 'Failed');
        return {
          success: false,
          message: data.error?.message || 'AI Expand failed. Please try again.',
          error: data.error,
        };
      }

      if (onProgress) onProgress(85, 'Repositioning expanded layer...');
      const newWidth = layer.width + extendLeft + extendRight;
      const newHeight = layer.height + extendUp + extendDown;
      const updated: ImageLayer = {
        ...layer,
        src: data.outputUrl || layer.src,
        width: newWidth,
        height: newHeight,
        x: Math.max(0, layer.x - extendLeft),
        y: Math.max(0, layer.y - extendUp),
        adjustments: JSON.parse(JSON.stringify(DEFAULT_IMAGE_ADJUSTMENTS)),
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      };
      if (onProgress) onProgress(100, 'Done');
      return {
        success: true,
        message: 'Canvas expanded with generated content.',
        previewUrl: updated.src,
        modifiedLayer: updated,
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'AI Expand failed. Please try again.',
        error: { code: 'EXPAND_FAILED', message: err.message },
      };
    }
  }

  public static async smartEnhance(
    layer: ImageLayer,
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    try {
      if (onProgress) onProgress(20, 'Analyzing color histogram and dynamic range...');
      const adj = await analyzeEnhancements(layer.src);

      const updated: ImageLayer = {
        ...layer,
        adjustments: {
          ...layer.adjustments,
          brightness: Math.max(-100, Math.min(100, layer.adjustments.brightness + adj.brightness)),
          contrast: Math.max(-100, Math.min(100, layer.adjustments.contrast + adj.contrast)),
          saturation: Math.max(-100, Math.min(100, layer.adjustments.saturation + adj.saturation)),
          exposure: Math.max(-100, Math.min(100, layer.adjustments.exposure + adj.exposure)),
          sharpen: Math.max(0, Math.min(100, adj.sharpen)),
        },
      };

      // Render a real preview of the enhanced result by baking the filters into a canvas.
      if (onProgress) onProgress(70, 'Rendering enhanced preview...');
      const { ImageAdjuster } = await import('../engine/ImageAdjuster');
      const { loadImage, canvasFromImage } = await import('../engine/ImageTools');
      const img = await loadImage(layer.src);
      const previewCanvas = canvasFromImage(img, Math.min(1024, img.naturalWidth || 1024), Math.min(1024, img.naturalHeight || 1024));
      const pctx = previewCanvas.getContext('2d');
      if (pctx) {
        pctx.filter = ImageAdjuster.toCSSFilter(updated.adjustments);
        pctx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
      }
      const previewUrl = previewCanvas.toDataURL('image/jpeg', 0.85);

      if (onProgress) onProgress(100, 'Done');
      return {
        success: true,
        message: `Smart Enhance applied (brightness ${adj.brightness > 0 ? '+' : ''}${adj.brightness}, contrast ${adj.contrast > 0 ? '+' : ''}${adj.contrast}, saturation ${adj.saturation > 0 ? '+' : ''}${adj.saturation}).`,
        previewUrl,
        modifiedLayer: updated,
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Smart Enhance could not analyze this image.',
        error: { code: 'ENHANCE_FAILED', message: err.message },
      };
    }
  }

  public static async blurBackground(
    layer: ImageLayer,
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    try {
      if (onProgress) onProgress(20, 'Isolating subject and applying bokeh blur...');
      const { src, note } = await compositeBlurBackground(layer.src, 16);

      const updated: ImageLayer = {
        ...layer,
        src,
        adjustments: {
          ...layer.adjustments,
          blur: 0,
        },
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      };

      if (onProgress) onProgress(100, 'Done');
      return {
        success: true,
        message: note || 'Background blurred — subject kept sharp.',
        previewUrl: src,
        modifiedLayer: updated,
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Background blur could not be applied to this image.',
        error: { code: 'BLUR_FAILED', message: err.message },
      };
    }
  }

  public static async extractText(
    layer: ImageLayer,
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    try {
      if (onProgress) onProgress(10, 'Preparing image for OCR.Space...');
      const { src } = await prepareImageForAPI(layer.src, 2000);

      if (onProgress) onProgress(30, 'Scanning text lines with OCR.Space...');
      const res = await fetch('/api/ai/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageSrc: src }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success || !Array.isArray(data.textLayers) || data.textLayers.length === 0) {
        if (onProgress) onProgress(100, 'Failed');
        return {
          success: false,
          message: data.error?.message || 'No readable text could be extracted from this image.',
          error: data.error || { code: 'NO_TEXT_FOUND', message: 'No readable text found.' },
        };
      }

      if (onProgress) onProgress(75, 'Building editable text layers...');
      const newLayers: TextLayer[] = (data.textLayers as any[]).map((t, idx) => ({
        id: 'ocr_text_' + Math.random().toString(36).substr(2, 9),
        name: `OCR Text ${idx + 1}`,
        type: 'text',
        text: String(t.text || '').trim() || 'Extracted Text',
        fontFamily: 'Outfit, sans-serif',
        fontSize: Math.max(14, Math.min(96, Math.round(t.height * 0.85) || 28)),
        fontWeight: 700,
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'left',
        fill: '#FFFFFF',
        letterSpacing: 0.5,
        lineHeight: 1.2,
        x: Math.max(0, Math.round(t.x) + layer.x),
        y: Math.max(0, Math.round(t.y) + layer.y),
        width: Math.max(80, Math.round(t.width)),
        height: Math.max(28, Math.round(t.height)),
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        semanticRole: idx === 0 ? 'headline' : 'subtitle',
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      }));

      if (onProgress) onProgress(100, 'Done');
      return {
        success: true,
        message: `Extracted ${newLayers.length} editable text layer${newLayers.length > 1 ? 's' : ''}.`,
        previewUrl: layer.src,
        newLayers,
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Text extraction failed. Please ensure the image has readable text.',
        error: { code: 'OCR_FAILED', message: err.message },
      };
    }
  }

  public static async smartSelect(
    layer: ImageLayer,
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    try {
      if (onProgress) onProgress(10, 'Preparing image for Replicate segmentation...');
      const { src } = await prepareImageForAPI(layer.src, 2000);

      if (onProgress) onProgress(30, 'Segmenting subject with Replicate...');
      const res = await fetch('/api/ai/smart-select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageSrc: src }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success || !data.outputUrl) {
        if (onProgress) onProgress(100, 'Failed');
        return {
          success: false,
          message: data.error?.message || 'Object segmentation could not isolate the subject.',
          error: data.error,
        };
      }

      if (onProgress) onProgress(80, 'Building subject layer...');
      const subject: ImageLayer = {
        ...layer,
        id: 'subject_' + Math.random().toString(36).substr(2, 9),
        name: `${layer.name} (Subject)`,
        src: data.outputUrl || layer.src,
        adjustments: JSON.parse(JSON.stringify(DEFAULT_IMAGE_ADJUSTMENTS)),
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      };
      if (onProgress) onProgress(100, 'Done');
      return {
        success: true,
        message: 'Subject isolated into its own layer.',
        previewUrl: subject.src,
        newLayers: [subject],
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Object segmentation could not isolate the subject.',
        error: { code: 'SELECT_FAILED', message: err.message },
      };
    }
  }

  public static async smartCrop(
    layer: ImageLayer,
    targetAspect: string = '1:1',
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    try {
      if (onProgress) onProgress(20, 'Analyzing subject focus region...');
      const { src, width, height } = await smartCropLocal(layer.src, targetAspect);

      const updated: ImageLayer = {
        ...layer,
        src,
        naturalWidth: width,
        naturalHeight: height,
        width,
        height,
        adjustments: JSON.parse(JSON.stringify(DEFAULT_IMAGE_ADJUSTMENTS)),
        effects: JSON.parse(JSON.stringify(DEFAULT_LAYER_EFFECTS)),
      };

      if (onProgress) onProgress(100, 'Done');
      return {
        success: true,
        message: `Smart crop applied for ${targetAspect} framing.`,
        previewUrl: src,
        modifiedLayer: updated,
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Smart Crop could not be applied to this image.',
        error: { code: 'CROP_FAILED', message: err.message },
      };
    }
  }

  /**
   * Replace Object is not supported by the currently configured providers.
   * Returns an honest error instead of a fake success.
   */
  public static async replaceObject(
    layer: ImageLayer,
    _prompt?: string,
    onProgress?: ProgressCallback
  ): Promise<AIToolResult> {
    if (onProgress) onProgress(100, 'Unavailable');
    return {
      success: false,
      message: 'Replace Object is not available with the current providers. Use Remove Object or manual editing instead.',
      error: {
        code: 'NOT_SUPPORTED',
        message: 'No configured provider supports generative object replacement.',
      },
    };
  }
}