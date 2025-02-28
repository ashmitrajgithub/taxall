import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [emailVerification, setEmailVerification] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [emailUpdateMode, setEmailUpdateMode] = useState(false);
    const [emailVerificationMode, setEmailVerificationMode] = useState(false);
    const [profileForm, setProfileForm] = useState({});
    const [emailForm, setEmailForm] = useState({ newEmail: "", token: "" });
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [updating, setUpdating] = useState(false);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        axios.get(`http://localhost:9090/userReq/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setUser(response.data);
            setProfileForm(response.data);
        }).catch(error => {
            console.error("Error fetching profile", error);
            setError("Failed to fetch profile.");
        });
    }, [userId, token]);

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        setUpdating(true);
        axios.put(`http://localhost:9090/userReq/users/${userId}`, profileForm, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setUser(response.data);
            setUpdateMode(false);
            setSuccessMsg("Profile updated successfully.");
        })
        .catch(error => {
            console.error("Error updating profile", error);
            setError("Failed to update profile.");
        })
        .finally(() => setUpdating(false));
    };

    const handleEmailChange = (e) => {
        setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
    };

    const handleEmailUpdateRequest = (e) => {
        e.preventDefault();
        setUpdating(true);
        axios.put(`http://localhost:9090/userReq/users/${userId}/email?newEmail=${emailForm.newEmail}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
            setEmailVerificationMode(true);
            setEmailUpdateMode(false);
        }).catch(error => {
            console.error("Error sending email update request", error);
            setError("Failed to send email update request.");
        }).finally(() => setUpdating(false));
    };

    const handleEmailVerification = (e) => {
        e.preventDefault();
        setUpdating(true);
        axios.post(`http://localhost:9090/userReq/users/${userId}/email/verify?token=${emailForm.token}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            alert("Email updated successfully.");
            localStorage.setItem("token", response.data.split("New Token: ")[1]);
            window.location.reload();
        }).catch(error => {
            console.error("Error verifying email", error);
            setError("Failed to verify email.");
        }).finally(() => setUpdating(false));
    };

    // New handler for OTP resend option
    const handleResendOtp = (e) => {
        e.preventDefault();
        setUpdating(true);
        axios.put(`http://localhost:9090/userReq/users/${userId}/email/resend-otp?newEmail=${emailForm.newEmail}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setSuccessMsg(response.data);
        }).catch(error => {
            console.error("Error resending OTP", error);
            setError("Failed to resend OTP.");
        }).finally(() => setUpdating(false));
    };

    return (
        <div className="profile-container">
            {error && <div className="profile-error">{error}</div>}
            {successMsg && <div className="profile-success">{successMsg}</div>}
            <div className="profile-card">
                <div className="profile-header">
                    <h1>{user.firstname} {user.lastname}</h1>
                    <p className="profile-role">{user.role}</p>
                </div>
                <div className="profile-details">
                    <p>Email: {user.email}</p>
                    <p>Username: {user.username}</p>
                    <p>Mobile: {user.mobilenumber}</p>
                    <p>Subscription: {user.subscription}</p>
                    <p>Location: {user.location}</p>
                </div>
                <div className="profile-actions">
                    <button onClick={() => setUpdateMode(!updateMode)}>
                        {updateMode ? "Cancel Edit" : "Edit Profile"}
                    </button>
                    <button onClick={() => setEmailUpdateMode(!emailUpdateMode)}>
                        {emailUpdateMode ? "Cancel Email Update" : "Update Email"}
                    </button>
                </div>
            </div>
            {updateMode && (
                <form className="profile-form" onSubmit={handleProfileUpdate}>
                    <h2>Update Profile</h2>
                    <input type="text" name="firstname" value={profileForm.firstname} onChange={handleProfileChange} placeholder="First Name" />
                    <input type="text" name="lastname" value={profileForm.lastname} onChange={handleProfileChange} placeholder="Last Name" />
                    <input type="text" name="mobilenumber" value={profileForm.mobilenumber} onChange={handleProfileChange} placeholder="Mobile Number" />
                    <input type="text" name="location" value={profileForm.location} onChange={handleProfileChange} placeholder="Location" />
                    <button type="submit" disabled={updating}>{updating ? "Updating..." : "Save Changes"}</button>
                </form>
            )}
            {emailUpdateMode && (
                <form className="profile-form" onSubmit={handleEmailUpdateRequest}>
                    <h2>Update Email</h2>
                    <input type="email" name="newEmail" value={emailForm.newEmail} onChange={handleEmailChange} placeholder="Enter new email" required />
                    <button type="submit" disabled={updating}>{updating ? "Requesting..." : "Request Email Update"}</button>
                </form>
            )}
            {emailVerificationMode && (
                <form className="profile-form" onSubmit={handleEmailVerification}>
                    <h2>Verify Email</h2>
                    <input type="text" name="token" value={emailForm.token} onChange={handleEmailChange} placeholder="Enter verification token" required />
                    <button type="submit" disabled={updating}>{updating ? "Verifying..." : "Verify Email"}</button>
                    {/* New Resend OTP button */}
                    <button type="button" onClick={handleResendOtp} disabled={updating}>
                        {updating ? "Resending..." : "Resend OTP"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Profile;
