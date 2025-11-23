import React, { useState, useEffect } from "react";
import "./PopupForm.css";
import axios from 'axios';


export default function PopupForm() {
  const [showPopup, setShowPopup] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    isPhoneSameAsWhatsapp: false,
    isWorkEmailProvided: null,
    workEmail: null,
    subscribeNotifications: false,
    notificationFrequency: [],
  });

  useEffect(() => {
    setShowPopup(true);
    const esc = (e) => e.key === "Escape" && setShowPopup(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "notificationFrequency" && type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        notificationFrequency: checked
          ? [...prev.notificationFrequency, value]
          : prev.notificationFrequency.filter((f) => f !== value),
      }));
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkEmailChoice = (value) => {
    setFormData((prev) => ({
      ...prev,
      isWorkEmailProvided: value,
      workEmail: value ? prev.workEmail : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPopup(false);
  
    try {
      const response = await axios.post(
        'http://54.85.80.177:8081/api/notifications/add/user/subscribe',
        formData,
        {
          headers: {
            "Authorization": `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1NzMzYmJiZDgxOGFhNWRiMTk1MTk5Y2Q1NjhlNWQ2ODUxMzJkM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0NDA5NDk3MjQ5NzYtNWZvNTZqNHNmcW0yY2M3MGVlMWZldjA5amZpZ2NrczAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NDA5NDk3MjQ5NzYtNWZvNTZqNHNmcW0yY2M3MGVlMWZldjA5amZpZ2NrczAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMxMTM3Nzg3NjUwMzk5NDcxMTIiLCJhdF9oYXNoIjoiSC1icW04YlZ6cWdINWxMTlRXT2FZQSIsImlhdCI6MTc2Mzg5MjU1NCwiZXhwIjoxNzYzODk2MTU0fQ.laPtQaVF8NaQH3ih9lm8Q1itH8Q80x8w8aonbdcaK-Pze8vDb_lwqGndRBfSbkW4Jp7Ds0LiwoA5i4fGtG1R2uV7HXIg4HGphvi5a9tw_VdSHNZp6uPL_ml0KEQ72xDkbXtL9pSdVY8T-2BEfDyjb5JYSXAyWi2oHvzdaI9Lqhzr_jLsanMtsDJr7o_hD00wl0lSU7QaLwVrrY1hVGx8cCEZjQA6qbwywWG4vgQJvr1twNlVx4QAw30DTCohnfT8uQ49otP-2TJxq102a7RZ3mVnUEHWWKI94KfOtdBVuIAtCAjMw1MVC2r-XdaEIw8xL8wZQX409ir6ffZifJ9ikA`,
            "Content-Type": "application/json"
          }
        }
      );
  
      alert("User Onboarded:\n" + JSON.stringify(formData, null, 2));
      setResponseMessage('Data submitted successfully: ' + JSON.stringify(response.data));
  
    } catch (error) {
      setResponseMessage('Error submitting data: ' + error.message);
      console.error('Error:', error);
    }
  };
  

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        <button className="close-btn" onClick={() => setShowPopup(false)}>
          ✕
        </button>

        <h2 className="title">Please enter your details</h2>

        <form onSubmit={handleSubmit} className="form">
          
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number (with extension)</label>
            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="checkbox-row">
            <input type="checkbox" name="isPhoneSameAsWhatsapp" checked={formData.isPhoneSameAsWhatsapp} onChange={handleChange} />
            <label>Is this a WhatsApp number?</label>
          </div>

          <div className="form-group">
            <label>Provide Work Email?</label>

            <div className="radio-row">
              <label>
                <input type="radio" checked={formData.isWorkEmailProvided === true} onChange={() => handleWorkEmailChoice(true)} />
                Yes
              </label>
              <label>
                <input type="radio" checked={formData.isWorkEmailProvided === false} onChange={() => handleWorkEmailChoice(false)} />
                No
              </label>
            </div>

            {formData.isWorkEmailProvided && (
              <input
                name="workEmail"
                type="email"
                placeholder="Enter work email"
                value={formData.workEmail}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>

          <div className="checkbox-row">
            <input type="checkbox" name="subscribeNotifications" checked={formData.subscribeNotifications} onChange={handleChange} />
            <label>Subscribe for notifications</label>
          </div>

          <div className="form-group">
            <label>Notification Frequencey</label>
            <div className="checkbox-grid">
              {["Daily", "Weekly", "Monthly", "Yearly"].map((freq) => (
                <label key={freq} className="checkbox-item">
                  <input
                    type="checkbox"
                    name="notificationFrequency"
                    value={freq}
                    checked={formData.notificationFrequency.includes(freq)}
                    onChange={handleChange}
                  />
                  {freq}
                </label>
              ))}
            </div>
          </div>

          <button className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
