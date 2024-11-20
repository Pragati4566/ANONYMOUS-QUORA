import "./css/SidebarOptions.css";
import React from "react";

function SidebarOptions({ category, setCategory }) {
  const isActiveCategory = (c) => {
    return category === c;
  };

  return (
    <div className="sidebarOption">
      <div className="category">
        <img
          src="https://icon-library.com/images/college-icon/college-icon-15.jpg"
          alt="Loading"
          className="categoryIcon"
        />
        <p
          className={`optionText ${
            isActiveCategory("placementReview") ? "active" : ""
          }`}
          onClick={() => {
            setCategory("placementReview");
          }}
        >
          Placements
          <br />
          Reviews
        </p>
      </div>

      <div className="category">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4658/4658825.png"
          alt="Loading"
          className="categoryIcon"
        />
        <p
          className={`optionText ${
            isActiveCategory("courseFeedback") ? "active" : ""
          }`}
          onClick={() => {
            setCategory("courseFeedback");
          }}
        >
          Course
          <br />
          Feedback
        </p>
      </div>

      <div className="category">
        <img
          src="https://static.thenounproject.com/png/472944-200.png"
          alt="Loading"
          className="categoryIcon"
        />
        <p
          className={`optionText ${
            isActiveCategory("hostelReview") ? "active" : ""
          }`}
          onClick={() => {
            setCategory("hostelReview");
          }}
        >
          Hostel
          <br />
          Review
        </p>
      </div>

      <div className="category">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrEZswAlWjn9gJlAbuYFBN5m55qoRJFAdiBA&usqp=CAU"
          alt="Loading"
          className="categoryIcon"
        />
        <p
          className={`optionText ${
            isActiveCategory("collegeInfrastructure") ? "active" : ""
          }`}
          onClick={() => {
            setCategory("collegeInfrastructure");
          }}
        >
          College
          <br />
          Infrastructure
        </p>
      </div>

      <div className="category">
        <img
          src="https://cdn-icons-png.flaticon.com/512/8/8178.png"
          alt="Loading"
          className="categoryIcon"
        />
        <p
          className={`optionText ${
            isActiveCategory("collegeLocation") ? "active" : ""
          }`}
          onClick={() => {
            setCategory("collegeLocation");
          }}
        >
          College
          <br />
          Location
        </p>
      </div>

      <div className="category">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReZqfQ5Bo5wCxrzuw9sfqp7ITA_jS214Smgw&usqp=CAU"
          alt="Loading"
          className="categoryIcon"
        />
        <p
          className={`optionText ${
            isActiveCategory("sportsFacilities") ? "active" : ""
          }`}
          onClick={() => {
            setCategory("sportsFacilities");
          }}
        >
          Sports
          <br />
          Facilities
        </p>
      </div>

      <div className="category">
        <img
          src="https://cdn-icons-png.flaticon.com/512/6926/6926264.png"
          alt="Loading"
          className="categoryIcon"
        />
        <p
          className={`optionText ${
            isActiveCategory("scholarships") ? "active" : ""
          }`}
          onClick={() => {
            setCategory("scholarships");
          }}
        >
          Scholarships
        </p>
      </div>

      <div className="category">
        <img
          src="https://static.vecteezy.com/system/resources/previews/004/572/118/original/economy-line-icon-logo-illustration-free-vector.jpg"
          alt="Loading"
          className="categoryIcon"
        />
        <p
          className={`optionText ${
            isActiveCategory("feeStructure") ? "active" : ""
          }`}
          onClick={() => {
            setCategory("feeStructure");
          }}
        >
          Fee
          <br />
          Structure
        </p>
      </div>
    </div>
  );
}

export default SidebarOptions;
