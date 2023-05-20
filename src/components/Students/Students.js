import { React, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "./Students.css";
export default function Students() {

  const [first_name, setFirstName] = useState("");
  const [family_name, setFamilyName] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");

  const [allStudents, setAllStudents] = useState();

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/getstudents"); 
      if (!response.ok) {
        throw new Error("Error");
      }
      const data = await response.json();
      setAllStudents(data.student_var);
    } catch (error) {
      console.error("Error retrieving students:", error);
    }
  };

  useEffect(() => {
    fetchStudents(); 
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();

    if (!checkDOB(date_of_birth)) {
      clearForm();
      return;
    }

    if(!checkEmail(email)) {
        clearForm();
      return;
    }

    if(!first_name || !family_name || !date_of_birth || !email) {
        alert("All fields required");
        clearForm();
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/addstudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name, family_name, date_of_birth, email }),
      });

      if (!response.ok) {
        throw new Error("Error");
      }

      alert("Student Details added");
      clearForm();
      fetchStudents();
    } catch (error) {
      alert("Cannot insert student details: ", error);
    }
  };

  const checkEmail = (email) => {
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const isValidEmail = emailRegex.test(email);
    if(!isValidEmail) {
        alert("Email format is invalid");
    }
    return isValidEmail;
  }

  const checkDOB = (givenDate) => {

    const dob_object = new Date(givenDate);
    const today_object = new Date();
    const age_difference =
      (today_object - dob_object) / (1000 * 60 * 60 * 24 * 365.25); 
    if (age_difference < 0) {
      alert("Cannot enter a date in future");
      return false;
    }

    if (age_difference < 10) {
      alert("Student must be atleast 10 years old");
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setDateOfBirth("");
    setFamilyName("");
    setFirstName("");
    setEmail("");
  };

  const deleteStudent = async (first_name) => {
    try {
      const response = await fetch("http://localhost:8000/api/deletestudent", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name }),
      });

      if (!response.ok) {
        throw new Error("Error");
      }

      alert("Student Deleted");
      clearForm();
      fetchStudents();

    } catch (error) {
      alert("Cannot delete student details: ", error);
    }
  };

  return (
    <>
      <Typography variant="h5" style={{ marginBottom: "10px" }}>
        Student Details
      </Typography>
      <div>Please fill the form to add a student</div>
      <form onSubmit={submitForm}>
        <Typography
          variant="subtitle1"
          gutterBottom
          className="label-text"
          style={{ marginTop: "10px" }}
        >
          Enter First Name:
        </Typography>
        <TextField
          required
          id="first_name"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Typography
          variant="subtitle1"
          gutterBottom
          className="label-text"
          style={{ marginTop: "10px" }}
        >
          Enter Family Name:
        </Typography>
        <TextField
          required
          value={family_name}
          onChange={(e) => setFamilyName(e.target.value)}
        />

        <Typography
          variant="subtitle1"
          gutterBottom
          className="label-text"
          style={{ marginTop: "10px" }}
        >
          Enter Date of Birth:
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            required
            value={dayjs(date_of_birth)}
            onChange={(e) => {
              setDateOfBirth(e);
            }}
          />
        </LocalizationProvider>

        <Typography variant="subtitle1" gutterBottom className="label-text">
          Enter Student Email
        </Typography>
        <TextField
          required
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>

      {allStudents ? (
        <>
          <div className="section-heading">Current Students</div>
          <table>
            <tr>
              <th>First Name</th>
              <th>Family Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Delete</th>
            </tr>
            {allStudents.map((s) => {
              return (
                <tr>
                  <td>{s.first_name}</td>
                  <td>{s.family_name}</td>
                  <td>{s.date_of_birth}</td>
                  <td>{s.email}</td>
                  <td>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => deleteStudent(s.first_name)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </table>
        </>
      ) : (
        <h2 id="">No Students</h2>
      )}
    </>
  );
}
