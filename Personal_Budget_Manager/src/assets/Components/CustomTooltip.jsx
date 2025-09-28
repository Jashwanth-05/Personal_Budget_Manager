
import React from "react";
import "../Styles/CustomTooltip.css"; 

export default function CustomTooltipContent({ payload = [], label = "" }) {
  return (
    <div className="custom-tooltip-content">
      <div className="custom-tooltip-label">{label}</div>
      <div className="custom-tooltip-list">
        {payload.map((entry, i) => (
          <div key={i} className="custom-tooltip-item">
            <span className="dataKey">{entry.dataKey}:</span>{" "}
            <b className="value">{entry.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
