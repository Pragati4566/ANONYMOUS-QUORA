import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/Register.css";
import HouseIcon from "@mui/icons-material/House";

function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [name, setName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const NavigateToLogin = () => {
    navigate("/login", { replace: true });
  };

  const NavigateToHome = () => {
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail(email.trim());
    setPass(pass.trim());
    setName(name.trim());
    setCollegeName(collegeName.trim());
    if (
      email.trim() !== "" &&
      pass.trim() !== "" &&
      name.trim() !== "" &&
      collegeName.trim() !== ""
    ) {
      setIsProcessing(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        name: name,
        email: email,
        collegeName: collegeName,
        password: pass,
        confirmPassword: confirmPass,
      };

      try {
        const res = await axios.post("https://coura.onrender.com/api/auth/register", body, config);
        console.log(res.data);
        alert(res.data.message);
      } catch (err) {
        console.log(err);
        alert(err.response.data.message);
      }

      setEmail("");
      setPass("");
      setConfirmPass("");
      setName("");
      setCollegeName("");
      setIsProcessing(false);
    } else {
      alert("Please fill all the fields!");
    }
  };

  return (
    <div className="registerContainer">
      <div className="authFormContainer">
        <h1>Register</h1>
        <form className="registerForm" onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            value={name}
            name="name"
            onChange={(e) => setName(e.target.value)}
            id="name"
            placeholder="Full Name"
          />

          <label htmlFor="name">College Name</label>
          <input
            value={collegeName}
            name="collegeName"
            onChange={(e) => setCollegeName(e.target.value)}
            id="name"
            placeholder="College Name"
          />

          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@gmail.com"
            id="email"
            name="email"
          />

          <label htmlFor="password">Password</label>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
          />

          <label htmlFor="confirmpassword">Confirm-Password</label>
          <input
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
          />

          <div style={{display: "flex", flexDirection: "column" ,alignItems: "center"}}>
            {isProcessing ? (
              <progress />
            ) : (
              <button type="submit" onClick={handleSubmit}>
                Register
              </button>
            )}
          </div>
        </form>
        <button className="linkBtn" onClick={NavigateToLogin}>
          Already have an account? Login here.
        </button>
      </div>

      <div class="mainContainer">
        <div class="textContainer">
          <div className="home-container">
            <button className="linkBtnHome" onClick={NavigateToHome}>
              <HouseIcon />
            </button>
          </div>
          <h1
            style={{
              fontFamily: "Source Serif Pro, serif",
              fontSize: "50px",
              marginTop: "2px",
            }}
          >
            Welcome to COURA!
          </h1>
          <p
            style={{
              color: "#333333",
              fontFamily: "Source Serif Pro, serif",
              fontSize: "27px",
            }}
          >
            Your college story matters - sign up and make your voice heard
            anonymously!
          </p>
        </div>

        <div class="imageContainer">
          <img
            src="https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_auto,w_1400/fl_lossy,pg_1/ra2mrnpdibc7vvae8bom/the-ugliest-college-campus-ever?fimg-ssr-default"
            alt="Example Image"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
