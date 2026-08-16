import { DrawLayer } from './LayerModel';

export class DrawingEngine {
  public static render(ctx: CanvasRenderingContext2D, layer: DrawLayer): void {
    if (!layer.paths || layer.paths.length === 0) return;

    ctx.save();
    layer.paths.forEach((path) => {
      if (path.points.length < 2) return;

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = (layer.opacity || 1) * (path.opacity || 1);

      if (path.tool === 'highlighter') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.4;
      } else if (path.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      }

      ctx.moveTo(path.points[0].x, path.points[0].y);

      // Quadratic curve smoothing for organic strokes
      for (let i = 1; i < path.points.length - 1; i++) {
        const xc = (path.points[i].x + path.points[i + 1].x) / 2;
        const yc = (path.points[i].y + path.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(path.points[i].x, path.points[i].y, xc, yc);
      }

      const last = path.points[path.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }
}
