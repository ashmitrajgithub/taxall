import { useState, useEffect } from "react"
import axios from "axios"
import { User, Mail, Phone, MapPin, Edit, CheckCircle, AlertCircle, RefreshCw, X, FileText, File, Folder, Lock } from 'lucide-react'
import "./Profile.css"

const Profile = () => {
  const [user, setUser] = useState({})
  const [activeTab, setActiveTab] = useState("info")
  const [profileForm, setProfileForm] = useState({})
  const [emailForm, setEmailForm] = useState({ newEmail: "", token: "" })
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [documents, setDocuments] = useState([
    { id: 1, name: "Resume.pdf", type: "pdf", date: "2023-12-10" },
    { id: 2, name: "Project Proposal.docx", type: "docx", date: "2024-01-15" },
    { id: 3, name: "Financial Report.xlsx", type: "xlsx", date: "2024-02-20" },
    { id: 4, name: "Meeting Notes.txt", type: "txt", date: "2024-02-28" },
    { id: 5, name: "Presentation.pptx", type: "pptx", date: "2024-03-05" }
  ])

  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = () => {
    axios
      .get(`http://localhost:9090/userReq/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data)
        setProfileForm(response.data)
      })
      .catch((error) => {
        console.error("Error fetching profile", error)
        showNotification("Failed to fetch profile.", "error")
      })
  }

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    setUpdating(true)
    axios
      .put(`http://localhost:9090/userReq/users/${userId}`, profileForm, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data)
        showNotification("Profile updated successfully.", "success")
        setShowModal(false)
      })
      .catch((error) => {
        console.error("Error updating profile", error)
        showNotification("Failed to update profile.", "error")
      })
      .finally(() => setUpdating(false))
  }

  const handleEmailChange = (e) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value })
  }

  const handleEmailUpdateRequest = (e) => {
    e.preventDefault()
    setUpdating(true)
    axios
      .put(
        `http://localhost:9090/userReq/users/${userId}/email?newEmail=${emailForm.newEmail}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        showNotification("Verification code sent to your email.", "success")
        setModalContent("verifyEmail")
      })
      .catch((error) => {
        console.error("Error sending email update request", error)
        showNotification("Failed to send email update request.", "error")
      })
      .finally(() => setUpdating(false))
  }

  const handleEmailVerification = (e) => {
    e.preventDefault()
    setUpdating(true)
    axios
      .post(
        `http://localhost:9090/userReq/users/${userId}/email/verify?token=${emailForm.token}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        showNotification("Email updated successfully.", "success")
        localStorage.setItem("token", response.data.split("New Token: ")[1])
        setTimeout(() => window.location.reload(), 1500)
      })
      .catch((error) => {
        console.error("Error verifying email", error)
        showNotification("Failed to verify email.", "error")
      })
      .finally(() => setUpdating(false))
  }

  const handleResendOtp = (e) => {
    e.preventDefault()
    setUpdating(true)
    axios
      .put(
        `http://localhost:9090/userReq/users/${userId}/email/resend-otp?newEmail=${emailForm.newEmail}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        showNotification("Verification code resent successfully.", "success")
      })
      .catch((error) => {
        console.error("Error resending OTP", error)
        showNotification("Failed to resend verification code.", "error")
      })
      .finally(() => setUpdating(false))
  }

  // New: Handle changes in the password form fields
  const handlePasswordInputChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
  }

  // New: Handle password change form submission
  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showNotification("Please fill in all the required fields.", "error")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("New password and confirmation do not match.", "error")
      return
    }
    if (passwordForm.newPassword.length < 8) {
      showNotification("New password must be at least 8 characters long.", "error")
      return
    }

    const payload = {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    }

    setUpdating(true)
    axios
      .put(`http://localhost:9090/userReq/users/${userId}/password`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        showNotification("Password changed successfully.", "success")
        // Clear the password form and close modal
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
        setShowModal(false)
      })
      .catch((error) => {
        console.error("Error changing password", error)
        showNotification("Failed to change password.", "error")
      })
      .finally(() => setUpdating(false))
  }

  const showNotification = (message, type) => {
    if (type === "error") {
      setError(message)
      setTimeout(() => setError(null), 5000)
    } else {
      setSuccessMsg(message)
      setTimeout(() => setSuccessMsg(null), 5000)
    }
  }

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="document-icon" />
      case 'docx':
      case 'txt':
        return <File className="document-icon" />
      case 'xlsx':
      case 'pptx':
        return <Folder className="document-icon" />
      default:
        return <File className="document-icon" />
    }
  }

  const renderModalContent = () => {
    switch (modalContent) {
      case "editProfile":
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="floating-input">
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={profileForm.firstname || ""}
                onChange={handleProfileChange}
                placeholder=" "
                required
              />
              <label htmlFor="firstname">First Name</label>
            </div>
            <div className="floating-input">
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={profileForm.lastname || ""}
                onChange={handleProfileChange}
                placeholder=" "
                required
              />
              <label htmlFor="lastname">Last Name</label>
            </div>
            <div className="floating-input">
              <input
                type="tel"
                id="mobilenumber"
                name="mobilenumber"
                value={profileForm.mobilenumber || ""}
                onChange={handleProfileChange}
                placeholder=" "
              />
              <label htmlFor="mobilenumber">Mobile Number</label>
            </div>
            <div className="floating-input">
              <input
                type="text"
                id="location"
                name="location"
                value={profileForm.location || ""}
                onChange={handleProfileChange}
                placeholder=" "
              />
              <label htmlFor="location">Location</label>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )
      case "updateEmail":
        return (
          <form onSubmit={handleEmailUpdateRequest} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Update Email Address</h2>
            <div className="floating-input">
              <input
                type="email"
                id="newEmail"
                name="newEmail"
                value={emailForm.newEmail}
                onChange={handleEmailChange}
                placeholder=" "
                required
              />
              <label htmlFor="newEmail">New Email Address</label>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          </form>
        )
      case "verifyEmail":
        return (
          <form onSubmit={handleEmailVerification} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Verify Email Address</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please enter the verification code sent to <strong>{emailForm.newEmail}</strong>
            </p>
            <div className="floating-input">
              <input
                type="text"
                id="token"
                name="token"
                value={emailForm.token}
                onChange={handleEmailChange}
                placeholder=" "
                required
              />
              <label htmlFor="token">Verification Code</label>
            </div>
            <div className="flex justify-between items-center mt-6">
              <button type="button" onClick={handleResendOtp} className="btn btn-link" disabled={updating}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Code
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          </form>
        )
      case "changePassword":
        return (
          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <div className="floating-input">
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordInputChange}
                placeholder=" "
                required
              />
              <label htmlFor="oldPassword">Current Password</label>
            </div>
            <div className="floating-input">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                placeholder=" "
                required
              />
              <label htmlFor="newPassword">New Password</label>
            </div>
            <div className="floating-input">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                placeholder=" "
                required
              />
              <label htmlFor="confirmPassword">Confirm New Password</label>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        )
      default:
        return null
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        {(error || successMsg) && (
          <div className={`notification ${error ? "error" : "success"}`}>
            {error ? <AlertCircle className="notification-icon" /> : <CheckCircle className="notification-icon" />}
            <p>{error || successMsg}</p>
          </div>
        )}

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user.firstname && user.lastname ? `${user.firstname.charAt(0)}${user.lastname.charAt(0)}` : "U"}
              </div>
            </div>
            <h1 className="profile-name">
              {user.firstname} {user.lastname}
            </h1>
            <span className="profile-role">{user.role}</span>
          </div>

          <div className="profile-tabs">
            <button
              className={`tab-button ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Information
            </button>
            <button
              className={`tab-button ${activeTab === "subscription" ? "active" : ""}`}
              onClick={() => setActiveTab("subscription")}
            >
              Subscription
            </button>
            <button
              className={`tab-button ${activeTab === "documents" ? "active" : ""}`}
              onClick={() => setActiveTab("documents")}
            >
              Documents
            </button>
          </div>

          {activeTab === "info" && (
            <div className="profile-info">
              <div className="info-item">
                <Mail className="info-icon" />
                <div>
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
              </div>
              <div className="info-item">
                <User className="info-icon" />
                <div>
                  <span className="info-label">Username</span>
                  <span className="info-value">{user.username}</span>
                </div>
              </div>
              <div className="info-item">
                <Phone className="info-icon" />
                <div>
                  <span className="info-label">Mobile</span>
                  <span className="info-value">{user.mobilenumber || "Not provided"}</span>
                </div>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" />
                <div>
                  <span className="info-label">Location</span>
                  <span className="info-value">{user.location || "Not provided"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="profile-subscription">
              <div className="subscription-info">
                <CheckCircle className="subscription-icon" />
                <div>
                  <span className="subscription-label">Current Plan</span>
                  <span className="subscription-value">{user.subscription || "Free"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="documents-section">
              <h3 className="documents-title">Your Documents</h3>
              <div className="documents-list">
                {documents.map((doc) => (
                  <div key={doc.id} className="document-item">
                    {getFileIcon(doc.type)}
                    <div className="document-details">
                      <span className="document-name">{doc.name}</span>
                      <span className="document-date">Added on {new Date(doc.date).toLocaleDateString()}</span>
                    </div>
                    <button className="document-action">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="download-icon">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="profile-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                setModalContent("editProfile")
                setShowModal(true)
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setModalContent("updateEmail")
                setShowModal(true)
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Update Email
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setModalContent("changePassword")
                setShowModal(true)
              }}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </button>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
              {renderModalContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
