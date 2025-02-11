// Blog.jsx
import React from 'react';
import './Blog.css';

const Blog = () => {
  // Data for the latest blog post
  const latestBlog = {
    title: "Latest Blog Post",
    image: "assets/01.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum ex a velit facilisis, sit amet tincidunt arcu fermentum.",
    date: "Feb 10, 2025",
  };

  // Array of other blog posts
  const otherBlogs = [
    {
      id: 1,
      title: "Blog Post 1",
      image: "assets/2.jpg",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      date: "Feb 08, 2025",
    },
    {
      id: 2,
      title: "Blog Post 2",
      image: "assets/02.jpg",
      description:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      date: "Feb 05, 2025",
    },
    {
      id: 3,
      title: "Blog Post 3",
      image: "assets/04.jpg",
      description:
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.",
      date: "Feb 03, 2025",
    },
  ];

  return (
    <div className="blog-container">
      <h1 className="blog-title">Our Blog</h1>

      {/* Latest Blog Section */}
      <section className="latest-blog">
        <h2 className="section-title">Latest Blog</h2>
        <div className="blog-card latest">
          <img
            src={latestBlog.image}
            alt={latestBlog.title}
            className="blog-image"
          />
          <div className="blog-content">
            <h3>{latestBlog.title}</h3>
            <p>{latestBlog.description}</p>
            <span className="blog-date">{latestBlog.date}</span>
          </div>
        </div>
      </section>

      {/* More Blogs Section */}
      <section className="other-blogs">
        <h2 className="section-title">More Blogs</h2>
        <div className="blog-grid">
          {otherBlogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <img src={blog.image} alt={blog.title} className="blog-image" />
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p>{blog.description}</p>
                <span className="blog-date">{blog.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
