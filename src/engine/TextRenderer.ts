import { TextLayer } from './LayerModel';

export class TextRenderer {
  public static render(ctx: CanvasRenderingContext2D, layer: TextLayer): void {
    ctx.save();

    const fontSize = layer.fontSize || 24;
    const fontFamily = layer.fontFamily || 'Inter, sans-serif';
    const fontWeight = layer.fontWeight || 400;
    const fontStyle = layer.fontStyle || 'normal';

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = layer.textAlign === 'justify' ? 'left' : layer.textAlign;

    // Apply Background Box if enabled
    if (layer.backgroundColor && layer.backgroundColor !== 'transparent') {
      ctx.fillStyle = layer.backgroundColor;
      const pad = layer.padding || 8;
      ctx.fillRect(-pad, -pad, layer.width + pad * 2, layer.height + pad * 2);
    }

    // Apply Drop Shadow / Glow
    if (layer.effects.shadow.enabled) {
      ctx.shadowColor = layer.effects.shadow.color;
      ctx.shadowBlur = layer.effects.shadow.blur;
      ctx.shadowOffsetX = layer.effects.shadow.offsetX;
      ctx.shadowOffsetY = layer.effects.shadow.offsetY;
    } else if (layer.effects.glow.enabled) {
      ctx.shadowColor = layer.effects.glow.color;
      ctx.shadowBlur = layer.effects.glow.blur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    const lines = (layer.text || '').split('\n');
    const lineHeight = fontSize * (layer.lineHeight || 1.25);

    let startX = 0;
    if (layer.textAlign === 'center') {
      startX = layer.width / 2;
    } else if (layer.textAlign === 'right') {
      startX = layer.width;
    }

    lines.forEach((line, index) => {
      const lineY = index * lineHeight;

      // Draw Stroke Outline
      if (layer.stroke && layer.strokeWidth && layer.strokeWidth > 0) {
        ctx.strokeStyle = layer.stroke;
        ctx.lineWidth = layer.strokeWidth;
        ctx.strokeText(line, startX, lineY);
      }

      // Draw Fill
      ctx.fillStyle = layer.fill || '#FFFFFF';
      ctx.fillText(line, startX, lineY);

      // Underline / Line-through
      if (layer.textDecoration === 'underline' || layer.textDecoration === 'line-through') {
        const textMetrics = ctx.measureText(line);
        const lineWidth = textMetrics.width;
        let lineStartX = startX;
        if (layer.textAlign === 'center') lineStartX = startX - lineWidth / 2;
        else if (layer.textAlign === 'right') lineStartX = startX - lineWidth;

        ctx.beginPath();
        ctx.strokeStyle = layer.fill || '#FFFFFF';
        ctx.lineWidth = Math.max(1, fontSize * 0.06);

        const decoY = layer.textDecoration === 'underline' ? lineY + fontSize * 1.05 : lineY + fontSize * 0.55;
        ctx.moveTo(lineStartX, decoY);
        ctx.lineTo(lineStartX + lineWidth, decoY);
        ctx.stroke();
      }
    });

    ctx.restore();
  }
}
