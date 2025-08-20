import React, { useRef } from 'react';

export default function HoverAnchor({ onHoverChange, children, as: Tag = 'span', style }) {
  const ref = useRef(null);

  const handleEnter = () => {
    const rect = ref.current?.getBoundingClientRect();
    onHoverChange?.(true, rect || null);
  };
  const handleLeave = () => onHoverChange?.(false, null);

  return (
    <Tag
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-block', ...style }}
    >
      {children}
    </Tag>
  );
}
