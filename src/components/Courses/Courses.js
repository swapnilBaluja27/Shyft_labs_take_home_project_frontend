import {React, useState, useEffect} from 'react';

import './Courses.css';

export default function Courses() {
    // document.title = "Courses"

    // Initialize variables(camelCase) with initial state 
    const [courseName, setCourseName] = useState("");
    const [allCourses, setAllCourses] = useState();

    // GET request for fetching list of students from the database
    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/getcourses'); // Since this is a development version and not hosted, we send requests to localhost
            if (!response.ok) {
                throw new Error('Error');
            }
            const data = await response.json();
            console.log(data.all_course);
            setAllCourses(data.all_course);
            // setAllCourses(data.courses); // Got the courses

        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };
    
    useEffect(() => {
        fetchCourses(); // Call API only once on page load
    }, []);

    // Function to run when form is submitted
    const submitForm = async (e) => {
        e.preventDefault();

        console.log(`Course Name: ${courseName}`);

        try {
            const response = await fetch('http://localhost:8000/api/addcourse', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courseName })
            });
        
            if (!response.ok) {
                throw new Error('Error');
            }
        
            const data = await response.json();

            // Notification for new addition
            alert("Course Details inserted");
            
            // Clear all form contents
            clearForm()

            // Refresh the table
            fetchCourses()

        } catch (error) {
            alert('Cannot insert course details: ', error);
        }
    };

    // Utility function to clear form fields
    const clearForm = () => {
        setCourseName("")
    }

  return (
    <>
    <div className="section-heading">Please fill the form to add a course</div>
    <form onSubmit={submitForm}>
      <label>
        Course Name:
        <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} required/>
      </label>
      
      <button type="submit">Submit</button>
    </form>
    {/* Populate the table only if there are available courses*/}
    { allCourses ?
        <>
        <div className="section-heading">Currently available courses</div>
        <div id="table_container">
            <table id="courses_table">
                <tr>
                    <th>Course Name</th>
                </tr>
                {allCourses.map((c) => {
                    return(
                        <tr>
                            <td>{c}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
        </>: <h2 id="">No Courses</h2> 
    }
    </>
  )
}
