import { React, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

import "./Results.css";
export default function Results() {
  const [course_name, setCourseName] = useState("");
  const [student_name, setStudentName] = useState("");
  const [score, setScore] = useState("");

  const allScores = ["A", "B", "C", "D", "E", "F"];
  const [allCourses, setAllCourses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allResults, setAllResults] = useState();

  const fetchResults = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/getresults"); 
      if (!response.ok) {
        throw new Error("Error");
      }
      const data = await response.json();
      setAllResults(data.result_var);
    } catch (error) {
      console.error("Error retrieving results:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/getcourses");
      if (!response.ok) {
        throw new Error("Error");
      }
      const data = await response.json();
      setAllCourses(data.all_course);
    } catch (error) {
      console.error("Error retrieving courses:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/getstudents");
      if (!response.ok) {
        throw new Error("Error");
      }
      const data = await response.json();

      const student_list = [];
      for (let obj of data.student_var) {
        let student_name = obj.first_name + " " + obj.family_name;
        student_list.push(student_name);
      }
      setAllStudents(student_list);
    } catch (error) {
      console.error("Error retrieving students:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    fetchResults();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();

    if (!course_name) {
      alert("Please select a course from the given dropdown");
      return;
    }

    if (!student_name) {
      alert("Please select a student from the given dropdown");
      return;
    }
    if (!score) {
      alert("Please select a course from the given dropdown");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/addresult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_name, student_name, score }),
      });

      if (!response.ok) {
        throw new Error("Error");
      }

      alert("Result added");
      clearForm();
      fetchResults();
    } catch (error) {
      alert("error adding result: ", error);
    }
  };

  const clearForm = () => {
    setScore("");
    setStudentName("");
    setCourseName("");
  };

  return (
    <>
      <Typography variant="h5" style={{ marginBottom: "10px" }}>
        Results
      </Typography>
      <div>Please add the result using the form below:</div>

      <form onSubmit={submitForm} className="form-container">
        <label>
          Course Name:
          <select
            value={course_name}
            onChange={(e) => setCourseName(e.target.value)}
          >
            <option value="">Select a course</option>
            {allCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Student Name:
          <select
            value={student_name}
            onChange={(e) => setStudentName(e.target.value)}
          >
            <option value="">Select a student</option>
            {allStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label>
          Score:
          <select value={score} onChange={(e) => setScore(e.target.value)}>
            <option value="">Select a score</option>
            {allScores.map((s) => (
              <option key={s.id} value={s.id}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Submit</button>
      </form>

      {allResults ? (
        <>
          <div className="section-heading">Result List</div>
          <table>
            <tr>
              <th>Course</th>
              <th>Student</th>
              <th>Score</th>
            </tr>
            {allResults.map((s) => {
              return (
                <tr>
                  <td>{s.course_name}</td>
                  <td>{s.student_name}</td>
                  <td>{s.score}</td>
                </tr>
              );
            })}
          </table>
        </>
      ) : (
        <h2 className="section-heading">No Results available</h2>
      )}
    </>
  );
}
