import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost' | 'special';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--accent-primary)',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px var(--accent-primary-glow)',
          border: '1px solid rgba(255,255,255,0.15)',
        };
      case 'special':
        return {
          background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
          color: '#FFFFFF',
          boxShadow: '0 2px 12px rgba(139, 92, 246, 0.35)',
          border: '1px solid rgba(255,255,255,0.2)',
        };
      case 'destructive':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
      case 'tertiary':
        return {
          backgroundColor: 'var(--bg-panel-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        };
      case 'secondary':
      default:
        return {
          backgroundColor: 'var(--bg-panel-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-medium)',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '5px 10px', fontSize: '12px', borderRadius: 'var(--radius-sm)', gap: '6px' };
      case 'lg':
        return { padding: '10px 20px', fontSize: '15px', borderRadius: 'var(--radius-md)', gap: '10px' };
      case 'md':
      default:
        return { padding: '8px 14px', fontSize: '13px', borderRadius: 'var(--radius-sm)', gap: '8px' };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        transition: 'all var(--transition-fast)',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={className}
      {...props}
    >
      {isLoading && (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {!isLoading && icon && iconPosition === 'left' && icon}
      {children}
      {!isLoading && icon && iconPosition === 'right' && icon}
    </button>
  );
};
