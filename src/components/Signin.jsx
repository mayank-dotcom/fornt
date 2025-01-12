import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Css/Sigin.css";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://back-ajnk.onrender.com/login", {
        email,
        password,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);

        if (res.data.redirect) {
          navigate(res.data.redirect);
        }
      }
    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <div id="form_cont">
        <div className="heading"><p>Log In</p></div>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
  
    </div>
  );
}

export default Signin;
