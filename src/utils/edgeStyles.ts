// Edge styling utilities for highlighting and generation-based visual effects

import { getGenerationColor } from './colorUtils';

export interface EdgeStyleConfig {
  highlightColor: string;
  defaultColor: string;
  strokeWidths: number[];
}

export const DEFAULT_EDGE_CONFIG: EdgeStyleConfig = {
  highlightColor: '#fbbf24', // yellow
  defaultColor: '#565267',   // default gray
  strokeWidths: [3, 2.5, 2], // decreasing width for each generation
};

// Get edge style based on generation
export function getEdgeStyleForGeneration(generation: number, config: EdgeStyleConfig = DEFAULT_EDGE_CONFIG) {
  const color = getGenerationColor(config.highlightColor, config.defaultColor, generation);
  const strokeWidth = config.strokeWidths[generation - 1] || 2;

  return {
    stroke: color,
    strokeWidth,
  };
}
