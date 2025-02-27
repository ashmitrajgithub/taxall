import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    firstname: "",
    lastname: "",
    mobilenumber: "",
    location: "",
    profilePicUrl: "",
    password: ""
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    token: ""
  });
  const [updateMode, setUpdateMode] = useState(false);
  const [emailUpdateMode, setEmailUpdateMode] = useState(false);
  const [emailVerificationMode, setEmailVerificationMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Use the same key as stored in Signin: "email"
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // Get user ID by email then fetch the profile
    axios
      .get(`http://localhost:9090/userReq/user/id?email=${email}`, config)
      .then((res) => {
        const userId = res.data;
        return axios.get(`http://localhost:9090/userReq/profile/${userId}`, config);
      })
      .then((response) => {
        setUser(response.data);
        // Pre-fill the profile update form with current data
        setProfileForm({
          firstname: response.data.firstname || "",
          lastname: response.data.lastname || "",
          mobilenumber: response.data.mobilenumber || "",
          location: response.data.location || "",
          profilePicUrl: response.data.profilePicUrl || "",
          password: ""
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError("Error fetching profile details.");
        setLoading(false);
      });
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .put(`http://localhost:9090/userReq/users/${user.userid}`, profileForm, config)
      .then((res) => {
        setUser(res.data);
        setSuccessMsg("Profile updated successfully.");
        setUpdateMode(false);
        setUpdating(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setError("Error updating profile.");
        setUpdating(false);
      });
  };

  const handleEmailUpdateRequest = (e) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .put(
        `http://localhost:9090/userReq/users/${user.userid}/email`,
        null,
        {
          params: { newEmail: emailForm.newEmail },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((res) => {
        setSuccessMsg(res.data);
        setEmailUpdateMode(false);
        setEmailVerificationMode(true);
        setUpdating(false);
      })
      .catch((err) => {
        console.error("Error updating email:", err);
        setError("Error updating email.");
        setUpdating(false);
      });
  };

  const handleEmailVerification = (e) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .post(
        `http://localhost:9090/userReq/users/${user.userid}/email/verify`,
        null,
        {
          params: { token: emailForm.token },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((res) => {
        setSuccessMsg(res.data);
        setEmailVerificationMode(false);
        // Re-fetch updated profile to update localStorage email
        axios
          .get(`http://localhost:9090/userReq/profile/${user.userid}`, config)
          .then((response) => {
            setUser(response.data);
            localStorage.setItem("email", response.data.email);
          })
          .catch((err) => {
            console.error("Error refreshing profile:", err);
          });
        setUpdating(false);
      })
      .catch((err) => {
        console.error("Error verifying email:", err);
        setError("Error verifying email token.");
        setUpdating(false);
      });
  };

  const defaultProfilePic = "https://via.placeholder.com/150";

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {error && <div className="profile-error">{error}</div>}
      {successMsg && <div className="profile-success">{successMsg}</div>}
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.profilePicUrl ? user.profilePicUrl : defaultProfilePic}
            alt="Profile"
            className="profile-photo"
          />
          <h1>
            {user.firstname} {user.lastname}
          </h1>
          <p className="profile-role">{user.role}</p>
          {user.lastupdate && (
            <p className="profile-last-update">
              Last Updated: {new Date(user.lastupdate).toLocaleString()}
            </p>
          )}
        </div>
        <div className="profile-details">
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-field">
            <label>Username:</label>
            <span>{user.username}</span>
          </div>
          <div className="profile-field">
            <label>Mobile:</label>
            <span>{user.mobilenumber}</span>
          </div>
          <div className="profile-field">
            <label>Subscription:</label>
            <span>{user.subscription}</span>
          </div>
          <div className="profile-field">
            <label>Location:</label>
            <span>{user.location}</span>
          </div>
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
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstname"
              value={profileForm.firstname}
              onChange={handleProfileChange}
              placeholder="First Name"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              value={profileForm.lastname}
              onChange={handleProfileChange}
              placeholder="Last Name"
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobilenumber"
              value={profileForm.mobilenumber}
              onChange={handleProfileChange}
              placeholder="Mobile Number"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={profileForm.location}
              onChange={handleProfileChange}
              placeholder="Location"
            />
          </div>
          <div className="form-group">
            <label>Profile Photo URL</label>
            <input
              type="text"
              name="profilePicUrl"
              value={profileForm.profilePicUrl}
              onChange={handleProfileChange}
              placeholder="Profile Photo URL"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={profileForm.password}
              onChange={handleProfileChange}
              placeholder="New Password"
            />
          </div>
          <button type="submit" disabled={updating}>
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      )}

      {emailUpdateMode && (
        <form className="profile-form" onSubmit={handleEmailUpdateRequest}>
          <h2>Update Email</h2>
          <div className="form-group">
            <label>New Email</label>
            <input
              type="email"
              name="newEmail"
              value={emailForm.newEmail}
              onChange={handleEmailChange}
              placeholder="Enter new email"
              required
            />
          </div>
          <button type="submit" disabled={updating}>
            {updating ? "Requesting..." : "Request Email Update"}
          </button>
        </form>
      )}

      {emailVerificationMode && (
        <form className="profile-form" onSubmit={handleEmailVerification}>
          <h2>Verify Email Update</h2>
          <div className="form-group">
            <label>Verification Token</label>
            <input
              type="text"
              name="token"
              value={emailForm.token}
              onChange={handleEmailChange}
              placeholder="Enter verification token"
              required
            />
          </div>
          <button type="submit" disabled={updating}>
            {updating ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
