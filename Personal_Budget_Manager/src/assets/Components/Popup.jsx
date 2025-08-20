import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';

export default function Popup({
  anchorRect,
  open,
  onRequestClose,
  children,
  offset = 10,     // gap between anchor and popup box
  arrowSize = 6,   // smaller triangle (px)
  style: styleProp,
}) {
  const popupRef = useRef(null);
  const [popupSize, setPopupSize] = useState({ width: 0, height: 0 });
  const [placement, setPlacement] = useState('bottom'); // 'bottom' | 'top'

  // Measure popup after mount/update
  useLayoutEffect(() => {
    if (!open || !popupRef.current) return;
    const rect = popupRef.current.getBoundingClientRect();
    setPopupSize({ width: rect.width, height: rect.height });
  }, [open, children]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onRequestClose?.();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, onRequestClose]);

  if (!open || !anchorRect) return null;

  // Decide top or bottom based on available space
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const neededBelow = offset + arrowSize + popupSize.height + 8;
  const nextPlacement = spaceBelow >= neededBelow ? 'bottom' : 'top';
  if (placement !== nextPlacement) setPlacement(nextPlacement);

  // Center horizontally
  const anchorCenterX = anchorRect.left + anchorRect.width / 2;

  const top =
    nextPlacement === 'bottom'
      ? anchorRect.bottom + offset + arrowSize
      : anchorRect.top - offset - arrowSize - popupSize.height;

  // Centered left with viewport clamping
  const unclampedLeft = anchorCenterX - popupSize.width / 2;
  const left = Math.max(8, Math.min(unclampedLeft, window.innerWidth - popupSize.width - 8));

  // Arrow position within popup width
  const arrowCenterWithinPopup = anchorCenterX - left;
  const arrowLeft = Math.max(
    arrowSize + 2,
    Math.min(arrowCenterWithinPopup, popupSize.width - arrowSize - 2)
  );

  const style = {
    position: 'fixed',
    top,
    left,
    zIndex: 1000,
    maxWidth: 320,
    background: 'white',
    color: '#111',
    border: '1px solid rgba(0,0,0,0.12)',
    borderRadius: 8,
    padding: 12,
    boxShadow: '0 10px 20px rgba(0,0,0,0.12), 0 6px 6px rgba(0,0,0,0.08)',
    pointerEvents: 'auto',
    ...styleProp,
  };

  // Single arrow triangle (no border arrow)
  const arrowCommon = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: `${arrowSize}px solid transparent`,
    borderRight: `${arrowSize}px solid transparent`,
    pointerEvents: 'none',
  };

  const arrowStyle =
    nextPlacement === 'bottom'
      ? {
          ...arrowCommon,
          top: -arrowSize * 2,
          left: arrowLeft - arrowSize,
          borderBottom: `${arrowSize * 2}px solid white`,
          // subtle shadow to separate from background
          filter: 'drop-shadow(0px -1px 1px rgba(0,0,0,0.06))',
        }
      : {
          ...arrowCommon,
          bottom: -arrowSize * 2,
          left: arrowLeft - arrowSize,
          borderTop: `${arrowSize * 2}px solid white`,
          filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.06))',
        };

  return (
    <div ref={popupRef} style={style} role="tooltip" aria-hidden={!open}>
      <div style={arrowStyle} />
      {children}
    </div>
  );
}
