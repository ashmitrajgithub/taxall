import React, { useEffect, useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import "./Review.css";

const initialReviews = [
  {
    id: 1,
    author: "Martin Goutry",
    text: "Dico is finally addressing a long-time problem we had when building UIs. Its ease of use and workflow seem really intuitive. Promising!",
    date: "2021.03.02",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: 2,
    author: "Theo Champion",
    text: "Dico is finally addressing a long-time problem we had when building UIs. Its ease of use and workflow seem really intuitive. Promising!",
    date: "2021.03.02",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 4
  },
  {
    id: 3,
    author: "Agnes Remi",
    text: "Dico is finally addressing a long-time problem we had when building UIs. Its ease of use and workflow seem really intuitive. Promising!",
    date: "2021.03.02",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    id: 4,
    author: "Roman Atwoods",
    text: "Dico is finally addressing a long-time problem we had when building UIs. Its ease of use and workflow seem really intuitive. Promising!",
    date: "2021.03.02",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 4
  }
];

const Review = () => {
  // Load reviews from localStorage (or fallback to initialReviews)
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem("reviews");
    return savedReviews ? JSON.parse(savedReviews) : initialReviews;
  });

  const [scrollPosition, setScrollPosition] = useState(0);
  const [newReview, setNewReview] = useState({
    author: "",
    text: "",
    avatar: "",
    rating: 0
  });
  const [showModal, setShowModal] = useState(false);

  // Persist reviews to local storage on change.
  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  // Update active review every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews]);

  // Handle input changes.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload and convert to Base64.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewToAdd = {
      id: Date.now(),
      author: newReview.author,
      text: newReview.text,
      date: new Date().toLocaleDateString(),
      avatar:
        newReview.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
      rating: newReview.rating
    };
    setReviews((prevReviews) => [reviewToAdd, ...prevReviews]);
    setNewReview({ author: "", text: "", avatar: "", rating: 0 });
    setShowModal(false);
  };

  return (
    <div>
      <div className="testimonial-wrapper">
        <h2 className="testimonial-title">Trusted by experts and customers</h2>
        <p className="testimonial-subtitle">
          Discover early user feedback on <span>Dico integration</span> within their workflows.
        </p>
        <div className="testimonial-container">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`testimonial-card ${index === scrollPosition ? "active" : ""}`}
            >
              <div className="testimonial-header">
                <img src={review.avatar} alt={review.author} className="avatar" />
                <div>
                  <h3 className="author-name">{review.author}</h3>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => {
                      const ratingValue = i + 1;
                      return (
                        <FaStar
                          key={i}
                          size={16}
                          color={ratingValue <= review.rating ? "#ff6ec4" : "#ccc"}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="testimonial-text">« {review.text} »</p>
              <p className="testimonial-date">📅 {review.date}</p>
            </div>
          ))}
        </div>
        {/* Moved the Add Review Button inside the testimonial-wrapper */}
        <div className="add-review-button-wrapper">
          <button className="add-review-button" onClick={() => setShowModal(true)}>
            Add Review
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setShowModal(false)}>
              <FaTimes size={20} />
            </button>
            <h3>Add Your Review</h3>
            <form onSubmit={handleSubmit} className="review-form">
              <input
                type="text"
                name="author"
                placeholder="Your Name"
                value={newReview.author}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="text"
                placeholder="Your Review"
                value={newReview.text}
                onChange={handleInputChange}
                required
              />
              <div className="rating-input">
                <label>Rate Us:</label>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={24}
                      color={star <= newReview.rating ? "#ff6ec4" : "#ccc"}
                      onClick={() =>
                        setNewReview((prev) => ({ ...prev, rating: star }))
                      }
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="avatar-upload">Upload Photo (optional): </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="submit-button">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
