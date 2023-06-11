import { memo } from 'react';

interface GridMatrixProps {
  width: number;
  height: number;
  gridSize: number;
}

interface Horizontal {
  width: number;
  height: number;
  gridSize: number;
  color: string;
  dasharray: string;
  opacity: number;
}

interface Vertical {
  width: number;
  height: number;
  gridSize: number;
  color: string;
  dasharray: string;
  opacity: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dasharray?: string;
  opacity: number;
}

let index = 0;

const linePresets = {
  gridLines: {
    color: '#2196f3',
    dasharray: `2`,
    opacity: 0.5,
  },
  guideLines1: {
    gridSize: 40,
    color: '#ff7961',
    dasharray: `4`,
    opacity: 0.5,
  },
  guideLines2: {
    gridSize: 80,
    color: '#ff7961',
    dasharray: `5`,
    opacity: 0.5,
  },
  centerLines: {
    color: '#ff7961',
    opacity: 1,
  },
};
/**
 * @private
 * @description returns a grid matrix with center and helper lines, in addition to grid lines to fit given width and height.
 * @param {object} props {width (int), height (int), gridSize (int)}
 */
const GridMatrix = ({ width, height, gridSize }: GridMatrixProps) => {
  if (!width || !height) return null;

  // sets up a row of horizontal lines filling the given width
  const horizontal = ({
    width,
    height,
    gridSize,
    color,
    dasharray,
    opacity,
  }: Horizontal) => {
    const horizontalLines = [];

    for (let y1 = height / 2; y1 < height; y1 += gridSize)
      horizontalLines.push(
        line({ x1: 0, y1, x2: width, y2: y1, color, dasharray, opacity })
      );

    for (let y1 = height / 2; y1 > 0; y1 -= gridSize)
      horizontalLines.push(
        line({ x1: 0, y1, x2: width, y2: y1, color, dasharray, opacity })
      );

    return horizontalLines;
  };

  // sets up a row of vertical lines filling the given height
  const vertical = ({
    width,
    height,
    gridSize,
    color,
    dasharray,
    opacity,
  }: Vertical) => {
    const verticalLines = [];

    for (let x1 = width / 2; x1 < width; x1 += gridSize)
      verticalLines.push(
        line({ x1, y1: 0, x2: x1, y2: height, color, dasharray, opacity })
      );

    for (let x1 = width / 2; x1 > 0; x1 -= gridSize)
      verticalLines.push(
        line({ x1, y1: 0, x2: x1, y2: height, color, dasharray, opacity })
      );

    return verticalLines;
  };

  // sets up an SVG line.
  const line = ({ x1, y1, x2, y2, color, dasharray, opacity }: Line) => {
    return (
      <line
        key={index++}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        opacity={opacity}
        strokeDasharray={dasharray}
        id="gridLine"
      />
    );
  };

  // #gridlines are are user defined. Items will snap to these grids.
  const gridLines = [
    ...horizontal({
      width,
      height,
      gridSize,
      ...linePresets.gridLines,
    }),
    ...vertical({
      width,
      height,
      gridSize,
      ...linePresets.gridLines,
    }),
  ];

  // #guideLines are fixed. Based on two different grid-lines (guidelines1 and guideLines2)
  const guideLines = [
    ...horizontal({
      width,
      height,
      ...linePresets.guideLines1,
    }),
    ...vertical({
      width,
      height,
      ...linePresets.guideLines1,
    }),
    ...horizontal({
      width,
      height,
      ...linePresets.guideLines2,
    }),
    ...vertical({
      width,
      height,
      ...linePresets.guideLines2,
    }),
  ];

  const centerLines = [];
  centerLines.push(
    line({
      x1: 0,
      y1: height / 2,
      x2: width,
      y2: height / 2,
      ...linePresets.centerLines,
    })
  );
  centerLines.push(
    line({
      x1: width / 2,
      y1: 0,
      x2: width / 2,
      y2: height,
      ...linePresets.centerLines,
    })
  );

  index = 0;

  // Our complete grid setup.
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      id="gridSvg"
    >
      {gridLines}
      {guideLines}
      {centerLines}
    </svg>
  );
};

export default memo(GridMatrix);
