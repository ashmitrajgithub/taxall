// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Profile = () => {
//     const [user, setUser] = useState({});
//     const [editMode, setEditMode] = useState(false);
//     const [newEmail, setNewEmail] = useState("");
//     const [otp, setOtp] = useState("");
//     const [emailVerification, setEmailVerification] = useState(false);
//     const [updateMode, setUpdateMode] = useState(false);
//     const [emailUpdateMode, setEmailUpdateMode] = useState(false);
//     const [emailVerificationMode, setEmailVerificationMode] = useState(false);
//     const [profileForm, setProfileForm] = useState({});
//     const [emailForm, setEmailForm] = useState({ newEmail: "", token: "" });
//     const [error, setError] = useState(null);
//     const [successMsg, setSuccessMsg] = useState(null);
//     const [updating, setUpdating] = useState(false);

//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");

//     useEffect(() => {
//         axios.get(`http://localhost:9090/userReq/profile/${userId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         }).then(response => {
//             setUser(response.data);
//             setProfileForm(response.data);
//         }).catch(error => {
//             console.error("Error fetching profile", error);
//             setError("Failed to fetch profile.");
//         });
//     }, [userId, token]);

//     const handleProfileChange = (e) => {
//         setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
//     };

//     const handleProfileUpdate = (e) => {
//         e.preventDefault();
//         setUpdating(true);
//         axios.put(`http://localhost:9090/userReq/users/${userId}`, profileForm, {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//         .then(response => {
//             setUser(response.data);
//             setUpdateMode(false);
//             setSuccessMsg("Profile updated successfully.");
//         })
//         .catch(error => {
//             console.error("Error updating profile", error);
//             setError("Failed to update profile.");
//         })
//         .finally(() => setUpdating(false));
//     };

//     const handleEmailChange = (e) => {
//         setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
//     };

//     const handleEmailUpdateRequest = (e) => {
//         e.preventDefault();
//         setUpdating(true);
//         axios.put(`http://localhost:9090/userReq/users/${userId}/email?newEmail=${emailForm.newEmail}`, {}, {
//             headers: { Authorization: `Bearer ${token}` }
//         }).then(() => {
//             setEmailVerificationMode(true);
//             setEmailUpdateMode(false);
//         }).catch(error => {
//             console.error("Error sending email update request", error);
//             setError("Failed to send email update request.");
//         }).finally(() => setUpdating(false));
//     };

//     const handleEmailVerification = (e) => {
//         e.preventDefault();
//         setUpdating(true);
//         axios.post(`http://localhost:9090/userReq/users/${userId}/email/verify?token=${emailForm.token}`, {}, {
//             headers: { Authorization: `Bearer ${token}` }
//         }).then(response => {
//             alert("Email updated successfully.");
//             localStorage.setItem("token", response.data.split("New Token: ")[1]);
//             window.location.reload();
//         }).catch(error => {
//             console.error("Error verifying email", error);
//             setError("Failed to verify email.");
//         }).finally(() => setUpdating(false));
//     };

//     // New handler for OTP resend option
//     const handleResendOtp = (e) => {
//         e.preventDefault();
//         setUpdating(true);
//         axios.put(`http://localhost:9090/userReq/users/${userId}/email/resend-otp?newEmail=${emailForm.newEmail}`, {}, {
//             headers: { Authorization: `Bearer ${token}` }
//         }).then(response => {
//             setSuccessMsg(response.data);
//         }).catch(error => {
//             console.error("Error resending OTP", error);
//             setError("Failed to resend OTP.");
//         }).finally(() => setUpdating(false));
//     };

