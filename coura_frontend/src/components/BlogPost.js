import React, { useEffect, useState } from "react";
import { Avatar, Input } from "@mui/material";
import "./css/Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "react-quill/dist/quill.snow.css";
import ReactTimeAgo from "react-time-ago";
import axios from "axios";
import ReactHtmlParser from "html-react-parser";
import MessageIcon from "@mui/icons-material/Message";

const displayVoteMessage = (choice) => {
  var message = "";
  if (choice == 0) message = "not voted";
  else if (choice == 1) message = "you upvoted";
  else if (choice == -1) message = "you downvoted";
  return message;
};

function LastSeen({ date }) {
  return (
    <div>
      <ReactTimeAgo date={date} locale="en-US" timeStyle="round" />
    </div>
  );
}

function Post({ post, choice }) {
  const [isCommentInputOpen, setIsCommentInputOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [upVotes, setUpVotes] = useState(post?.blogUpvotes);
  const [downVotes, setDownVotes] = useState(post?.blogDownvotes);
  const [message, setMessage] = useState(displayVoteMessage(choice));
  const [isEditBlogModalOpen, setIsEditBlogModalOpen] = useState(false);
  const [blog, setBlog] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [blogCategory, setBlogCategory] = useState(post?.category);
  const [postUserCollege, setPostUserCollege] = useState("");
  const userId = window.localStorage.getItem("userId");

  const Close = <CloseIcon />;
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    if (!isCommentInputOpen) {
      setComment("");
    }
  }, [isCommentInputOpen]);

  useEffect(() => {
    axios
      .get(
        "https://coura.onrender.com/api/auth/" + post?.blogUserId + "/userData"
      )
      .then((res) => {
        console.log(res);
        setPostUserCollege(res.data.data.collegeName);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleBlogCategory = (e) => {
    setBlogCategory(e.target.value);
  };

  const handleQuill = (value) => {
    setComment(value);
  };

  const toggleComments = () => {
    setShowComments((prevState) => !prevState);
  };

  const handleSubmit = async () => {
    setComment(comment.trim());
    if (post?._id && comment.trim() !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        comment: comment,
        blogId: post?._id,
        userId: window.localStorage.getItem("userId"),
      };
      await axios
        .post("https://coura.onrender.com/api/comments", body, config)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          setIsCommentInputOpen(false);
          window.location.href = "/blogFeed";
        })
        .catch((err) => {
          console.log(err);
          alert("Error in adding comment!");
        });
    }
  };

  const upVote = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = {
      postId: post._id,
      userId: window.localStorage.getItem("userId"),
    };

    if (post?._id) {
      await axios
        .post("https://coura.onrender.com/api/blogs/upvotes", body, config)
        .then((res) => {
          console.log(res);
          setDownVotes(res.data.downvotes);
          setUpVotes(res.data.upvotes);
          setMessage(displayVoteMessage(res.data.choice));
          alert(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          alert("Error in upvoting");
        });
    }
    if (upvoted) {
      setUpvoted(false);
    } else {
      setUpvoted(true);
      setDownvoted(false);
    }
  };

  const downVote = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = {
      postId: post._id,
      userId: window.localStorage.getItem("userId"),
    };

    if (post?._id) {
      await axios
        .post("https://coura.onrender.com/api/blogs/downvotes", body, config)
        .then((res) => {
          console.log(res);
          setDownVotes(res.data.downvotes);
          setUpVotes(res.data.upvotes);
          setMessage(displayVoteMessage(res.data.choice));
          alert(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          alert("Error in downvoting");
        });
    }

    if (downvoted) {
      setDownvoted(false);
    } else {
      setDownvoted(true);
      setUpvoted(false);
    }
  };

  const handleDeleteBlog = async () => {
    await axios
      .delete("https://coura.onrender.com/api/blogs/" + post?._id)
      .then((res) => {
        console.log(res.data);
        alert(res.data.message);
        window.location.href = "/blogFeed";
      })
      .catch((err) => {
        console.log(err);
        alert("Error in deleting blog!");
      });
  };

  const handleDeleteComment = async (commentId) => {
    await axios
      .delete("https://coura.onrender.com/api/comments/" + commentId)
      .then((res) => {
        console.log(res.data);
        alert(res.data.message);
        window.location.href = "/blogFeed";
      })
      .catch((err) => {
        console.log(err);
        alert("Error in deleting comment!");
      });
  };

  const handleEditBlog = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = {
      blogName: blog,
      blogUrl: inputUrl,
      category: blogCategory,
    };

    await axios
      .put("https://coura.onrender.com/api/blogs/" + post?._id, body, config)
      .then((res) => {
        console.log(res.data);
        alert(res.data.message);
        window.location.href = "/blogFeed";
      })
      .catch((err) => {
        console.log(err);
        alert("Error in updating blog!");
      });

    setIsEditBlogModalOpen(false);
  };

  return (
    <div className="post">
      <div className="post__info">
        <Avatar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "10px",
          }}
        >
          <h3 style={{ color: "#333333" }}>Anonymous</h3>
          <h3 style={{ color: "gray", fontSize: "13px" }}>{postUserCollege}</h3>
        </div>
        <small>
          {" "}
          <LastSeen date={post?.createdAt} />
        </small>
      </div>
      <div className="post__body">
        <div className="post__question">
          <p
            style={{
              fontSize: "18px",
              color: "black",
            }}
          >
            {post?.blogName}
          </p>
        </div>
        {post?.blogUrl && <img src={post?.blogUrl} alt="url" />}
      </div>
      <div className="post__footer">
        <div className="post___footerAction">
          <div className="post__footerAction">
            <ArrowUpwardOutlined
              onClick={() => {
                if (window.localStorage.getItem("token") == null)
                  alert("Please login to upvote blog!");
                else {
                  upVote();
                }
              }}
              style={{
                color: message === "you upvoted" ? "green" : "black",
              }}
            />
            <p> {upVotes} </p>

            <ArrowDownwardOutlined
              onClick={() => {
                if (window.localStorage.getItem("token") == null)
                  alert("Please login to downvote blog!");
                else {
                  downVote();
                }
              }}
              style={{
                color: message === "you downvoted" ? "red" : "black",
              }}
            />
            <p> {downVotes} </p>
          </div>
          <MessageIcon
            onClick={() => {
              if (window.localStorage.getItem("token") == null)
                alert("Please login to add comment!");
              else setIsCommentInputOpen((prev) => !prev);
            }}
            style={{ color: "#0d8ecf", fontSize: "40px", marginLeft: "10px" }}
          />
        </div>

        <div className="button_container">
          <button
            onClick={() => {
              if (window.localStorage.getItem("token") == null)
                alert("Please login to edit blog!");
              else {
                setBlog(post?.blogName);
                setInputUrl(post?.blogUrl);
                setIsEditBlogModalOpen(true);
              }
            }}
            disabled={
              post?.blogUserId === userId || userId === null ? false : true
            }
            className="post__btnAnswer"
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>

          <button
            onClick={() => {
              if (window.localStorage.getItem("token") == null)
                alert("Please login to delete question!");
              else {
                handleDeleteBlog();
              }
            }}
            disabled={
              post?.blogUserId === userId || userId === null ? false : true
            }
            className="post__btnAnswer"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
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
      {isCommentInputOpen && (
        <div className="commentInput">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="Add a comment..."
            id="comment"
            name="comment"
            className="commentInputBox"
          />
          <button type="submit" onClick={handleSubmit} className="addComment">
            Add Comment
          </button>
        </div>
      )}

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
                style={{
                  color: "black",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {comment?.comment}
              </div>
              <div>
                <div
                  className="ansbtns"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <button
                    onClick={() => {
                      if (window.localStorage.getItem("token") == null)
                        alert("Please login to delete comment!");
                      else {
                        handleDeleteComment(comment?._id);
                      }
                    }}
                    disabled={
                      comment?.commentUserId === userId || userId === null
                        ? false
                        : true
                    }
                    className="post__btnAnswer"
                    style={{ marginRight: "10px", fontSize: "15px" }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showComments && (
        <div
          style={{
            margin: "5px 0px 0px 0px",
            padding: "5px 0px 0px 20px",
            borderTop: "1px solid lightgray",
          }}
          className="post__answer"
        >
          {post?.allComments?.map((comment, index) =>
            index == 0 ? (
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
                      <LastSeen date={comment?.createdAt} />
                    </span>
                  </div>
                </div>
                <div
                  className="post-answer"
                  style={{
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {ReactHtmlParser(comment?.comment)}{" "}
                </div>

                <div>
                  <div
                    className="ansbtns"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <button
                      onClick={() => {
                        if (window.localStorage.getItem("token") == null)
                          alert("Please login to delete comment!");
                        else {
                          handleDeleteComment(comment?._id);
                        }
                      }}
                      disabled={
                        comment?.commentUserId === userId || userId === null
                          ? false
                          : true
                      }
                      className="post__btnAnswer"
                      style={{ marginRight: "10px", fontSize: "15px" }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

      <Modal
        open={isEditBlogModalOpen}
        closeIcon={Close}
        onClose={() => setIsEditBlogModalOpen(false)}
        closeOnEsc
        center
        closeOnOverlayClick={false}
        styles={{
          overlay: {
            height: "auto",
          },
        }}
      >
        <div className="modal__title">
          <h5>Update Blog</h5>
        </div>
        <div className="modal__Field">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Input
              value={blog}
              onChange={(e) => setBlog(e.target.value)}
              type=" text"
              placeholder="Say Something....... "
              style={{ width: "80%" }}
            />
            <select
              name="categoryBlog"
              id="categoryBlog"
              onChange={handleBlogCategory}
            >
              <option
                value="none"
                selected={blogCategory === "none" ? true : false}
              >
                None
              </option>
              <option
                value="placementReview"
                selected={blogCategory === "placementReview" ? true : false}
              >
                Placement Review
              </option>
              <option
                value="courseFeedback"
                selected={blogCategory === "courseFeedback" ? true : false}
              >
                Course Feedback
              </option>
              <option
                value="hostelReview"
                selected={blogCategory === "hostelReview" ? true : false}
              >
                Hostel Review
              </option>
              <option
                value="collegeInfrastructure"
                selected={
                  blogCategory === "collegeInfrastructure" ? true : false
                }
              >
                College Infrastructure
              </option>
              <option
                value="sportsFacilities"
                selected={blogCategory === "sportsFacilities" ? true : false}
              >
                Sports Facilities
              </option>
              <option
                value="scholarships"
                selected={blogCategory === "scholarships" ? true : false}
              >
                Scholarships
              </option>
              <option
                value="feeStructure"
                selected={blogCategory === "feeStructure" ? true : false}
              >
                Fee Structure
              </option>
              <option
                value="collegeLocation"
                selected={blogCategory === "collegeLocation" ? true : false}
              >
                College Location
              </option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{
                margin: "5px 0",
                border: "1px solid lightgray",
                padding: "10px",
                outline: "2px solid #000",
              }}
              placeholder="Optional: include a link that gives context"
            />
            {inputUrl !== "" && (
              <img
                style={{
                  height: "40vh",
                  objectFit: "contain",
                }}
                src={inputUrl}
                alt="displayimage"
              />
            )}
          </div>
        </div>
        <div className="modal__buttons">
          <button
            className="cancle"
            onClick={() => setIsEditBlogModalOpen(false)}
          >
            Cancel
          </button>

          <button onClick={handleEditBlog} type="submit" className="add">
            Update Your Blog
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Post;
