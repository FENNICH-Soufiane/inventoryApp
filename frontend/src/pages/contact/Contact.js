import React, { useState } from "react";
import "./Contact.scss";
import Card from "../../components/card/Card";
import { FaPhoneAlt, FaEnvelope, FaTwitter } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url } from "../../services/authService";
import ChangePassword from "../../components/changePassword/ChangePassword";

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const data = {
    subject,
    content,
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backend_url}/api/contactus`, data);
      setSubject("");
      setContent("");
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="contact">
      <h3 className="--mt">Contact Us</h3>
      <div className="section">
        <form onSubmit={sendEmail}>
          <Card cardClass="card">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <label>Message</label>
            <textarea
              cols="30"
              rows="10"
              name="message"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button className="--btn --btn-primary">Send Message</button>
          </Card>
        </form>

        <div className="details">
          <Card cardClass={"card2"}>
            <h3>Our Contact Information</h3>
            <p>Fill the form or contact us via other channels listed below</p>

            <div className="icons">
              <span>
                <FaPhoneAlt />
                <p>070123123123</p>
              </span>
              <span>
                <FaEnvelope />
                <p>Support@invent.com</p>
              </span>
              <span>
                <GoLocation />
                <p>Abuja, Nigeria</p>
              </span>
              <span>
                <FaTwitter />
                <p>@ZinoTrust</p>
              </span>
            </div>
          </Card>
          <br />
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default Contact;
