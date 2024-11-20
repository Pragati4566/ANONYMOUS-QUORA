import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function EmailVerified() {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();

  useEffect(async () => {
    await axios
      .get("https://coura.onrender.com/api/auth/" + param.id + "/verify/" + param.token)
      .then((res) => {
        console.log(res.data);
        setValidUrl(true);
      })
      .catch((err) => {
        console.log(err);
        setValidUrl(false);
      });
  }, [param]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#d3e8f8",
      }}
    >
      <img
        src={
          "https://www.kindpng.com/picc/m/285-2852276_email-id-verification-reminder-plugin-verify-email-illustration.png"
        }
        alt="Confirmed Letter"
        style={{ width: "300px", marginBottom: "50px" }}
      />
      {validUrl ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 5px #888888",
          }}
        >
          <h1 style={{ color: "#333333" }}>Email verified successfully</h1>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 5px #888888",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ color: "#333333", textAlign: "center" }}>
            404 Not Found
          </h1>
        </div>
      )}
    </div>
  );
}

export default EmailVerified;
