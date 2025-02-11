import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaFacebook, 
  FaEnvelope, 
  FaInstagram, 
  FaLinkedin, 
  FaPhone, 
  FaMapMarkerAlt 
} from "react-icons/fa";
import "./ContactUs.css";

const ContactUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: false,     // Whether animation should happen only once
    });
  }, []);

  return (
    <div className="contact-us" data-aos="fade-up">
      <div className="contact-container">
        <div className="contact-info" data-aos="fade-right">
          <h1 data-aos="fade-down">Let's Talk</h1>
          <p data-aos="fade-down" data-aos-delay="200">
            Have some big idea or brand to develop and need help? Reach out—we'd love to hear about your project and provide help.
          </p>

          <div className="contact-details" data-aos="fade-up" data-aos-delay="400">
            <div className="detail-item" data-aos="zoom-in">
              <FaEnvelope size="1.2rem" color="#007bff" />
              <a href="mailto:info@example.com">info@example.com</a>
            </div>
            <div className="detail-item" data-aos="zoom-in" data-aos-delay="100">
              <FaPhone size="1.2rem" color="#007bff" />
              <a href="tel:+1234567890">+123 456 7890</a>
            </div>
            <div className="detail-item" data-aos="zoom-in" data-aos-delay="200">
              <FaMapMarkerAlt size="1.2rem" color="#007bff" />
              <span>123 Main Street, City, Country 12345</span>
            </div>
            <div className="social-icons" data-aos="fade-up" data-aos-delay="300">
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

        <form className="contact-form" data-aos="fade-left">
          <label htmlFor="name">Name</label>
          <input 
            id="name" 
            type="text" 
            placeholder="Enter your name" 
            data-aos="fade-right" 
          />

          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            data-aos="fade-right" 
            data-aos-delay="100" 
          />

          <label htmlFor="mobile">Mobile Number</label>
          <input 
            id="mobile" 
            type="text" 
            placeholder="Enter your mobile number" 
            data-aos="fade-right" 
            data-aos-delay="200" 
          />

          <label htmlFor="subject">Subject</label>
          <input 
            id="subject" 
            type="text" 
            placeholder="Enter subject" 
            data-aos="fade-right" 
            data-aos-delay="300" 
          />

          <label htmlFor="message">Message</label>
          <textarea 
            id="message" 
            placeholder="Enter your message" 
            rows="4" 
            data-aos="fade-right" 
            data-aos-delay="400" 
          ></textarea>

          <button type="button" data-aos="zoom-in" data-aos-delay="500">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
