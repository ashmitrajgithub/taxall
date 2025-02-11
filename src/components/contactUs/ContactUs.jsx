import React from "react";
import "./ContactUs.css";
import { FaFacebook, FaEnvelope, FaInstagram, FaLinkedin, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="contact-us">
      <div className="contact-container">
        <div className="contact-info">
          <h1>Let's Talk</h1>
          <p>
            Have some big idea or brand to develop and need help? Reach out—we'd love to hear about your project and provide help.
          </p>

          <div className="contact-details">
            <div className="detail-item">
              <FaEnvelope size="1.2rem" color="#007bff" />
              <a href="mailto:info@example.com">info@example.com</a>
            </div>
            <div className="detail-item">
              <FaPhone size="1.2rem" color="#007bff" />
              <a href="tel:+1234567890">+123 456 7890</a>
            </div>
            <div className="detail-item">
              <FaMapMarkerAlt size="1.2rem" color="#007bff" />
              <span>123 Main Street, City, Country 12345</span>
            </div>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size="1.5rem" color="#007bff" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram size="1.5rem" color="#007bff" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size="1.5rem" color="#007bff" />
              </a>
            </div>
          </div>
        </div>

        <form className="contact-form">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="Enter your name" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Enter your email" />

          <label htmlFor="mobile">Mobile Number</label>
          <input id="mobile" type="text" placeholder="Enter your mobile number" />

          <label htmlFor="subject">Subject</label>
          <input id="subject" type="text" placeholder="Enter subject" />

          <label htmlFor="message">Message</label>
          <textarea id="message" placeholder="Enter your message" rows="4"></textarea>

          <button type="button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
