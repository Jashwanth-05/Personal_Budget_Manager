import React, { useState } from 'react';
import HoverAnchor from './HoverAnchor';
import Popup from './Popup';

export default function Example() {
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const [overPopup, setOverPopup] = useState(false);

  const handleHoverChange = (isOver, rect) => {
    if (isOver) {
      setAnchorRect(rect);
      setOpen(true);
    } else {
      setTimeout(() => setOpen(overPopup), 80);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <HoverAnchor onHoverChange={handleHoverChange}>

      </HoverAnchor>

      <div onMouseEnter={() => setOverPopup(true)} onMouseLeave={() => setOverPopup(false)}>
        <Popup anchorRect={anchorRect} open={open} onRequestClose={() => setOpen(false)}>
          <b>Popup content</b>
          <div style={{ marginTop: 6, color: '#555' }}>Shown on hover.</div>
        </Popup>
      </div>
    </div>
  );
}