//     return (
//         <div className="profile-container">
//             {error && <div className="profile-error">{error}</div>}
//             {successMsg && <div className="profile-success">{successMsg}</div>}
//             <div className="profile-card">
//                 <div className="profile-header">
//                     <h1>{user.firstname} {user.lastname}</h1>
//                     <p className="profile-role">{user.role}</p>
//                 </div>
//                 <div className="profile-details">
//                     <p>Email: {user.email}</p>
//                     <p>Username: {user.username}</p>
//                     <p>Mobile: {user.mobilenumber}</p>
//                     <p>Subscription: {user.subscription}</p>
//                     <p>Location: {user.location}</p>
//                 </div>
//                 <div className="profile-actions">
//                     <button onClick={() => setUpdateMode(!updateMode)}>
//                         {updateMode ? "Cancel Edit" : "Edit Profile"}
//                     </button>
//                     <button onClick={() => setEmailUpdateMode(!emailUpdateMode)}>
//                         {emailUpdateMode ? "Cancel Email Update" : "Update Email"}
//                     </button>
//                 </div>
//             </div>
//             {updateMode && (
//                 <form className="profile-form" onSubmit={handleProfileUpdate}>
//                     <h2>Update Profile</h2>
//                     <input type="text" name="firstname" value={profileForm.firstname} onChange={handleProfileChange} placeholder="First Name" />
//                     <input type="text" name="lastname" value={profileForm.lastname} onChange={handleProfileChange} placeholder="Last Name" />
//                     <input type="text" name="mobilenumber" value={profileForm.mobilenumber} onChange={handleProfileChange} placeholder="Mobile Number" />
//                     <input type="text" name="location" value={profileForm.location} onChange={handleProfileChange} placeholder="Location" />
//                     <button type="submit" disabled={updating}>{updating ? "Updating..." : "Save Changes"}</button>
//                 </form>
//             )}
//             {emailUpdateMode && (
//                 <form className="profile-form" onSubmit={handleEmailUpdateRequest}>
//                     <h2>Update Email</h2>
//                     <input type="email" name="newEmail" value={emailForm.newEmail} onChange={handleEmailChange} placeholder="Enter new email" required />
//                     <button type="submit" disabled={updating}>{updating ? "Requesting..." : "Request Email Update"}</button>
//                 </form>
//             )}
//             {emailVerificationMode && (
//                 <form className="profile-form" onSubmit={handleEmailVerification}>
//                     <h2>Verify Email</h2>
//                     <input type="text" name="token" value={emailForm.token} onChange={handleEmailChange} placeholder="Enter verification token" required />
//                     <button type="submit" disabled={updating}>{updating ? "Verifying..." : "Verify Email"}</button>
//                     {/* New Resend OTP button */}
//                     <button type="button" onClick={handleResendOtp} disabled={updating}>
//                         {updating ? "Resending..." : "Resend OTP"}
//                     </button>
//                 </form>
//             )}
//         </div>
//     );
// };

// export default Profile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css"

