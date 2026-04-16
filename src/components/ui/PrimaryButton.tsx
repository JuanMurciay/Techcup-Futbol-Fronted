import type { ButtonHTMLAttributes } from 'react';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton({ children, ...props }: PrimaryButtonProps) {
  return (
    <button className="tc-btn-primary" {...props}>
      {children}
    </button>
  );
}
