import { CanvasDocument, EditorLayer, TextLayer, ShapeLayer, ImageLayer } from '../engine/LayerModel';

export interface ReframePreset {
  id: string;
  name: string;
  category: 'Social' | 'Video' | 'Print' | 'Custom';
  width: number;
  height: number;
  aspectRatioLabel: string;
  iconName?: string;
}

export const REFRAME_PRESETS: ReframePreset[] = [
  {
    id: 'ig_post',
    name: 'Instagram Post',
    category: 'Social',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1',
  },
  {
    id: 'ig_story',
    name: 'Instagram Story / Reel',
    category: 'Social',
    width: 1080,
    height: 1920,
    aspectRatioLabel: '9:16',
  },
  {
    id: 'yt_thumb',
    name: 'YouTube Thumbnail',
    category: 'Video',
    width: 1920,
    height: 1080,
    aspectRatioLabel: '16:9',
  },
  {
    id: 'linkedin_post',
    name: 'LinkedIn Post',
    category: 'Social',
    width: 1200,
    height: 627,
    aspectRatioLabel: '1.91:1',
  },
  {
    id: 'portrait_poster',
    name: 'Portrait Poster',
    category: 'Print',
    width: 1080,
    height: 1350,
    aspectRatioLabel: '4:5',
  },
];

export class ReframeEngine {
  /**
   * Intelligently reframes a canvas document to target dimensions while preserving subject and layout hierarchy
   */
  public static reframeDocument(
    doc: CanvasDocument,
    targetWidth: number,
    targetHeight: number
  ): CanvasDocument {
    const origW = doc.width;
    const origH = doc.height;

    const scaleX = targetWidth / origW;
    const scaleY = targetHeight / origH;
    const minScale = Math.min(scaleX, scaleY);

    const isTargetVertical = targetHeight > targetWidth * 1.2;
    const isTargetHorizontal = targetWidth > targetHeight * 1.2;

    const reframed: CanvasDocument = JSON.parse(JSON.stringify(doc));
    reframed.width = targetWidth;
    reframed.height = targetHeight;

    reframed.layers = reframed.layers.map((layer: EditorLayer) => {
      // 1. Background Layer (fill new canvas)
      if (layer.semanticRole === 'background' || (layer.x === 0 && layer.y === 0 && layer.width >= origW && layer.height >= origH)) {
        return {
          ...layer,
          x: 0,
          y: 0,
          width: targetWidth,
          height: targetHeight,
        };
      }

      // 2. Main Visual Subject / Product
      if (layer.semanticRole === 'subject' || layer.type === 'image') {
        const imgScale = isTargetVertical ? Math.min(scaleX, 1.2) : minScale;
        const newW = Math.round(layer.width * imgScale);
        const newH = Math.round(layer.height * imgScale);

        let newX = Math.round((targetWidth - newW) / 2);
        let newY = Math.round((targetHeight - newH) / 2);

        if (isTargetVertical) {
          newY = Math.round(targetHeight * 0.32); // Centered in vertical format
        } else if (isTargetHorizontal) {
          newX = Math.round(targetWidth * 0.54); // Offset right in landscape
          newY = Math.round((targetHeight - newH) / 2);
        }

        return {
          ...layer,
          x: newX,
          y: newY,
          width: newW,
          height: newH,
        } as ImageLayer;
      }

      // 3. Headline Text
      if (layer.semanticRole === 'headline' || (layer.type === 'text' && (layer as TextLayer).fontSize >= 28)) {
        const textL = layer as TextLayer;
        const newFontSize = Math.round(textL.fontSize * (isTargetVertical ? 1.05 : minScale));
        const newW = isTargetHorizontal ? Math.round(targetWidth * 0.46) : Math.round(targetWidth * 0.88);
        let newX = isTargetHorizontal ? Math.round(targetWidth * 0.06) : Math.round((targetWidth - newW) / 2);
        let newY = isTargetVertical ? Math.round(targetHeight * 0.12) : isTargetHorizontal ? Math.round(targetHeight * 0.22) : Math.round(layer.y * scaleY);

        return {
          ...textL,
          x: newX,
          y: newY,
          width: newW,
          fontSize: newFontSize,
          textAlign: isTargetHorizontal ? 'left' : 'center',
        } as TextLayer;
      }

      // 4. Subtitle Text
      if (layer.semanticRole === 'subtitle') {
        const textL = layer as TextLayer;
        const newFontSize = Math.round(textL.fontSize * (isTargetVertical ? 1.0 : minScale));
        const newW = isTargetHorizontal ? Math.round(targetWidth * 0.44) : Math.round(targetWidth * 0.82);
        let newX = isTargetHorizontal ? Math.round(targetWidth * 0.06) : Math.round((targetWidth - newW) / 2);
        let newY = isTargetVertical ? Math.round(targetHeight * 0.22) : isTargetHorizontal ? Math.round(targetHeight * 0.46) : Math.round(layer.y * scaleY);

        return {
          ...textL,
          x: newX,
          y: newY,
          width: newW,
          fontSize: newFontSize,
          textAlign: isTargetHorizontal ? 'left' : 'center',
        } as TextLayer;
      }

      // 5. CTA Button / Shapes
      if (layer.semanticRole === 'cta') {
        const newW = Math.round(layer.width * (isTargetVertical ? 1.1 : minScale));
        const newH = Math.round(layer.height * (isTargetVertical ? 1.1 : minScale));
        let newX = isTargetHorizontal ? Math.round(targetWidth * 0.06) : Math.round((targetWidth - newW) / 2);
        let newY = isTargetVertical ? Math.round(targetHeight * 0.84) : isTargetHorizontal ? Math.round(targetHeight * 0.68) : Math.round(layer.y * scaleY);

        return {
          ...layer,
          x: newX,
          y: newY,
          width: newW,
          height: newH,
        };
      }

      // Default proportional scaling fallback
      return {
        ...layer,
        x: Math.round(layer.x * scaleX),
        y: Math.round(layer.y * scaleY),
        width: Math.round(layer.width * minScale),
        height: Math.round(layer.height * minScale),
      };
    });

    return reframed;
  }
}
