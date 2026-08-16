import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Tooltip } from './Tooltip';

export interface ToolButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: ReactNode;
  active?: boolean;
  size?: 'sm' | 'md';
  tooltip?: string;
}

/**
 * Premium toolbar button: icon + label with active state and hover glow.
 */
export const ToolButton = ({ icon, label, active, size = 'md', tooltip, ...props }: ToolButtonProps) => {
  const content = (
    <button
      type="button"
      {...props}
      data-active={active ? 'true' : 'false'}
      className={`edv-tool-btn edv-tool-btn--${size} ${props.className || ''}`}
    >
      <span className="edv-tool-btn__icon">{icon}</span>
      {label !== undefined && <span className="edv-tool-btn__label">{label}</span>}
    </button>
  );

  return tooltip ? <Tooltip content={tooltip}>{content}</Tooltip> : content;
};
