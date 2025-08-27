import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid2, Button } from "@mui/material";

export default function Calculator() {
  const [display, setDisplay] = useState("");

  const handleClick = (value) => {
    if (value === "C") {
      setDisplay("");
    } else if (value === "⌫") {
      setDisplay(display.slice(0, -1));
    } else if (value === "=") {
      try {
        // Safe evaluation
        // eslint-disable-next-line no-new-func
        setDisplay(Function(`"use strict"; return (${display})`)().toString());
      } catch {
        setDisplay("Error");
      }
    } else {
      setDisplay(display + value);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.key >= "0" && e.key <= "9") || "+-*/().".includes(e.key)) {
        setDisplay((prev) => prev + e.key);
      } else if (e.key === "Enter") {
        try {
          // eslint-disable-next-line no-new-func
          setDisplay(Function(`"use strict"; return (${display})`)().toString());
        } catch {
          setDisplay("Error");
        }
      } else if (e.key === "Backspace") {
        setDisplay((prev) => prev.slice(0, -1));
      } else if (e.key === "Escape") {
        setDisplay("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [display]);

  const buttons = [
    ["C", "⌫", "(", ")"],
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <Card
      sx={{
        width: "100%",  // take modal’s width
        height: "100%", // take modal’s height
        borderRadius: "20px",
        boxShadow: 5,
        background: "#1e1e1e",
        color: "#fff",
      }}
    >
      <CardContent sx={{ height: "100%" }}>
        {/* Display */}
        <Typography
          variant="h5"
          sx={{
            minHeight: "60px",
            background: "#2c2c2c",
            borderRadius: "12px",
            textAlign: "right",
            padding: "15px",
            mb: 2,
            fontFamily: "monospace",
            fontSize: "24px",
            color: "#00ffcc",
            overflowX: "auto",
          }}
        >
          {display || "0"}
        </Typography>

        {/* Buttons */}
        <Grid2 container spacing={1}>
          {buttons.flat().map((btn, index) => (
            <Grid2 item xs={3} key={index}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleClick(btn)}
                sx={{
                  height: "65px",
                  fontSize: "20px",
                  borderRadius: "16px",
                  background:
                    btn === "="
                      ? "#00cc66"
                      : btn === "C"
                      ? "#ff3333"
                      : btn === "⌫"
                      ? "#ff9900"
                      : "#333",
                  color: "#fff",
                  "&:hover": {
                    background:
                      btn === "="
                        ? "#00e676"
                        : btn === "C"
                        ? "#ff4d4d"
                        : btn === "⌫"
                        ? "#ffaa33"
                        : "#444",
                  },
                }}
              >
                {btn}
              </Button>
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}
