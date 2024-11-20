import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Search } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./css/QuoraHeader.css";
import "react-responsive-modal/styles.css";
import axios from "axios";
import DropDownProfile from "./DropDownProfile";
import { useLocation } from "react-router-dom";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";

function QuoraHeader({ searchKey, setSearchKey }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isCreateBlogModalOpen, setIsCreateBlogModalOpen] = useState(false);

  const [blogContent, setBlogContent] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [inputUrlBlog, setInputUrlBlog] = useState("");
  const [question, setQuestion] = useState("");
  const [quesCategory, setQuesCategory] = useState("none");
  const [blogCategory, setBlogCategory] = useState("none");
  const [openProfile, setOpenProfile] = useState(false);

  const [activeTab, setActiveTab] = useState("feed");
  const loggedIn = window.localStorage.getItem("loggedIn");
  const navigate = useNavigate();
  const Close = <CloseIcon />;
  const location = useLocation();

  const NavigateToLogin = () => {
    navigate("/login", { replace: true });
  };

  const handleBlogCategory = (e) => {
    setBlogCategory(e.target.value);
  };

  const handleQuesCategory = (e) => {
    setQuesCategory(e.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  const handleAddQuestionClick = () => {
    setIsModalOpen(true);
    setModalType("question");
  };

  const handleCreateBlogClick = () => {
    setIsModalOpen(true);
    setModalType("blog");
  };

  const handleTabClick = (tabName) => {
    if (tabName === "blog") navigate("/blogFeed", { replace: true });
    else navigate("/feed", { replace: true });

    setActiveTab(tabName);
  };

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  const handleSubmit = async () => {
    if (question !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        questionName: question,
        questionUrl: inputUrl,
        category: quesCategory,
        userId: window.localStorage.getItem("userId"),
      };
      await axios
        .post("https://coura.onrender.com/api/questions", body, config)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          setIsModalOpen(false);
          window.location.href = "/feed";
        })
        .catch((err) => {
          console.log(err);
          alert("Error in adding question!");
        });
    }
  };

  const handleSubmitBlog = async () => {
    if (blogContent !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        blogName: blogContent,
        blogUrl: inputUrlBlog,
        category: blogCategory,
        userId: window.localStorage.getItem("userId"),
      };
      await axios
        .post("https://coura.onrender.com/api/blogs", body, config)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          setIsModalOpen(false);
          window.location.href = "/blogFeed";
        })
        .catch((err) => {
          console.log(err);
          alert("Error in adding blog!");
        });
    }
  };

  return (
    <div className="qHeader">
      <div className="qHeader-content">
        <div className="qHeader__logo">
          <img
            src="https://video-public.canva.com/VAD8lt3jPyI/v/ec7205f25c.gif"
            alt="logo"
          />
        </div>
        <div className="qHeader__icons">
          <div
            className={`qHeader__icon ${isActiveTab("/feed") ? "active" : ""}`}
            onClick={() => handleTabClick("feed")}
          >
            <HomeIcon />
          </div>
          <div
            className={`qHeader__icon ${
              isActiveTab("/blogFeed") ? "active" : ""
            }`}
            onClick={() => handleTabClick("blog")}
          >
            <ListAltIcon />
          </div>
        </div>
        <div className="qHeader__input">
          <Search style={{ color: "#333333" }} />
          <input
            type="text"
            placeholder="Search questions"
            style={{
              background: "white",
              color: "#333333",
              fontWeight: "bold",
              fontSize: "15px",
            }}
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className="qHeader__Rem">
          {loggedIn ? (
            <div onClick={() => setOpenProfile((prev) => !prev)}>
              <Avatar />
              {openProfile && <DropDownProfile />}
            </div>
          ) : (
            <Button
              className="loginbtn"
              style={{ color: "white", fontWeight: "bold", fontSize: "21px" }}
              onClick={NavigateToLogin}
            >
              {" "}
              Login{" "}
            </Button>
          )}
        </div>

        <AddCircleOutlineSharpIcon
          className="addbtn"
          onClick={() => {
            if (window.localStorage.getItem("token") == null)
              alert("Please login to add question/ blog!");
            else setIsModalOpen(true);
          }}
          style={{ color: "white", fontSize: "45px", fontWeight: "bold" }}
        />

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle
            style={{ fontSize: "20px", fontWeight: "bold", color: "#333333" }}
          >
            Add Question/Blog
          </DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddQuestionModalOpen(true)}>
              Add Question
            </Button>

            <Button onClick={() => setIsCreateBlogModalOpen(true)}>
              Create Blog
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isAddQuestionModalOpen}
          onClose={() => setIsAddQuestionModalOpen(false)}
        >
          <DialogTitle
            style={{ fontSize: "20px", fontWeight: "bold", color: "#333333" }}
          >
            Add New Question
          </DialogTitle>
          <DialogContent
            style={{
              marginTop: "-15px",
              width: "600px",
              height: "570px",
              marginDown: "30px",
            }}
          >
            <div className="modal__Field">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  type=" text"
                  placeholder="Start your question with 'What', 'How', 'Why', etc. "
                  style={{ width: "80%" }}
                />

                <select
                  name="categoryQues"
                  id="categoryQues"
                  onChange={handleQuesCategory}
                >
                  <option value="none" selected={true}>
                    None
                  </option>
                  <option value="placementReview">Placement Review</option>
                  <option value="courseFeedback">Course Feedback</option>
                  <option value="hostelReview">Hostel Review</option>
                  <option value="collegeInfrastructure">
                    College Infrastructure
                  </option>
                  <option value="sportsFacilities">Sports Facilities</option>
                  <option value="scholarships">Scholarships</option>
                  <option value="feeStructure">Fee Structure</option>
                  <option value="collegeLocation">College Location</option>
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
          </DialogContent>
          <DialogActions>
            <Button
              className="cancelButton"
              onClick={() => setIsAddQuestionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="addButton" onClick={handleSubmit} type="submit">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isCreateBlogModalOpen}
          onClose={() => setIsCreateBlogModalOpen(false)}
        >
          <DialogTitle
            style={{ fontSize: "20px", fontWeight: "bold", color: "#333333" }}
          >
            Create Blog
          </DialogTitle>
          <DialogContent
            style={{
              marginTop: "10px",
              width: "600px",
              height: "570px",
              marginDown: "30px",
            }}
          >
            <div className="modal__Field">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  type=" text"
                  placeholder="Say Something....... "
                  style={{ width: "80%" }}
                />
                <select
                  name="categoryBlog"
                  id="categoryBlog"
                  onChange={handleBlogCategory}
                >
                  <option value="none" selected={true}>
                    None
                  </option>
                  <option value="placementReview">Placement Review</option>
                  <option value="courseFeedback">Course Feedback</option>
                  <option value="hostelReview">Hostel Review</option>
                  <option value="collegeInfrastructure">
                    College Infrastructure
                  </option>
                  <option value="sportsFacilities">Sports Facilities</option>
                  <option value="scholarships">Scholarships</option>
                  <option value="feeStructure">Fee Structure</option>
                  <option value="collegeLocation">College Location</option>
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
                  value={inputUrlBlog}
                  onChange={(e) => setInputUrlBlog(e.target.value)}
                  style={{
                    margin: "5px 0",
                    border: "1px solid lightgray",
                    padding: "10px",
                    outline: "2px solid #000",
                  }}
                  placeholder="Optional: include a link that gives context"
                />
                {inputUrlBlog !== "" && (
                  <img
                    style={{
                      height: "40vh",
                      objectFit: "contain",
                    }}
                    src={inputUrlBlog}
                    alt="displayimage"
                  />
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="cancelButtonBlog"
              onClick={() => setIsCreateBlogModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="addButtonBlog"
              onClick={handleSubmitBlog}
              type="submit"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default QuoraHeader;
