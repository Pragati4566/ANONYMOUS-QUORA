import React, { useState, useEffect } from "react";
import QuoraHeader from "./QuoraHeader";
import Feed from "./Feed";
import Blog from "./Blog";
import Profile from "./Profile";
import Sidebar from "./Sidebar";
import "./css/Quora.css";
import { Route, Routes } from "react-router-dom";

function Quora() {
  const token = window.localStorage.getItem("token");
  const [searchKey, setSearchKey] = useState("");
  const [category, setCategory] = useState("none");

  return (
    <div className="quora">
      <QuoraHeader searchKey={searchKey} setSearchKey={setSearchKey} />
      <div className="quora__contents">
        <Routes>
          <Route
            path="/"
            exact
            element={
              <div className="quora__content">
                {" "}
                <Sidebar category={category} setCategory={setCategory} />{" "}
                <Feed
                  searchKey={searchKey}
                  category={category}
                  setCategory={setCategory}
                />{" "}
              </div>
            }
          />
          <Route
            path="/feed"
            exact
            element={
              <div className="quora__content">
                {" "}
                <Sidebar category={category} setCategory={setCategory} />{" "}
                <Feed
                  searchKey={searchKey}
                  category={category}
                  setCategory={setCategory}
                />{" "}
              </div>
            }
          />
          <Route
            path="/blogFeed"
            exact
            element={
              <div className="quora__content">
                {" "}
                <Sidebar category={category} setCategory={setCategory} />{" "}
                <Blog
                  searchKey={searchKey}
                  category={category}
                  setCategory={setCategory}
                />{" "}
              </div>
            }
          />
          {token && (
            <Route
              path="/profile"
              exact
              element={
                <div className="quora__content">
                  <Profile />
                </div>
              }
            />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default Quora;
