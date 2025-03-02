import { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Typography, Avatar, CircularProgress } from "@mui/material";
import axios from "axios";

export default function UpdateDetails() {
    const [userDetails, setUserDetails] = useState({ firstname: "", lastname: "", location: "", email: "", mobilenumber: "", dateofbirth: "" });
    const [profileImage, setProfileImage] = useState(null);
    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        axios.get(`http://localhost:9090/userReq/profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setUserDetails(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch user details.");
                setLoading(false);
            });
        axios.get("http://localhost:9090/documents/profile", { headers: { Authorization: `Bearer ${token}` }, responseType: "arraybuffer" })
            .then(response => {
                const blob = new Blob([response.data], { type: "image/jpeg" });
                setProfileImage(URL.createObjectURL(blob));
            })
            .catch(() => setProfileImage(null));
    }, [token, userId]);

    const handleUpdate = () => {
        axios.put(`http://localhost:9090/userReq/users/${userId}`, userDetails, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => alert("User details updated successfully!"))
            .catch(() => alert("Failed to update details."));
    };

    const handleEmailUpdate = () => {
        axios.put(`http://localhost:9090/userReq/users/${userId}/email?newEmail=${newEmail}`, {}, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => alert("OTP sent to new email!"))
            .catch(() => alert("Failed to send OTP."));
    };

    const handleVerifyOtp = () => {
        axios.post(`http://localhost:9090/userReq/users/${userId}/email/verify?token=${otp}`, {}, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
            // Assuming the backend now returns an object { message: "...", token: "newJwt" }
            const newToken = response.data.token;
            if (newToken) {
                localStorage.setItem("token", newToken);
                alert("Email updated successfully!");
            } else {
                alert("Email updated but no new token received.");
            }
        })
            .catch(() => alert("Invalid OTP."));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);
        formData.append("documentName", "profile_image");
        formData.append("type", "PROFILE_IMAGE");
        axios.post("http://localhost:9090/documents/upload", formData, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => alert("Profile image updated successfully!"))
            .catch(() => alert("Failed to update profile image."));
    };

    if (loading) return <CircularProgress style={{ display: "block", margin: "auto" }} />;
    if (error) return <Typography color="error" align="center">{error}</Typography>;

    return (
        <Card style={{ maxWidth: "600px", margin: "auto", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
            <CardContent>
                {profileImage && <Avatar src={profileImage} alt="Profile" style={{ width: 100, height: 100, margin: "auto" }} />}
                <input type="file" accept="image/*" onChange={handleProfileImageChange} style={{ marginTop: "10px" }} />
                <TextField fullWidth label="First Name" value={userDetails.firstname} onChange={(e) => setUserDetails({ ...userDetails, firstname: e.target.value })} margin="normal" />
                <TextField fullWidth label="Last Name" value={userDetails.lastname} onChange={(e) => setUserDetails({ ...userDetails, lastname: e.target.value })} margin="normal" />
                <TextField fullWidth label="Location" value={userDetails.location} onChange={(e) => setUserDetails({ ...userDetails, location: e.target.value })} margin="normal" />
                <TextField fullWidth label="Mobile Number" value={userDetails.mobilenumber} onChange={(e) => setUserDetails({ ...userDetails, mobilenumber: e.target.value })} margin="normal" />
                <Button fullWidth variant="contained" color="primary" onClick={handleUpdate} style={{ marginTop: "10px" }}>Update Details</Button>
                <TextField fullWidth label="New Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} margin="normal" />
                <Button fullWidth variant="contained" color="secondary" onClick={handleEmailUpdate} style={{ marginTop: "10px" }}>Request Email Update</Button>
                <TextField fullWidth label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} margin="normal" />
                <Button fullWidth variant="contained" color="success" onClick={handleVerifyOtp} style={{ marginTop: "10px" }}>Verify OTP</Button>
            </CardContent>
        </Card>
    );
}
