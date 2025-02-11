import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Review.css";

const testimonialData = [
  {
    id: 1,
    name: "Martin Goutry",
    role: "Back-end developer at MyDodow",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%205.27.51%E2%80%AFPM-UzFTFR7bKZdK7KqYwz1i4Lc1Y0iB7U.png",
    quote:
      "Dico is finally addressing a long time problem we had when building UIs. It's ease of use and workflow seems really intuitive. Promising!",
    date: "2021.03.02",
  },
  {
    id: 2,
    name: "Theo Champion",
    role: "Back-end developer at MyDodow",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%205.27.51%E2%80%AFPM-UzFTFR7bKZdK7KqYwz1i4Lc1Y0iB7U.png",
    quote:
      "Dico is finally addressing a long time problem we had when building UIs. It's ease of use and workflow seems really intuitive. Promising!",
    date: "2021.03.02",
  },
  {
    id: 3,
    name: "Agnes Remi",
    role: "Back-end developer at MyDodow",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%205.27.51%E2%80%AFPM-UzFTFR7bKZdK7KqYwz1i4Lc1Y0iB7U.png",
    quote:
      "Dico is finally addressing a long time problem we had when building UIs. It's ease of use and workflow seems really intuitive. Promising!",
    date: "2021.03.02",
  },
  {
    id: 4,
    name: "Roman Atwoods",
    role: "Back-end developer at MyDodow",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%205.27.51%E2%80%AFPM-UzFTFR7bKZdK7KqYwz1i4Lc1Y0iB7U.png",
    quote:
      "Dico is finally addressing a long time problem we had when building UIs. It's ease of use and workflow seems really intuitive. Promising!",
    date: "2021.03.02",
  },
];

export default function Review() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      once: false,     // Whether animation should happen only once
    });
  }, []);

  return (
    <section className="testimonials">
      <div className="testimonials-header" data-aos="fade-down">
        <h1>Users Testimonials</h1>
        <p>
          Discover early user's feedback on{" "}
          <span className="highlight">
            Dico integration within their workflows
          </span>.
        </p>
      </div>

      <div className="testimonials-grid">
        {testimonialData.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="testimonial-card"
            data-aos="fade-up"
            data-aos-delay={index * 100} // Staggered delay for each card
            style={{
              // Adjust position based on index for staggered layout
              left: `${index * 8}%`,
              top: `${index * 5}%`,
              zIndex: testimonialData.length - index,
            }}
          >
            <div className="user-info">
              <img
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name}
                className="avatar"
              />
              <div className="user-details">
                <h3>{testimonial.name}</h3>
                <p className="role">{testimonial.role}</p>
              </div>
            </div>
            <blockquote>
              <p>"{testimonial.quote}"</p>
            </blockquote>
            <div className="meta">
              <span className="flag">🏳️‍🌈</span>
              <span className="date">Dico user, {testimonial.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
