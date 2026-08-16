import { ReactNode } from 'react';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Simple CSS-only tooltip to keep interactions lightweight and avoid
 * default browser / library styling.
 */
export const Tooltip = ({ content, children, placement = 'top' }: TooltipProps) => {
  const text = typeof content === 'string' ? content : '';
  let offset: string;
  switch (placement) {
    case 'left': offset = 'left: calc(100% + 8px); top: 50%; transform: translateY(-50%);'; break;
    case 'right': offset = 'right: calc(100% + 8px); top: 50%; transform: translateY(-50%);'; break;
    case 'bottom': offset = 'top: calc(100% + 8px); left: 50%; transform: translateX(-50%);'; break;
    case 'top':
    default: offset = 'bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);';
  }
  return (
    <span
      data-tip
      data-content={text}
      style={{ position: 'relative', display: 'inline-flex', cursor: 'pointer' }}
      aria-label={text || undefined}
    >
      {children as ReactNode}
      <style>{`
        [data-tip]:hover::after {
          content: attr(data-content);
          position: absolute;
          ${offset}
          padding: 5px 9px;
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
          color: var(--text-primary);
          background: var(--bg-panel-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xs);
          box-shadow: var(--shadow-sm);
          opacity: 0.95;
          pointer-events: none;
          z-index: 999;
        }
      `}</style>
    </span>
  );
};
