import React, { useState } from "react";
import "../Styles/Modal.css"

export default function FloatingDraggableModal({ show, onClose, children }) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({
    x: window.innerWidth / 2 - 150,
    y: 100,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDrag = (e) => {
    setIsDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const duringDrag = (e) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const stopDrag = () => setIsDragging(false);

  if (!show) return null;

  return (
    <div
      className="c-modal"
      style={{ left: pos.x, top: pos.y,width: "315px",height: "500px", }}
      onMouseMove={duringDrag}
      onMouseUp={stopDrag}
    >
      <div
        className="c-modal-header"
        onMouseDown={startDrag}
        onMouseUp={stopDrag}
      >
        <span>Floating Modal</span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            color: "red",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
      </div>
      <div className="c-modal-content" style={{ padding: 0, height: "100%" }}>{children}</div>
    </div>
  );
}