const Profile = () => {
  const [user, setUser] = useState({});
  const [profileForm, setProfileForm] = useState({});
  const [documents, setDocuments] = useState([]);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [docUploadMessage, setDocUploadMessage] = useState("");
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch user profile details
    axios
      .get(`http://localhost:9090/userReq/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        setProfileForm(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile", error);
        setError("Failed to fetch profile.");
      });

    // Fetch profile image and documents list
    fetchProfileImage();
    fetchDocuments();
  }, [userId, token]);

  const fetchProfileImage = () => {
    axios
      .get("http://localhost:9090/documents/profile", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      .then((response) => {
        // Create a URL for the image blob
        const url = URL.createObjectURL(response.data);
        setProfileImageUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching profile image", error);
        // Do not set error if profile image is not present
      });
  };

  const fetchDocuments = () => {
    axios
      .get("http://localhost:9090/documents/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching documents", error);
        setError("Failed to fetch documents.");
      });
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:9090/userReq/users/${userId}`, profileForm, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        setUploadMessage("Profile updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating profile", error);
        setError("Failed to update profile.");
      });
  };

  const handleProfileImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const handleProfileImageUpload = (e) => {
    e.preventDefault();
    if (!profileImageFile) {
      setUploadMessage("Please select a profile image file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", profileImageFile);
    formData.append("userId", userId);
    formData.append("documentName", profileImageFile.name);
    formData.append("type", "PROFILE_IMAGE");

    axios
      .post("http://localhost:9090/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setUploadMessage("Profile image uploaded successfully.");
        fetchProfileImage();
        fetchDocuments();
      })
      .catch((error) => {
        console.error("Error uploading profile image", error);
        setError("Failed to upload profile image.");
      });
  };

  const handleDocumentFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleDocumentUpload = (e) => {
    e.preventDefault();
    if (!documentFile) {
      setDocUploadMessage("Please select a document file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", documentFile);
    formData.append("userId", userId);
    formData.append("documentName", documentName || documentFile.name);
    formData.append("type", "DOCUMENT");

    axios
      .post("http://localhost:9090/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setDocUploadMessage("Document uploaded successfully.");
        fetchDocuments();
      })
      .catch((error) => {
        console.error("Error uploading document", error);
        setError("Failed to upload document.");
      });
  };

  const handleDocumentDownload = (documentId, docName) => {
    axios
      .get(`http://localhost:9090/documents/download/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", docName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error downloading document", error);
        setError("Failed to download document.");
      });
  };

  return (
    <div className="profile-container">
      <h1>Dashboard</h1>
      {error && <div className="error">{error}</div>}

      {/* Profile Details Section */}
      <div className="profile-section">
        <h2>Profile Details</h2>
        <div>
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Profile" width="150" height="150" />
          ) : (
            <p>No profile image uploaded.</p>
          )}
        </div>
        <div>
          <p>
            <strong>Name:</strong> {user.firstname} {user.lastname}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Mobile:</strong> {user.mobilenumber}
          </p>
          <p>
            <strong>Subscription:</strong> {user.subscription}
          </p>
          <p>
            <strong>Location:</strong> {user.location}
          </p>
        </div>
        <form onSubmit={handleProfileUpdate}>
          <h3>Update Profile</h3>
          <input
            type="text"
            name="firstname"
            value={profileForm.firstname || ""}
            onChange={handleProfileChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastname"
            value={profileForm.lastname || ""}
            onChange={handleProfileChange}
            placeholder="Last Name"
          />
          <input
            type="text"
            name="mobilenumber"
            value={profileForm.mobilenumber || ""}
            onChange={handleProfileChange}
            placeholder="Mobile Number"
          />
          <input
            type="text"
            name="location"
            value={profileForm.location || ""}
            onChange={handleProfileChange}
            placeholder="Location"
          />
          <button type="submit">Update Profile</button>
        </form>
      </div>

      <hr />

      {/* Profile Image Upload Section */}
      <div className="upload-section">
        <h2>Upload Profile Image</h2>
        <form onSubmit={handleProfileImageUpload}>
          <input type="file" accept="image/*" onChange={handleProfileImageChange} />
          <button type="submit">Upload Profile Image</button>
        </form>
        {uploadMessage && <div className="message">{uploadMessage}</div>}
      </div>

      <hr />

      {/* Document Upload Section */}
      <div className="upload-section">
        <h2>Upload Document</h2>
        <form onSubmit={handleDocumentUpload}>
          <input type="file" onChange={handleDocumentFileChange} />
          <input
            type="text"
            placeholder="Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          <button type="submit">Upload Document</button>
        </form>
        {docUploadMessage && <div className="message">{docUploadMessage}</div>}
      </div>

      <hr />

      {/* Documents List Section */}
      <div className="documents-section">
        <h2>Your Documents</h2>
        {documents.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Uploaded On</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.documentId}>
                  <td>{doc.documentName}</td>
                  <td>{doc.documentType}</td>
                  <td>{new Date(doc.uploadedOn).toLocaleString()}</td>
                  <td>{(doc.size / 1024).toFixed(2)} KB</td>
                  <td>
                    <button onClick={() => handleDocumentDownload(doc.documentId, doc.documentName)}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No documents found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
