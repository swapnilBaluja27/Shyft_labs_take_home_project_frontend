import { React, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import Typography from "@mui/material/Typography";

import "./Courses.css";

export default function Courses() {

  // initialize the state variables
  const [courseName, setCourseName] = useState("");
  const [allCourses, setAllCourses] = useState();

  // GET request for fetching all the courses
  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/getcourses");
      if (!response.ok) {
        throw new Error("Error");
      }
      const data = await response.json();
      setAllCourses(data.all_course); 
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const deleteCourse = async (course_name) => {
    try {
      const response = await fetch("http://localhost:8000/api/deletecourse", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_name }),
      });

      if (!response.ok) {
        throw new Error("Error");
      }

      clearForm();
      fetchCourses();
      alert("Course Deleted");

    } catch (error) {
      alert("Cannot delete course: ", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // on clicking submit button
  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/addcourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseName }),
      });

      if (!response.ok) {
        throw new Error("Error in adding course. Try again.");
      }

      alert("Course Details added");
      clearForm();
      fetchCourses();

    } catch (error) {
      alert("Error adding course: ", error);
    }
  };

  const clearForm = () => {
    setCourseName("");
  };

  return (
    <>
      <Typography variant="h5" style={{ marginBottom: "10px" }}>
        Course Details
      </Typography>
      <div>Please add the course using the form below:</div>

      <form onSubmit={submitForm}>
        <label>
          Course Name:
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </label>

        <button type="submit">Submit</button>
      </form>

      {allCourses ? (
        <>
          <div className="section-heading">Course List</div>
          <div id="table_container">
            <table id="courses_table">
              <tr>
                <th>Course Name</th>
                <th>Delete</th>
              </tr>
              {allCourses.map((c) => {
                return (
                  <tr>
                    <td>{c}</td>
                    <td>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => deleteCourse(c)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </>
      ) : (
        <h2 id="">No Courses available</h2>
      )}
    </>
  );
}
