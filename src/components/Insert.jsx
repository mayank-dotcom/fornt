import React, { useState } from "react";
import axios from "axios";
import './Css/Insert.css'

import Header from "./Header";
const Insert= () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://new2att.onrender.com/create-record", formData);
      setMessage(response.data.message);
      setFormData({ email: "", username: "", password: "" }); // Reset form fields
    } catch (err) {
      console.error("Error creating record:", err);
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div>
            <Header/>
        <div id="sub_con">
      <form onSubmit={handleSubmit}>
        <div id="email">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div id="username">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div id="password">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" id="rec-bt">Create Record</button>
      </form>


      </div>
    </div>
  );
};

export default Insert;
