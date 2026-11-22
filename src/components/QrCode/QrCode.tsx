import { create } from 'qrcode';
import { useMemo } from 'react';
import styles from './QrCode.module.css';

/** Width of the blank border the QR specification requires around the symbol, in modules. */
const QUIET_ZONE = 4;

interface QrCodeProps {
  value: string;
  label: string;
}

function darkModulesPath(size: number, isDark: (row: number, column: number) => boolean): string {
  const squares: string[] = [];
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (isDark(row, column)) squares.push(`M${column + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`);
    }
  }
  return squares.join('');
}

export function QrCode({ value, label }: QrCodeProps) {
  const { size, path } = useMemo(() => {
    const { modules } = create(value, { errorCorrectionLevel: 'M' });
    return {
      size: modules.size,
      path: darkModulesPath(modules.size, (row, column) => modules.get(row, column) === 1),
    };
  }, [value]);
  const viewSize = size + QUIET_ZONE * 2;

  return (
    <svg
      className={styles.qr}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <rect className={styles.background} width={viewSize} height={viewSize} />
      <path className={styles.modules} d={path} />
    </svg>
  );
}
