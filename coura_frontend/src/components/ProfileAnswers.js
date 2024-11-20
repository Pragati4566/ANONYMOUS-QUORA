import React, { useState } from "react";
import { Avatar } from "@mui/material";
import "./css/Post.css";
import "react-responsive-modal/styles.css";
import "react-quill/dist/quill.snow.css";
import ReactTimeAgo from "react-time-ago";
import ReactHtmlParser from "html-react-parser";

function LastSeen({ date }) {
  return (
    <div>
      <ReactTimeAgo date={date} locale="en-US" timeStyle="round" />
    </div>
  );
}

function ProfileAnswers({ post }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const userId = window.localStorage.getItem("userId");
  const userName = window.localStorage.getItem("userName");

  const toggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  return (
    <div className="post">
      <div className="post__info">
        <Avatar />
        <h3 style={{ marginLeft: "10px", color: "#333333" }}>Anonymous</h3>
        <small>
          {" "}
          <LastSeen date={post?.createdAt} />
        </small>
      </div>
      <div className="post__body">
        <div className="post__question">
          <p style={{ fontSize: "23px", color: "black" }}>
            {post?.questionName}
          </p>
        </div>
        {post?.questionUrl && <img src={post?.questionUrl} alt="url" />}
      </div>

      <p
        onClick={toggleAnswers}
        style={{
          color: "#0d8ecf",
          fontSize: "15px",
          fontWeight: "bold",
          margin: "10px 0",
          cursor: "pointer",
        }}
      >
        {post?.allAnswers.length} Answer(s)
      </p>

      {showAnswers && (
        <div className="modal__answers">
          {post?.allAnswers?.map((ans) => (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  padding: "10px 5px",
                  borderTop: "1px solid lightgray",
                }}
                className="post-answer-container"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    fontSize: "12px",
                  }}
                  className="post-answered"
                >
                  <Avatar />

                  <div
                    style={{
                      margin: "0px 10px",
                    }}
                    className="post-info"
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        color: "#333333",
                        fontWeight: "600",
                      }}
                    >
                      Anonymous
                    </p>
                    <span>
                      <LastSeen date={ans?.createdAt} />
                    </span>
                  </div>
                </div>
                <div
                  className="post-answer"
                  style={{
                    color: "black",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {ReactHtmlParser(ans?.answer)}
                </div>
              </div>
            </>
          ))}
        </div>
      )}

      {!showAnswers && (
        <div
          style={{
            margin: "5px 0px 0px 0px",
            padding: "5px 0px 0px 20px",
            borderTop: "1px solid lightgray",
          }}
          className="post__answer"
        >
          {post?.allAnswers?.map((ans, index) =>
            ans.ansUserId === userId ? (
              <div
                key={ans.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  padding: "10px 5px",
                  borderTop: "1px solid lightgray",
                }}
                className="post-answer-container"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    fontSize: "12px",
                  }}
                  className="post-answered"
                >
                  <Avatar />

                  <div
                    style={{
                      margin: "0px 10px",
                    }}
                    className="post-info"
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        color: "#333333",
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      {userName}
                    </p>
                    <span>
                      <LastSeen date={ans?.createdAt} />
                    </span>
                  </div>
                </div>
                <div
                  className="post-answer"
                  style={{
                    color: "black",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {ReactHtmlParser(ans?.answer)}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileAnswers;
