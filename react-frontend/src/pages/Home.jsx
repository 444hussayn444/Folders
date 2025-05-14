import React from "react";
import "./styles/home.css";
import { useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <div className="try-ad">
        <h2 className="title">Health Care Center</h2>
        <button className="try-btn" onClick={() => navigate("/predict")}>
          Try Now For Free
        </button>
      </div>
      <div className="description">
        <p className="welcome">
          Welcome to Medical Health center, where health meets technology for a
          brighter, healthier future.
        </p>
        <div className="doc">
          <h3>Our Vision</h3>

          <p>
            We envision a world where access to healthcare information is not
            just a luxury but a fundamental right. Our journey began with a
            simple yet powerful idea: to empower individuals with the knowledge
            and tools they need to take control of their health.
          </p>
        </div>
        <div className="doc">
          <h3>Who We Are</h3>
          <p>
            We are a passionate team of healthcare professionals, data
            scientists, and technology enthusiasts who share a common goal: to
            make healthcare accessible, understandable, and personalized for
            you. With years of experience in both healthcare and cutting-edge
            technology, we've come together to create this platform as a
            testament to our commitment to your well-being.
          </p>
        </div>
        <div className="doc">
          <h3>Our Mission</h3>

          <p>
            At this website, our mission is to provide you with a seamless and
            intuitive platform that leverages the power of artificial
            intelligence and machine learning. We want to assist you in
            identifying potential health concerns based on your reported
            symptoms, all while offering a wealth of educational resources to
            enhance your health literacy.
          </p>
        </div>
        <div className="doc">
          <h3>How We Do It</h3>

          <p>
            Our platform utilizes a robust machine learning model trained on a
            vast dataset of symptoms and diseases. By inputting your symptoms,
            our system generates accurate predictions about potential illnesses,
            allowing you to make informed decisions about your health.
          </p>
        </div>
        <div className="doc">
          <h3>Your Well-being, Our Priority</h3>

          <p>
            Your health is our top priority. We understand that navigating the
            complexities of healthcare can be daunting. That's why we've gone
            the extra mile to provide not only accurate predictions but also
            comprehensive information about each disease. You'll find
            descriptions, recommended precautions, medications, dietary advice,
            and workout tips to support your journey to better health.
          </p>
        </div>
        <div className="doc">
          <h3>Join Us on this Journey</h3>
          <p>
            We invite you to explore our platform, engage with our educational
            content, and take control of your health journey. Together, we can
            revolutionize the way individuals access and understand healthcare
            information.
          </p>
        </div>
      </div>
      <div className="footer">
        <h1>Join Us</h1>

        <p className="p">
          Thank you for choosing
          <span className="webTit">Health Care Center</span>as your trusted
          health companion. We are here to empower you with knowledge, support,
          and a brighter, healthier future.
        </p>
        <div className="icons">
          <FaFacebook className="social" />
          <FaGithub className="social" />
          <FaLinkedin className="social" />
        </div>
      </div>
    </div>
  );
};

export default Home;
