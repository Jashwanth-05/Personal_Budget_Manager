import React from "react";
import { Avatar, Button, Box, Typography,TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import API from "../../axiosInstance";
const Profile = ({ onClose,handleSignout }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    profileImage: "",
    name: "Unknown User",
    email: "No Email",
  };

  const [User, setUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handleSaveImage = async() => {
    if (!imageUrl.trim()) return;
    
    const updatedUser = { ...User, profileImage: imageUrl };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    try {
      const response = await API.put("/updateProfilePicture",{ profileImage: imageUrl });
      console.log("Profile picture updated:", response.data.profileImage);
    } catch (error) {
      console.error("Error updating profile picture:",error.response?.data?.message || error.message);
    }
    setIsEditing(false);
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
        bgcolor: "background.paper",
        zIndex: 1000
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

     
      {/* Profile Image with Edit Icon */}
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Avatar src={User.profileImage} alt={User.name} sx={{ width: 150, height: 150, mb: 2 }} />
        <IconButton
          onClick={() => setIsEditing(!isEditing)}
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            bgcolor: "white",
            borderRadius: "50%",
            p: 0.5,
            boxShadow: 2,
            "&:hover": { bgcolor: "lightgray" },
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>

      {/* Show input field when editing */}
      {isEditing && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" ,position:"relative",top:"5px",marginBottom:"5px"}}>
          <TextField
            label="Enter Image URL"
            variant="outlined"
            size="small"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button variant="contained" size="small" onClick={handleSaveImage} >
            Save
          </Button>
        </Box>
      )}

      {/* User Details */}
      <Typography variant="h6"sx={{ color: "black" }}>{User.name}</Typography>
      <Typography variant="body2" color="textSecondary">{User.email}</Typography>

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
