import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import "./Signin.css";

const Signin = () => {
  // State for the dynamic 3D transform style
  const [cardStyle, setCardStyle] = useState({ transform: "rotateX(0deg) rotateY(0deg)" });

  // Calculate tilt based on mouse position over the card
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    const angleX = -((e.clientY - cardY) / 20); // adjust divisor to control tilt intensity
    const angleY = (e.clientX - cardX) / 20;
    setCardStyle({ transform: `rotateX(${angleX}deg) rotateY(${angleY}deg)` });
  };

  // Reset tilt when mouse leaves the card
  const handleMouseLeave = () => {
    setCardStyle({ transform: "rotateX(0deg) rotateY(0deg)" });
  };

  return (
    <div className="sign-main">
    <div className="signin-container">
      <div className="signin-card-wrapper">
        <div
          className="signin-row-main"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={cardStyle}
        >
          <div className="signin-col-left">
            <div className="signin-card-left">
              <div className="signin-logo-wrapper">
                <img src="assets/taxallnewww.png" className="signin-logo" alt="Logo" />
              </div>
              <div className="signin-image-wrapper">
                <img
                  src="https://i.imgur.com/uNGdWHi.png"
                  className="signin-image"
                  alt="Illustration"
                />
              </div>
            </div>
          </div>
          <div className="signin-col-right">
            <div className="signin-card-right">
              <div className="signin-social-login">
                <h6>Sign in with</h6>
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
              <form>
                <div className="signin-input-group">
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="Enter a valid email address" />
                </div>
                <div className="signin-input-group">
                  <label>Password</label>
                  <input type="password" name="password" placeholder="Enter password" />
                </div>
                <div className="signin-row signin-options">
                  <div className="signin-checkbox-group">
                    <input id="signin-chk1" type="checkbox" name="chk" />
                    <label htmlFor="signin-chk1">Remember me</label>
                  </div>
                  <a href="#" className="signin-forgot-password">
                    Forgot Password?
                  </a>
                </div>
                <div className="signin-button-group">
                  <button type="submit" className="signin-btn signin-btn-blue">
                    Login
                  </button>
                </div>
              </form>
              <div className="signin-register-link">
                <small>
                  Don't have an account?{" "}
                  <a href="#" className="signin-text-danger">
                    Register
                  </a>
                </small>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
