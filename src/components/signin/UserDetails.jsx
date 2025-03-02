// import { useEffect, useState } from "react";
// import { Card, CardContent, Typography, CircularProgress, Avatar } from "@mui/material";
// import axios from "axios";

// export default function UserDetails() {
//     const [userDetails, setUserDetails] = useState(null);
//     const [profileImage, setProfileImage] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
    
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");

//     useEffect(() => {
//         if (!token || !userId) {
//             setError("Authentication failed. Please log in.");
//             setLoading(false);
//             return;
//         } 

//         axios.get(`http://localhost:9090/userReq/profile/${userId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//         .then(response => {
//             setUserDetails(response.data);
//             setLoading(false);
//         })
//         .catch(error => {
//             setError("Failed to fetch user details.");
//             setLoading(false);
//         });

//         axios.get("http://localhost:9090/documents/profile", {
//             headers: { Authorization: `Bearer ${token}` },
//             responseType: "arraybuffer"
//         })
//         .then(response => {
//             const blob = new Blob([response.data], { type: "image/jpeg" });
//             setProfileImage(URL.createObjectURL(blob));
//         })
//         .catch(() => {
//             setProfileImage(null);
//         });
//     }, [token, userId]);

//     if (loading) return <CircularProgress style={{ display: "block", margin: "auto" }} />;
//     if (error) return <Typography color="error" align="center">{error}</Typography>;

//     return (
//         <Card 
//             style={{ 
//                 maxWidth: "600px", 
//                 margin: "20px auto", 
//                 padding: "20px", 
//                 boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", 
//                 borderRadius: "12px", 
//                 textAlign: "center", 
//                 background: "linear-gradient(to right, #ffffff, #f8f9fa)"
//             }}
//         >
//             <CardContent>
//                 {profileImage && (
//                     <Avatar 
//                         src={profileImage} 
//                         alt="Profile" 
//                         style={{ 
//                             width: "120px", 
//                             height: "120px", 
//                             margin: "auto", 
//                             border: "4px solid #1976d2", 
//                             boxShadow: "0px 4px 8px rgba(0,0,0,0.2)"
//                         }}
//                     />
//                 )}
//                 <Typography variant="h5" gutterBottom style={{ fontWeight: "bold", color: "#333" }}>User Profile</Typography>
//                 <Typography variant="body1" style={{ marginBottom: "8px" }}><strong>First Name:</strong> {userDetails.firstname}</Typography>
//                 <Typography variant="body1" style={{ marginBottom: "8px" }}><strong>Last Name:</strong> {userDetails.lastname}</Typography>
//                 <Typography variant="body1" style={{ marginBottom: "8px" }}><strong>Location:</strong> {userDetails.location}</Typography>
//                 <Typography variant="body1" style={{ marginBottom: "8px" }}><strong>Email:</strong> {userDetails.email}</Typography>
//                 <Typography variant="body1" style={{ marginBottom: "8px" }}><strong>Mobile Number:</strong> {userDetails.mobilenumber}</Typography>
//                 <Typography variant="body1" style={{ marginBottom: "8px" }}><strong>Date of Birth:</strong> {new Date(userDetails.dateofbirth).toLocaleDateString()}</Typography>
//             </CardContent>
//         </Card>
//     );
// }

"use client"

import { useEffect, useState } from "react"
import "./UserDetails.css"

export default function UserDetails() {
  const [userDetails, setUserDetails] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (!token || !userId) {
      setError("Authentication failed. Please log in.")
      setLoading(false)
      return
    }

    // Fetch user details
    fetch(`http://localhost:9090/userReq/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch user details")
        return response.json()
      })
      .then((data) => {
        setUserDetails(data)
        setLoading(false)
      })
      .catch((error) => {
        setError("Failed to fetch user details.")
        setLoading(false)
      })

    // Fetch profile image
    fetch("http://localhost:9090/documents/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch profile image")
        return response.arrayBuffer()
      })
      .then((buffer) => {
        const blob = new Blob([buffer], { type: "image/jpeg" })
        setProfileImage(URL.createObjectURL(blob))
      })
      .catch(() => {
        setProfileImage(null)
      })
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="profile-container">
  <div className="profile-background">
    <div className="shape shape-1"></div>
    <div className="shape shape-2"></div>
    <div className="shape shape-3"></div>
  </div>
  <div className="profile-card">
    <div className="profile-header">
      <div className="profile-image-container">
        {profileImage ? (
          <img 
            src={profileImage || "/placeholder.svg"} 
            alt="Profile" 
            className="profile-image" 
          />
        ) : (
          <div className="profile-image-placeholder">
            {userDetails?.firstname?.charAt(0)}{userDetails?.lastname?.charAt(0)}
          </div>
        )}
      </div>
      <h1 className="profile-title">User Profile</h1>
      {userDetails?.firstname && userDetails?.lastname && (
        <p className="profile-name">{userDetails.firstname} {userDetails.lastname}</p>
      )}
    </div>
    
    <div className="profile-content">
      <div className="profile-info-grid">
        <div className="info-item">
          <span className="info-label">First Name</span>
          <span className="info-value">{userDetails?.firstname}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Last Name</span>
          <span className="info-value">{userDetails?.lastname}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Location</span>
          <span className="info-value">{userDetails?.location}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Email</span>
          <span className="info-value">{userDetails?.email}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Mobile Number</span>
          <span className="info-value">{userDetails?.mobilenumber}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Date of Birth</span>
          <span className="info-value">
            {userDetails?.dateofbirth && new Date(userDetails.dateofbirth).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}
