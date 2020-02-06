import React from "react";

export const ArrowHead = () => {
  return <svg>
  <defs>
    <marker
      id="markerHead"
      markerWidth="20"
      markerHeight="20"
      refX="12"
      refY="6"
      orient="auto"
      markerUnits="strokeWidth"
      style={{fill: "#9b9a96"}}
    >
      <path d="M0,0 L0,12 L12,6 z" />
    </marker>
    <marker
      id="markerHeadDrag"
      markerWidth="20"
      markerHeight="20"
      refX="14"
      refY="6"
      orient="auto"
      markerUnits="strokeWidth"
      style={{fill: "#f5a623"}}
    >
      <path d="M0,0 L0,12 L12,6 z" />
    </marker>
    <marker
      id="markerHeadInversed"
      markerWidth="20"
      markerHeight="20"
      refX="0"
      refY="6"
      orient="auto"
      markerUnits="strokeWidth"
      style={{fill: "#9b9a96"}}
    >
      <path d="M0,6 L12,12 L12,0 z" />
    </marker>
    <marker
      id="markerHeadInversedDrag"
      markerWidth="20"
      markerHeight="20"
      refX="2"
      refY="6"
      orient="auto"
      markerUnits="strokeWidth"
      style={{fill: "#f5a623"}}
    >
      <path d="M0,6 L12,12 L12,0 z" />
    </marker>
  </defs>
</svg>;
}