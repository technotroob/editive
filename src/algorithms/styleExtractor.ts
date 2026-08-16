import { CanvasDocument, EditorLayer, TextLayer, ShapeLayer, ImageLayer } from '../engine/LayerModel';

export interface DesignMemory {
  id: string;
  name: string;
  createdAt: string;
  typography: {
    headlineFont: string;
    bodyFont: string;
    headlineWeight: number;
    bodyWeight: number;
  };
  palette: {
    dominant: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  shadowProfile: {
    blur: number;
    offsetX: number;
    offsetY: number;
    color: string;
  };
  borderProfile: {
    width: number;
    color: string;
    radius: number;
  };
  buttonStyle: {
    fill: string;
    textColor: string;
    radius: number;
  };
}

export class StyleExtractor {
  /**
   * Extracts reusable design tokens from an active CanvasDocument into a DesignMemory snapshot
   */
  public static extractMemory(doc: CanvasDocument, name = 'Brand Style'): DesignMemory {
    let headlineFont = 'Outfit, sans-serif';
    let bodyFont = 'Inter, sans-serif';
    let headlineWeight = 700;
    let bodyWeight = 400;

    let dominantColor = '#3B82F6';
    let secondaryColor = '#6366F1';
    let accentColor = '#10B981';
    let backgroundColor = doc.backgroundColor || '#0F172A';
    let textColor = '#FFFFFF';

    let shadowBlur = 15;
    let shadowColor = 'rgba(0, 0, 0, 0.4)';
    let cornerRadius = 8;
    let buttonFill = '#3B82F6';
    let buttonTextColor = '#FFFFFF';

    // Scan Text Layers
    const textLayers = doc.layers.filter((l): l is TextLayer => l.type === 'text');
    if (textLayers.length > 0) {
      const headline = textLayers.find((l) => (l.fontSize || 0) >= 32 || l.semanticRole === 'headline') || textLayers[0];
      headlineFont = headline.fontFamily;
      headlineWeight = Number(headline.fontWeight) || 700;
      textColor = headline.fill || '#FFFFFF';

      const body = textLayers.find((l) => (l.fontSize || 0) < 32 || l.semanticRole === 'subtitle');
      if (body) {
        bodyFont = body.fontFamily;
        bodyWeight = Number(body.fontWeight) || 400;
      }
    }

    // Scan Shape Layers for buttons / badges
    const shapeLayers = doc.layers.filter((l): l is ShapeLayer => l.type === 'shape');
    if (shapeLayers.length > 0) {
      const ctaShape = shapeLayers.find((l) => l.semanticRole === 'cta') || shapeLayers[0];
      buttonFill = ctaShape.fill;
      cornerRadius = ctaShape.cornerRadius || 8;
      dominantColor = ctaShape.fill;
    }

    return {
      id: 'memory_' + Math.random().toString(36).substr(2, 9),
      name,
      createdAt: new Date().toISOString(),
      typography: {
        headlineFont,
        bodyFont,
        headlineWeight,
        bodyWeight,
      },
      palette: {
        dominant: dominantColor,
        secondary: secondaryColor,
        accent: accentColor,
        background: backgroundColor,
        text: textColor,
      },
      shadowProfile: {
        blur: shadowBlur,
        offsetX: 0,
        offsetY: 6,
        color: shadowColor,
      },
      borderProfile: {
        width: 1,
        color: 'rgba(255, 255, 255, 0.1)',
        radius: cornerRadius,
      },
      buttonStyle: {
        fill: buttonFill,
        textColor: buttonTextColor,
        radius: cornerRadius,
      },
    };
  }

  /**
   * Applies a saved DesignMemory cleanly onto another canvas document
   */
  public static applyMemory(doc: CanvasDocument, memory: DesignMemory): CanvasDocument {
    const updated: CanvasDocument = JSON.parse(JSON.stringify(doc));

    // 1. Update Canvas Background
    if (memory.palette.background) {
      updated.backgroundColor = memory.palette.background;
    }

    // 2. Update Layers
    updated.layers = updated.layers.map((layer: EditorLayer) => {
      // Text Layers
      if (layer.type === 'text') {
        const isHeadline = (layer.fontSize || 0) >= 32 || layer.semanticRole === 'headline';
        const isCTA = layer.semanticRole === 'cta';

        return {
          ...layer,
          fontFamily: isHeadline ? memory.typography.headlineFont : memory.typography.bodyFont,
          fontWeight: isHeadline ? memory.typography.headlineWeight : memory.typography.bodyWeight,
          fill: isCTA ? memory.buttonStyle.textColor : isHeadline ? memory.palette.text : memory.palette.secondary,
        } as TextLayer;
      }

      // Shape Layers
      if (layer.type === 'shape') {
        const isCTA = layer.semanticRole === 'cta';
        const isBackground = layer.semanticRole === 'background';

        if (isBackground) {
          return { ...layer, fill: memory.palette.background } as ShapeLayer;
        }

        return {
          ...layer,
          fill: isCTA ? memory.buttonStyle.fill : memory.palette.dominant,
          cornerRadius: memory.borderProfile.radius,
        } as ShapeLayer;
      }

      // Image Layers (Corner radius & Shadows)
      if (layer.type === 'image') {
        return {
          ...layer,
          cornerRadius: memory.borderProfile.radius,
        } as ImageLayer;
      }

      return layer;
    });

    return updated;
  }
}
