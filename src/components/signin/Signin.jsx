import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import "./Signin.css";

const Signin = () => {
  return (
    <div className="sign-main">
      <div className="signin-container">
        <div className="signin-card-wrapper">
          <div className="signin-row-main">
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
