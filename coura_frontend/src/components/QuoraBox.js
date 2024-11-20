import React from "react";
import "./css/QuoraBox.css";

function QuoraBox() {
  return (
    <div className="quoraBox">
      <div className="quoraBox__quora">
        <h5
          style={{
            fontSize: "22px",
            color: "#333333",
            fontWeight: "bold",
            textAlign: "center",
            padding: "5px",
          }}
        >
          Get Answers Anonymously - Your Q&A Hub for Honest and Open
          Discussion!!!
        </h5>
      </div>
    </div>
  );
}

export default QuoraBox;
