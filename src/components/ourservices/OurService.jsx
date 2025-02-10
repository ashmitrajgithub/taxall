import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaFileInvoiceDollar, FaMoneyCheckAlt, FaGavel, FaCalculator } from 'react-icons/fa';
import './OurService.css';

const services = [
  {
    title: "ITR Filing",
    icon: <FaFileInvoiceDollar size={50} />,
    frontDescription: "Expert assistance for filing your Income Tax Returns on time.",
    backTitle: "File Your ITR",
    backDescription: "Get professional support to ensure accurate and timely ITR filing.",
    link: "/itr-filing"
  },
  {
    title: "TDS",
    icon: <FaMoneyCheckAlt size={50} />,
    frontDescription: "Efficient TDS solutions to ensure complete compliance.",
    backTitle: "Manage TDS",
    backDescription: "Our TDS services help you avoid penalties and stay compliant.",
    link: "/tds"
  },
  {
    title: "Legal Services",
    icon: <FaGavel size={50} />,
    frontDescription: "Professional legal advice for all your tax matters.",
    backTitle: "Tax Legal Support",
    backDescription: "Consult our experts for reliable legal support in tax issues.",
    link: "/legal-services"
  },
  {
    title: "Accounting",
    icon: <FaCalculator size={50} />,
    frontDescription: "Reliable accounting to keep your finances in order.",
    backTitle: "Accounting Help",
    backDescription: "Expert accounting services designed for your business needs.",
    link: "/accounting"
  },
];

const OurService = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="ourservice-main">
    <section className="our-service-section">
      <div className="header-container" data-aos="fade-down">
        <h2 className="subheading">Explore</h2>
        <h1 className="heading">Services I Provide For My Clients</h1>
        <p className="description">I can help you in these particular areas.</p>
      </div>
      <div className="cards-container">
        {services.map((service, index) => (
          <div key={index} className="service-card" data-aos="fade-up">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-icon">{service.icon}</div>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-front-description">{service.frontDescription}</p>
              </div>
              <div className="card-back">
                <h3 className="card-back-title">{service.backTitle}</h3>
                <p className="card-back-description">{service.backDescription}</p>
                <a href={service.link} className="learn-more-button">Learn More</a>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
    </div>

  );
};

export default OurService;
