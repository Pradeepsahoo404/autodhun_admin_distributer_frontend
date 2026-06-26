'use client';

import { useId, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLineChartProps {
  values: number[];
  className?: string;
  height?: number;
  strokeClassName?: string;
  fillClassName?: string;
}

function buildLineGeometry(values: number[], width: number, height: number) {
  if (values.length === 0) {
    return { linePath: '', areaPath: '', points: [] as { x: number; y: number; value: number }[] };
  }

  const max = Math.max(...values, 1);
  const innerHeight = height - 6;
  const step = values.length > 1 ? width / (values.length - 1) : 0;

  const points = values.map((value, index) => {
    const x = values.length > 1 ? index * step : width / 2;
    const y = 3 + innerHeight - (value / max) * innerHeight;
    return { x, y, value };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? width} ${height} L ${points[0]?.x ?? 0} ${height} Z`;

  return { linePath, areaPath, points };
}

export function DashboardLineChart({
  values,
  className,
  height = 44,
  strokeClassName = 'stroke-brand-lime',
  fillClassName = 'fill-brand-lime/15',
}: DashboardLineChartProps) {
  const gradientId = useId();
  const width = 100;
  const { linePath, areaPath, points } = useMemo(
    () => buildLineGeometry(values, width, height),
    [values, height],
  );

  if (values.length === 0) {
    return <div className={cn('h-11 w-full rounded-md bg-[#0d0d0d]', className)} />;
  }

  return (
    <div className={cn('overflow-hidden', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-11 w-full"
        role="img"
        aria-label="Entries per day line chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {areaPath ? (
          <path d={areaPath} className={cn(fillClassName, 'text-brand-lime')} fill={`url(#${gradientId})`} />
        ) : null}

        {linePath ? (
          <path
            d={linePath}
            fill="none"
            className={cn(strokeClassName, 'stroke-[2px]')}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}

        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={values.length <= 7 ? 1.8 : 1.2}
            className="fill-brand-lime"
          >
            <title>{`${point.value} entries`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}
