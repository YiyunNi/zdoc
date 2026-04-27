import React from 'react';
import type { ConfidenceLevel } from '../types';
import styles from './ConfidenceDot.module.css';

const colorMap: Record<ConfidenceLevel, string> = {
  high: '#22c55e',
  medium: '#eab308',
  low: '#ef4444',
};

const labelMap: Record<ConfidenceLevel, string> = {
  high: 'High confidence — answer directly supported by documentation',
  medium: 'Medium confidence — partially supported by documentation',
  low: 'Low confidence — limited documentation available',
};

export interface ConfidenceDotProps {
  level?: ConfidenceLevel;
}

export function ConfidenceDot({ level }: ConfidenceDotProps): React.ReactElement | null {
  if (!level) return null;
  return (
    <span
      className={styles.dot}
      style={{ backgroundColor: colorMap[level] }}
      title={labelMap[level]}
      aria-label={labelMap[level]}
    />
  );
}
