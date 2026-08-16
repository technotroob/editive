import React, { useState } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: string;
  shortcut?: string;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'subtle';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  shortcut,
  isActive = false,
  size = 'md',
  variant = 'default',
  style,
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: '28px', height: '28px', padding: '4px' };
      case 'lg': return { width: '40px', height: '40px', padding: '8px' };
      case 'md': default: return { width: '34px', height: '34px', padding: '6px' };
    }
  };

  const getBackground = () => {
    if (isActive) {
      return variant === 'primary' ? 'var(--accent-primary)' : 'var(--bg-active)';
    }
    return 'transparent';
  };

  const getColor = () => {
    if (isActive) {
      return variant === 'primary' ? '#FFFFFF' : 'var(--accent-primary)';
    }
    return 'var(--text-secondary)';
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-sm)',
          border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
          backgroundColor: getBackground(),
          color: getColor(),
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-fast)',
          ...getDimensions(),
          ...style,
        }}
        {...props}
      >
        {icon}
      </button>

      {tooltip && showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1E2436',
            color: '#F3F4F6',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-medium)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{tooltip}</span>
          {shortcut && (
            <span
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                padding: '1px 4px',
                borderRadius: '3px',
                fontSize: '10px',
                color: 'var(--text-muted)',
              }}
            >
              {shortcut}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
