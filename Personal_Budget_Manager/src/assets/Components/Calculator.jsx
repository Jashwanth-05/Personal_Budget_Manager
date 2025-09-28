import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, Typography, Grid2, Button } from "@mui/material";
import { evaluate } from "mathjs";

export default function Calculator() {
  const [display, setDisplay] = useState("");

  // Centralized function to safely evaluate the expression
  const evaluateExpression = useCallback(() => {
    // Avoid evaluation if display is empty or ends with an error/operator
    if (display === "" || display.endsWith("Error")) {
      return;
    }
    try {
      // Sanitize trailing operators before evaluation
      const finalDisplay = display.endsWith('+') || display.endsWith('-') || display.endsWith('*') || display.endsWith('/') ? display.slice(0, -1) : display;

      if (finalDisplay === "") {
        setDisplay("");
        return;
      }
      
      const result = evaluate(finalDisplay);
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  }, [display]);

  // Handle all button clicks
  const handleClick = (value) => {
    if (value === "C") {
      setDisplay("");
    } else if (value === "⌫") {
      setDisplay((prev) => prev.slice(0, -1));
    } else if (value === "=") {
      evaluateExpression();
    } else {
      const operators = "+-*/";
      const lastChar = display.slice(-1);

      // Replace the last operator if a new one is clicked
      if (operators.includes(lastChar) && operators.includes(value)) {
        setDisplay((prev) => prev.slice(0, -1) + value);
        return;
      }
      
      // Prevent multiple decimals in a single number segment
      const parts = display.split(/[-+/*()]/);
      const currentNumber = parts[parts.length - 1];
      if (value === "." && currentNumber.includes(".")) {
          return;
      }

      setDisplay((prev) => prev + value);
    }
  };

  // Handle keyboard inputs with useCallback for performance
  const handleKey = useCallback((e) => {
      const { key } = e;

      if ((key >= "0" && key <= "9") || key === "(" || key === ")") {
          handleClick(key);
      } else if ("+-*/.".includes(key)) {
          handleClick(key);
      } else if (key === "Enter") {
          e.preventDefault(); // Prevent form submission
          evaluateExpression();
      } else if (key === "Backspace") {
          handleClick("⌫");
      } else if (key === "Escape") {
          handleClick("C");
      }
  }, [evaluateExpression]); // Dependency is stable


  // useEffect now has a stable dependency
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

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
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        boxShadow: 5,
        background: "#1e1e1e",
        color: "#fff",
        display: "flex", 
        flexDirection: "column"
      }}
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 1.5 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            minHeight: "60px",
            background: "#2c2c2c",
            borderRadius: "12px",
            textAlign: "right",
            padding: "15px",
            mb: 1.5,
            fontFamily: "monospace",
            fontSize: "24px",
            color: "#00ffcc",
            overflowX: "auto",
            wordWrap: 'break-word',
            wordBreak: 'break-all',
          }}
        >
          {display || "0"}
        </Typography>

        <Grid2 container spacing={1} sx={{ flex: 1 }}>
          {buttons.flat().map((btn, index) => (
            <Grid2 item xs={3} key={index} sx={{ display: 'flex' }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleClick(btn)}
                sx={{
                  flex: 1,
                  fontSize: "20px",
                  borderRadius: "16px",
                  background:
                    btn === "=" ? "#00cc66" :
                    btn === "C" ? "#ff3333" :
                    btn === "⌫" ? "#ff9900" :
                    /[+\-*/()]/.test(btn) ? "#4a4a4a" : 
                    "#333",
                  color: "#fff",
                  "&:hover": {
                    background:
                      btn === "=" ? "#00e676" :
                      btn === "C" ? "#ff4d4d" :
                      btn === "⌫" ? "#ffaa33" :
                      /[+\-*/()]/.test(btn) ? "#5a5a5a" :
                      "#444",
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
