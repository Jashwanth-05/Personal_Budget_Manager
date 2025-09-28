import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    background: "#1e1e2f", // dark premium background
    color: "#e0e0e0", // light text
    borderRadius: "16px", // smooth rounded corners
    padding: theme.spacing(2),
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)", // premium shadow
  },
}));

const StyledDialogContentText = styled(DialogContentText)(() => ({
  fontSize: "1rem",
  color: "#cfcfcf",
  lineHeight: 1.6,
}));

export default function AlertDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirmation",
  description = "Are you sure you want to continue?",
  cancelText = "Cancel",
  confirmText = "Confirm",
}) {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {/* Title */}
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          borderBottom: "none", // removed line
          pb: 1,
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "#ffffff",
        }}
      >
        {title}
      </DialogTitle>

      {/* Description */}
      <DialogContent>
        <StyledDialogContentText id="alert-dialog-description">
          {description}
        </StyledDialogContentText>
      </DialogContent>

      {/* Buttons */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            borderColor: "rgba(255, 77, 77, 0.7)",
            "&:hover": {
              backgroundColor: "rgba(255, 77, 77, 0.1)",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            background: "linear-gradient(90deg, #00c6ff, #0072ff)", // premium gradient
            "&:hover": {
              background: "linear-gradient(90deg, #0072ff, #00c6ff)",
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
