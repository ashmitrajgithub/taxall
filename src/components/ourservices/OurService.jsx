import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./OurService.css";
import { FileText, CheckCircle, Scale, Calculator } from "lucide-react";

const services = [
  {
    title: "ITR Filing",
    icon: <FileText className="service-icon" />,
    description:
      "Timely and accurate filing of Income Tax Returns for individuals and businesses.",
  },
  {
    title: "TDS",
    icon: <CheckCircle className="service-icon" />,
    description:
      "Seamless management of Tax Deducted at Source (TDS) with expert advice.",
  },
  {
    title: "Legal Services",
    icon: <Scale className="service-icon" />,
    description:
      "Professional legal support tailored to business and personal needs.",
  },
  {
    title: "Accounting",
    icon: <Calculator className="service-icon" />,
    description:
      "Efficient accounting services to keep your finances in order.",
  },
];

const OurService = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const handleApplyNow = (serviceName) => {
    alert(`Apply Now clicked for ${serviceName}`);
  };

  return (
    <section className="service-section">
      <div className="text-center" data-aos="fade-down">
        <h2 className="main-heading">Our Services</h2>
        <p className="sub-heading">
          We offer a wide range of tax, legal, and financial services to support
          individuals and businesses.
        </p>
      </div>
      <div className="service-container">
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="service-icon-container">{service.icon}</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <button
              className="service-button"
              onClick={() => handleApplyNow(service.title)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurService;
