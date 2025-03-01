import React from "react";
import { Avatar, Button, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Profile = ({ onClose,handleSignout }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    profileImage: "",
    name: "Unknown User",
    email: "No Email",
  };

  return (
    <Box 
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        boxShadow: 10,
        borderRadius: 2,
        width: "15vw",
        mx: "auto",
        bgcolor: "background.paper"
      }}
    >
      {/* Close Button (Top Right) */}
      <IconButton 
        onClick={onClose} 
        sx={{ 
          position: "absolute", 
          top: 8, 
          right: 8, 
          color: "gray",
          "&:hover": { color: "black" }
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Profile Image */}
      <Avatar 
        src={user.profileImage} 
        alt={user.name} 
        sx={{ width: 150, height: 150, mb: 2 }} 
      />

      {/* User Details */}
      <Typography variant="h6"sx={{ color: "black" }}>{user.name}</Typography>
      <Typography variant="body2" color="textSecondary">{user.email}</Typography>

      {/* Sign Out Button */}
      <Button 
        variant="contained"
        onClick={handleSignout}    
        sx={{ 
          mt: 2, 
          width: "100%", 
          backgroundColor: "#FF0000", 
          borderRadius: "50px", 
          "&:hover": { bgcolor: "white", color: "red" } 
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default Profile;
