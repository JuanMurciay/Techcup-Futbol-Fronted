import type { CSSProperties } from 'react';
import { APP_LOGO_URL } from '../constants/branding';

type Props = { height?: number; style?: CSSProperties };

export function AppLogo({ height = 64, style }: Props) {
  return (
    <img
      src={APP_LOGO_URL}
      alt="TechCup"
      style={{
        height,
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
    />
  );
}
