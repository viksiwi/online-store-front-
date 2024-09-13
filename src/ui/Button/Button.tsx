import { FC, ReactNode } from 'react';

interface Button {
  size: 'medium' | 'small' | 'large' | 'miniature';
  background: 'primary' | 'secondary' | 'tertiary' | 'transparent' | 'base';
  color: 'accent' | 'basic' | 'bark';
  children?: string | ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  disabled?: boolean;
}

export const Button: FC<Button> = ({
  size,
  children,
  background,
  color,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={(e) => onClick && onClick(e)}
      className={`btn btn-${size} btn-${color} btn-${background}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
