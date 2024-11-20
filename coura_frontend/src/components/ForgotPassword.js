import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (email !== "") {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = {
        email: email,
      };
      try {
        const response = await axios.post(
          "https://coura.onrender.com/api/auth/forgotPassword",
          body,
          config
        );
        console.log(response.data);
        alert(response.data.message);
      } catch (err) {
        console.log(err);
        alert(err.response.data.message);
      } finally {
        setEmail("");
        setIsLoading(false);
      }
    } else {
      alert("Please enter your email!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#F0F8FF",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "50px",
          borderRadius: "10px",
          boxShadow: "3px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2
          style={{ color: "#333333", marginBottom: "35px", fontSize: "50px" }}
        >
          Forgot Password
        </h2>
        <label
          htmlFor="email"
          style={{
            color: "#333333",
            display: "block",
            marginBottom: "10px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Enter Your Email:
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          type="email"
          placeholder="youremail@gmail.com"
          id="email"
          name="email"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #333333",
            marginBottom: "20px",
          }}
        />

        <button
          className="link-btn"
          onClick={handleSendResetLink}
          style={{
            backgroundColor: "#0d8ecf",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            marginLeft: "15px",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Send Reset Link"}
        </button>
      </div>
      <img
        src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?w=2000"
        alt="illustration"
        style={{ marginLeft: "50px", height: "65vh" }}
      />
    </div>
  );
}

export default ForgotPassword;
