
import { useState } from "react";
import axios from "axios"; // Import axios
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import "./Signin.css";

const Signin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    mobilenumber: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);

  // Backend Base URL (Update this if your backend runs on a different host)
  const API_BASE_URL = "http://localhost:9090/auth";

  // Toggle Signin/Signup Mode
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({ firstname: "", lastname: "", email: "", username: "", mobilenumber: "", password: "" });
    setOtpSent(false);
    setOtp("");
    setError(null);
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignup) {
        // Sign Up API Call
        const response = await axios.post(`${API_BASE_URL}/signup`, formData);
        alert(response.data);
        setIsSignup(false); // Redirect to login after signup
      } else {
        // Sign In API Call (Step 1: Password Verification & OTP Generation)
        const response = await axios.post(`${API_BASE_URL}/signin`, {
          email: formData.email,
          password: formData.password,
        });
        alert(response.data);
        setOtpSent(true); // Enable OTP field
      }
    } catch (error) {
      setError(error.response?.data || "An error occurred");
    }
  };

  // Handle OTP Verification (Step 2)
const handleOtpSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, null, {
      params: {
        email: formData.email,
        otp: otp,
      },
    });

    alert("Login Successful!");
    // Store token and email in localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId",response.data.userid)
    localStorage.setItem("email",response.data.email)

    const roleResponse = await axios.get(`${API_BASE_URL}/users/role`, {
      params: { email: formData.email },
    });
    const role = roleResponse.data.trim();
    localStorage.setItem("role", role);

    window.location.href = "/dashboard"; // Redirect to dashboard
  } catch (error) {
    setError(error.response?.data || "Invalid OTP");
  }
};


  return (
    <div className="sign-main">
      <div className="signin-container">
        <div className="signin-card-wrapper">
          <div className="signin-row-main">
            {/* Left Side */}
            <div className="signin-col-left">
              <div className="signin-card-left">
                <div className="signin-logo-wrapper">
                  <img src="assets/taxallnewww.png" className="signin-logo" alt="Logo" />
                </div>
                <div className="signin-image-wrapper">
                  <img src="https://i.imgur.com/uNGdWHi.png" className="signin-image" alt="Illustration" />
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="signin-col-right">
              <div className="signin-card-right">
                <div className="signin-social-login">
                  <h6>{isSignup ? "Sign up with" : "Sign in with"}</h6>
                  <div className="signin-social-icon signin-facebook">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </div>
                  <div className="signin-social-icon signin-twitter">
                    <FontAwesomeIcon icon={faTwitter} />
                  </div>
                  <div className="signin-social-icon signin-linkedin">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </div>
                </div>

                <div className="signin-divider">
                  <div className="signin-line"></div>
                  <small className="signin-or">Or</small>
                  <div className="signin-line"></div>
                </div>

                {/* Form */}
                {!otpSent ? (
                  <form onSubmit={handleSubmit}>
                    {isSignup && (
                      <>
                        <div className="signin-input-group">
                          <label>First Name</label>
                          <input type="text" name="firstname" placeholder="Enter first name" value={formData.firstname} onChange={handleChange} required />
                        </div>
                        <div className="signin-input-group">
                          <label>Last Name</label>
                          <input type="text" name="lastname" placeholder="Enter last name" value={formData.lastname} onChange={handleChange} required />
                        </div>
                        <div className="signin-input-group">
                          <label>Username</label>
                          <input type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="signin-input-group">
                          <label>Mobile Number</label>
                          <input type="tel" name="mobilenumber" placeholder="Enter mobile number" value={formData.mobilenumber} onChange={handleChange} required />
                        </div>
                      </>
                    )}

                    <div className="signin-input-group">
                      <label>Email Address</label>
                      <input type="email" name="email" placeholder="Enter a valid email address" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="signin-input-group">
                      <label>Password</label>
                      <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="signin-button-group">
                      <button type="submit" className="signin-btn signin-btn-blue">
                        {isSignup ? "Sign Up" : "Login"}
                      </button>
                    </div>
                  </form>
                ) : (
                  // OTP Verification Form
                  <form onSubmit={handleOtpSubmit}>
                    <div className="signin-input-group">
                      <label>Enter OTP</label>
                      <input type="text" name="otp" placeholder="Enter OTP" value={otp} onChange={handleOtpChange} required />
                    </div>

                    <div className="signin-button-group">
                      <button type="submit" className="signin-btn signin-btn-blue">Verify OTP</button>
                    </div>
                  </form>
                )}

                {error && <p className="error-message">{error}</p>}

                <div className="signin-register-link">
                  <small>
                    {isSignup ? "Already have an account? " : "Don't have an account? "}
                    <a href="#" className="signin-text-danger" onClick={toggleMode}>
                      {isSignup ? "Login" : "Register"}
                    </a>
                  </small>
                </div>
              </div>
            </div> {/* End of Right Column */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
