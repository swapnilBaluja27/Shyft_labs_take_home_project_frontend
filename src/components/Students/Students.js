
import {React, useState, useEffect} from 'react'

import './Students.css'
export default function Students() {
    document.title = "Students"

    // Initialize variables with initial state
    const [firstName, setFirstName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    const [allStudents, setAllStudents] = useState();

    // GET request for fetching list of students from the database
    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/all_students'); // Since this is a development version and not hosted, we send requests to localhost
            if (!response.ok) {
                throw new Error('Error');
            }
            const data = await response.json();
            setAllStudents(data.students); // Got the students

        } catch (error) {
            console.error('Error retrieving students:', error);
        }
    };
    
    useEffect(() => {
        fetchStudents(); // Call API only once on page load
    }, []);

    // Function to run when form is submitted
    const submitForm = async (e) => {
        e.preventDefault();

        if (!checkDOB(dateOfBirth)) {
            clearForm()
            return
        }
        
        console.log(`First Name: ${firstName}, Family Name: ${familyName}, Date of Birth: ${dateOfBirth}`);

        try {
            const response = await fetch('http://localhost:8000/api/add_student', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, familyName, dateOfBirth })
            });
        
            if (!response.ok) {
                throw new Error('Error');
            }
        
            const data = await response.json();

            // Notification for new addition
            alert("Student Details inserted");
            
            // Clear all form contents
            clearForm()

            // Refresh the table
            fetchStudents()
        } catch (error) {
            alert('Cannot insert student details: ', error);
        }
    };

    // Utility function to check the DOB entered by user
    const checkDOB = (givenDate) => {
        /* Since I'm using the date selector, the format of the date will not cause the problem.
        
        Therefore, we just need to validate 2 things:
            1. Date should not be a future date
            2. The 10 year old condition (Pending)
        */
        const dob_object = new Date(givenDate);
        const today_object = new Date()
        const age_difference =  (today_object - dob_object)/ (1000 * 60 * 60 * 24 * 365.25); // Age difeerence in years
        if(age_difference < 0){
            alert("Cannot enter a date in future");
            return false;
        }

        if(age_difference < 10){
            alert("Student must be atleast 10 years old");
            return false;
        }
        return true;
    };

    // Utility function to clear form fields
    const clearForm = () => {
        setDateOfBirth("")
        setFamilyName("")
        setFirstName("")
    }

  return (
    <>
    <div className="section-heading">Please fill the form to add a student</div>
    <form onSubmit={submitForm}>
      <label>
        First Name:
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
      </label>
      <label>
        Family Name:
        <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} required/>
      </label>
      <label>
        Date of Birth:
        <input type="date" value={dateOfBirth} onChange={(e) => {setDateOfBirth(e.target.value)}} required/>
      </label>
      <button type="submit">Submit</button>
    </form>

    {/* Populate the table only if there are available students*/}
    { allStudents ?
        <>
        <div className="section-heading">Current Students</div>
        <table>
            <tr>
                <th>First Name</th>
                <th>Family Name</th>
                <th>Date of Birth</th>
            </tr>
            {allStudents.map((s) => {
                return(
                    <tr>
                        <td>{s.firstName}</td>
                        <td>{s.familyName}</td>
                        <td>{s.dateOfBirth}</td>
                    </tr>
                )
            })}
        </table></>: <h2 id="">No Students</h2> 
    }
    </>
  )
}
