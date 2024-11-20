import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Login.css";
import HouseIcon from "@mui/icons-material/House";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const NavigateToSignUp = () => {
    navigate("/signup", { replace: true });
  };

  const NavigateToHome = () => {
    navigate("/", { replace: true });
  };

  const NavigateToForgotPassword = () => {
    navigate("/forgotPassword");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email !== "" && pass !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        email: email,
        password: pass,
      };
      await axios
        .post("https://coura.onrender.com/api/auth/login", body, config)
        .then(async (res) => {
          console.log(res.data);
          alert(res.data.message);
          window.localStorage.setItem("token", res.data.data);
          window.localStorage.setItem("loggedIn", true);

          const body = {
            token: window.localStorage.getItem("token"),
          };

          await axios
            .post("https://coura.onrender.com/api/auth/userData", body, config)
            .then((result) => {
              console.log(result.data);
              window.localStorage.setItem("userId", result.data.data._id);
              window.localStorage.setItem("userName", result.data.data.name);
              window.localStorage.setItem("userEmail", result.data.data.email);
              window.localStorage.setItem(
                "userCollege",
                result.data.data.collegeName
              );
            })
            .catch((err) => {
              console.log(err);
            });

          window.location.href = "/";
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.message);
        });
    } else alert("Please fill all the fields!");
  };

  return (
    <div class="container">
      <div className="login-container">
        <div className="auth-form-container">
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email" style={{ color: "#333333" }}>
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              type="email"
              placeholder="youremail@gmail.com"
              id="email"
              name="email"
            />
            <label htmlFor="password" style={{ color: "#333333" }}>
              Password
            </label>
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value.trim())}
              type="password"
              placeholder="********"
              id="password"
              name="password"
            />
            <button type="submit">Log In</button>
          </form>
          <button className="linkBtn" onClick={NavigateToSignUp}>
            Don't have an account? Register here.
          </button>

          <button className="linkBtn" onClick={NavigateToForgotPassword}>
            Forgot password?
          </button>
        </div>
      </div>
      <div className="main-container">
        <div className="text-container">
          <div className="home-container">
            <button className="link-btn-home" onClick={NavigateToHome}>
              <HouseIcon />
            </button>
          </div>

          <h1
            style={{
              fontFamily: "Source Serif Pro, serif",
              fontSize: "50px",
              marginTop: "7px",
            }}
          >
            Discover what your college doesn't tell you !!!
          </h1>
        </div>
        <div class="image-container">
          <img
            src="https://imageio.forbes.com/specials-images/dam/imageserve/1128723345/960x0.jpg?format=jpg&width=960"
            alt="Example image"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
