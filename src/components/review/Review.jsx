import React, { useEffect, useState } from "react";
import "./Review.css";

const reviews = [
  {
    id: 1,
    author: "Martin Goutry",
    position: "Back-end developer at MyDodow",
    text: "Dico is finally addressing a long-time problem we had when building UIs. Its ease of use and workflow seem really intuitive. Promising!",
    date: "2021.03.02",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    author: "Theo Champion",
    position: "Back-end developer at MyDodow",
    text: "Dico is finally addressing a long-time problem we had when building UIs. Its ease of use and workflow seem really intuitive. Promising!",
    date: "2021.03.02",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg"
  },
  {
    id: 3,
    author: "Agnes Remi",
    position: "Back-end developer at MyDodow",
    text: "Dico is finally addressing a long-time problem we had when building UIs. Its ease of use and workflow seem really intuitive. Promising!",
    date: "2021.03.02",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 4,
    author: "Roman Atwoods",
    position: "Back-end developer at MyDodow",
    text: "Dico is finally addressing a long-time problem we had when building UIs. Its ease of use and workflow seem really intuitive. Promising!",
    date: "2021.03.02",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg"
  }
];

const Review = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonial-wrapper">
      <h2 className="testimonial-title">Trusted by experts and businesses</h2>
      <p className="testimonial-subtitle">
        Discover early user’s feedback on <span>Dico integration</span> within their workflows.
      </p>
      <div className="testimonial-container">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`testimonial-card ${
              index === scrollPosition ? "active" : ""
            }`}
          >
            <div className="testimonial-header">
              <img src={review.avatar} alt={review.author} className="avatar" />
              <div>
                <h3 className="author-name">{review.author}</h3>
                <p className="author-position">{review.position}</p>
              </div>
            </div>
            <p className="testimonial-text">« {review.text} »</p>
            <p className="testimonial-date">📅 {review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
