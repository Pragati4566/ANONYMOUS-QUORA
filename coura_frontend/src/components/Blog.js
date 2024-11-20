import React, { useEffect, useState } from "react";
import QuoraBox from "./QuoraBox";
import "./css/Feed.css";
import BlogPost from "./BlogPost";
import axios from "axios";

function Blog({ searchKey, category, setCategory }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    setCategory("none");
  }, []);

  useEffect(() => {
    axios
      .get("https://coura.onrender.com/api/blogs")
      .then((res) => {
        console.log(res.data);
        setBlogPosts(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = {
      userId: window.localStorage.getItem("userId"),
    };

    axios
      .post("https://coura.onrender.com/api/questions/votes", body, config)
      .then((res) => {
        console.log(res.data.votes);
        setVotes(res.data.votes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const voteById = (id) => {
    if (votes[id]) return votes[id];
    else return 0;
  };

  return (
    <div className="blog">
      <QuoraBox />
      {blogPosts.map((post, index) =>
        post.blogName.toLowerCase().includes(searchKey.toLowerCase()) ===
          true &&
        (category === "none" || post.category === category) ? (
          <BlogPost key={index} post={post} choice={voteById(post._id)} />
        ) : null
      )}
    </div>
  );
}

export default Blog;
