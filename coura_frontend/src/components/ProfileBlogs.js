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

function ProfileBlogs({ post }) {
  const [showComments, setShowComments] = useState(false);
  const userName = window.localStorage.getItem("userName");

  const toggleComments = () => {
    setShowComments((prevState) => !prevState);
  };

  return (
    <div className="post">
      <div className="post__info">
        <Avatar />
        <h3 style={{ marginLeft: "10px", color: "#333333" }}>{userName}</h3>
        <small>
          {" "}
          <LastSeen date={post?.createdAt} />
        </small>
      </div>
      <div className="post__body">
        <div className="post__question">
          <p style={{ fontSize: "23px", color: "black" }}>{post?.blogName}</p>
        </div>
        {post?.blogUrl && <img src={post?.blogUrl} alt="url" />}
      </div>
      <p
        style={{
          color: "#0d8ecf",
          fontSize: "15px",
          fontWeight: "bold",
          margin: "10px 0",
          cursor: "pointer",
        }}
        onClick={toggleComments}
      >
        {post?.allComments.length} Comment(s)
      </p>
      {showComments && (
        <div>
          {post?.allComments?.map((comment, index) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                padding: "10px 5px",
                borderTop: "1px solid lightgray",
              }}
              className="post-answer-container"
              key={index}
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
                    <LastSeen date={comment?.createdAt} />
                  </span>
                </div>
              </div>
              <div
                className="post-answer"
                style={{ color: "black", fontSize: "20px", fontWeight: "bold" }}
              >
                {ReactHtmlParser(comment?.comment)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileBlogs;
