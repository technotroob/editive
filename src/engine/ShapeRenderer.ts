import { ShapeLayer } from './LayerModel';

export class ShapeRenderer {
  public static render(ctx: CanvasRenderingContext2D, layer: ShapeLayer): void {
    ctx.save();
    ctx.beginPath();

    const w = layer.width;
    const h = layer.height;

    // Apply effects (Drop shadow / glow)
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

    // Set Fill / Gradient
    if (layer.gradient && layer.gradient.colors.length >= 2) {
      const angleRad = (layer.gradient.angle * Math.PI) / 180;
      const x1 = (1 - Math.cos(angleRad)) * (w / 2);
      const y1 = (1 - Math.sin(angleRad)) * (h / 2);
      const x2 = (1 + Math.cos(angleRad)) * (w / 2);
      const y2 = (1 + Math.sin(angleRad)) * (h / 2);

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      layer.gradient.colors.forEach((color, i) => {
        grad.addColorStop(i / (layer.gradient!.colors.length - 1), color);
      });
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = layer.fill;
    }

    ctx.strokeStyle = layer.stroke;
    ctx.lineWidth = layer.strokeWidth;

    switch (layer.shapeType) {
      case 'rect':
        ctx.rect(0, 0, w, h);
        break;

      case 'rounded-rect': {
        const r = Math.min(layer.cornerRadius, w / 2, h / 2);
        ctx.roundRect(0, 0, w, h, r);
        break;
      }

      case 'circle': {
        const radius = Math.min(w, h) / 2;
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        break;
      }

      case 'ellipse':
        ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        break;

      case 'triangle':
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        break;

      case 'star': {
        const points = layer.points || 5;
        const outerRadius = Math.min(w, h) / 2;
        const innerRadius = outerRadius * 0.45;
        const cx = w / 2;
        const cy = h / 2;

        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / points;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < points; i++) {
          let x = cx + Math.cos(rot) * outerRadius;
          let y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        break;
      }

      case 'polygon': {
        const sides = layer.points || 6;
        const radius = Math.min(w, h) / 2;
        const cx = w / 2;
        const cy = h / 2;

        ctx.moveTo(cx + radius * Math.cos(0), cy + radius * Math.sin(0));
        for (let i = 1; i <= sides; i++) {
          ctx.lineTo(
            cx + radius * Math.cos((i * 2 * Math.PI) / sides),
            cy + radius * Math.sin((i * 2 * Math.PI) / sides)
          );
        }
        ctx.closePath();
        break;
      }

      case 'line':
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        break;

      case 'arrow': {
        const headlen = Math.min(20, w * 0.3);
        const y = h / 2;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.lineTo(w - headlen, y - headlen * 0.6);
        ctx.moveTo(w, y);
        ctx.lineTo(w - headlen, y + headlen * 0.6);
        break;
      }
    }

    if (layer.fill !== 'transparent' && layer.shapeType !== 'line') {
      ctx.fill();
    }
    if (layer.strokeWidth > 0 && layer.stroke !== 'transparent') {
      ctx.stroke();
    }

    ctx.restore();
  }
}
