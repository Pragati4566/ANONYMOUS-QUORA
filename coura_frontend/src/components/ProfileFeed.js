import React, { useEffect, useState } from "react";
import "./css/Feed.css";
import ProfileQuestions from "./ProfileQuestions";
import ProfileAnswers from "./ProfileAnswers";
import ProfileBlogs from "./ProfileBlogs";
import axios from "axios";

function ProfileFeed({ currentList }) {
  const userId = window.localStorage.getItem("userId");
  const [postsQuestions, setPostsQuestions] = useState([]);
  const [postsAnswers, setPostsAnswers] = useState([]);
  const [postsBlogs, setPostsBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("https://coura.onrender.com/api/questions/" + userId)
      .then((res) => {
        console.log(res.data);
        setPostsQuestions(res.data.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("https://coura.onrender.com/api/answers/" + userId)
      .then((res) => {
        console.log(res.data);
        setPostsAnswers(res.data.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("https://coura.onrender.com/api/blogs/" + userId)
      .then((res) => {
        console.log(res.data);
        setPostsBlogs(res.data.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="feed">
      {(() => {
        switch (currentList) {
          case "userAnswers":
            return postsAnswers.map((post, index) => (
              <ProfileAnswers key={index} post={post} />
            ));
          case "userBlogs":
            return postsBlogs.map((post, index) => (
              <ProfileBlogs key={index} post={post} />
            ));
          default:
            return postsQuestions.map((post, index) => (
              <ProfileQuestions key={index} post={post} />
            ));
        }
      })()}
    </div>
  );
}

export default ProfileFeed;
