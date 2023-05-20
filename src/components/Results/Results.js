/*
Primary component to manage results.
The variable 'data' is mostly used as a temporary variable
*/
import {React, useState, useEffect} from 'react'

import './Results.css'
export default function Results() {
    document.title = "Results"

    // Initialize variables with initial state
    const [course, setCourseName] = useState("");
    const [student, setStudentName] = useState("");
    const [score, setScore] = useState("");

    const allScores = ["A", "B", "C", "D", "E", "F"]
    const [allCourses, setAllCourses] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [allResults, setAllResults] = useState();

    // GET request for fetching list of results from the database
    const fetchResults = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/all_results'); // Since this is a development version and not hosted, we send requests to localhost
            if (!response.ok) {
                throw new Error('Error');
            }
            const data = await response.json();
            setAllResults(data.results); // Got the results

        } catch (error) {
            console.error('Error retrieving results:', error);
        }
    };

    // GET request for fetching list of courses from the database
    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/all_courses');
            if (!response.ok) {
                throw new Error('Error');
            }
            const data = await response.json();
            setAllCourses(data.courses);

        } catch (error) {
            console.error('Error retrieving courses:', error);
        }
    };
    
    // GET request for fetching list of students from the database
    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/all_students');
            if (!response.ok) {
                throw new Error('Error');
            }
            const data = await response.json();
            
            // Format the student name before displaying 
            const student_list = []
            for(let obj of data.students){
                let student_name = obj.first_name + " " +obj.family_name
                student_list.push(student_name)
            }
            setAllStudents(student_list);

        } catch (error) {
            console.error('Error retrieving students:', error);
        }
    };
    
    useEffect(() => { // Call API only once on page load
        fetchCourses();
        fetchStudents();
        fetchResults();
    }, []);

    // Function to run when form is submitted
    const submitForm = async (e) => {
        e.preventDefault();
        
        // Checking if a course, student and score is selected from dropdown
        if(!course){
            alert("Please select a course from the given dropdown");
            return;
        }
        
        if(!student){
            alert("Please select a student from the given dropdown");
            return;
        }
        if(!score){
            alert("Please select a course from the given dropdown");
            return;
        }


        console.log(`Course Name: ${course}, Student Name: ${student}, Score: ${score}`);

        try {
            const response = await fetch('http://localhost:8000/api/add_result', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ course, student, score })
            });
        
            if (!response.ok) {
                throw new Error('Error');
            }
        
            const data = await response.json();

            // Notification for new addition
            alert("Results inserted");
            
            // Clear all form contents
            clearForm()

            // Refresh the table
            fetchResults()
        } catch (error) {
            alert('Cannot insert result: ', error);
        }
    };

    // Utility function to clear form fields
    const clearForm = () => {
        setScore("")
        setStudentName("")
        setCourseName("")
    }

  return (
    <>
    <div className="section-heading">Please fill the form to add a result</div>
    <form onSubmit={submitForm}>
      <label>
        Course Name:
        
        <select value={course} onChange={(e) => setCourseName(e.target.value)}>
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
        <select value={student} onChange={(e) => setStudentName(e.target.value)}>
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
    {/* Populate the table only if there are available results*/}
    { allResults ?
        <>
        <div className="section-heading">Currently available results</div>
        <table>
            <tr>
                <th>Course</th>
                <th>Student</th>
                <th>Score</th>
            </tr>
            {allResults.map((s) => {
                return(
                    <tr>
                        <td>{s.course_name}</td>
                        <td>{s.student_name}</td>
                        <td>{s.score}</td>
                    </tr>
                )
            })}
        </table></>: <h2 className="section-heading">No Results</h2> 
    }
    </>
  )
}
