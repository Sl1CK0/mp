import React, { useState } from "react";
import axios from "axios";

const ViewAttendance = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [previousDatesTimes, setPreviousDatesTimes] = useState([]);
  const [error, setError] = useState("");

  const handleViewAttendance = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please provide both username and password");
      return;
    }

    try {
      const data = { username: username, password: password };

      const response = await axios.post("http://localhost:5000/api/view-attendance", data);

      // Debug the response to check the structure
      console.log("Backend response:", response.data);

      if (response.status === 200) {
        const { attendance, previous_dates_times } = response.data;

        // Check if attendance data and previous dates/times are available
        if (attendance) {
          setAttendanceRecords(attendance);
        } else {
          console.log("Attendance data is missing");
          setError("Attendance data missing");
        }

        if (previous_dates_times) {
          setPreviousDatesTimes(previous_dates_times);
        } else {
          console.log("Previous dates and times are missing");
          setPreviousDatesTimes([]);
        }
      } else {
        setError("No attendance records found.");
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError(err.response?.data?.error || "An error occurred while fetching attendance.");
    }
  };

  return (
    <div>
      <h2>View Attendance</h2>

      <form onSubmit={handleViewAttendance}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>

        <button type="submit">View Attendance</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h3>Attendance Records</h3>
        {attendanceRecords.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.name || "Name not available"}</td>
                  <td>{record.rollNo || "Roll number not available"}</td>
                  <td>{record.date || "Date not available"}</td>
                  <td>{record.time || "Time not available"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance records found.</p>
        )}
      </div>


    </div>
  );
};

export default ViewAttendance;






// // import React, { useState } from "react";

// // const ViewAttendance = () => {
// //     const [rollNumber, setRollNumber] = useState("");
// //     const [name, setName] = useState("");
// //     const [attendanceData, setAttendanceData] = useState(null);
// //     const [error, setError] = useState(null);

// //     // Handle form submission
// //     const handleSubmit = async (event) => {
// //         event.preventDefault();

// //         if (!rollNumber && !name) {
// //             alert("Please enter either Roll Number or Name.");
// //             return;
// //         }

// //         // Prepare data to send
// //         const requestData = {
// //             roll_number: rollNumber.trim() ? rollNumber : null,
// //             name: name.trim() ? name : null,
// //         };

// //         try {
// //             // Make POST request to the backend
// //             const response = await fetch("http://localhost:5000/api/view-attendance", {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                 },
// //                 body: JSON.stringify(requestData),
// //             });

// //             const data = await response.json();

// //             // Check if request was successful
// //             if (response.ok) {
// //                 setAttendanceData(data); // Set the fetched data
// //                 setError(null); // Reset any previous errors
// //             } else {
// //                 setError(data.message || "No attendance records found.");
// //                 setAttendanceData(null);
// //             }
// //         } catch (error) {
// //             console.error("Error:", error);
// //             setError("Error fetching attendance. Please try again.");
// //         }
// //     };

// //     return (
// //         <div>
// //             <h2>View Attendance</h2>
// //             <form onSubmit={handleSubmit}>
// //                 <div>
// //                     <label htmlFor="roll-number">Roll Number</label>
// //                     <input
// //                         type="text"
// //                         id="roll-number"
// //                         value={rollNumber}
// //                         onChange={(e) => setRollNumber(e.target.value)}
// //                         placeholder="Enter Roll Number"
// //                     />
// //                 </div>

// //                 <div>
// //                     <label htmlFor="name">Name</label>
// //                     <input
// //                         type="text"
// //                         id="name"
// //                         value={name}
// //                         onChange={(e) => setName(e.target.value)}
// //                         placeholder="Enter Name"
// //                     />
// //                 </div>

// //                 <button type="submit">View Attendance</button>
// //             </form>

// //             {error && <p style={{ color: "red" }}>{error}</p>}

// //             {attendanceData && (
// //                 <div>
// //                     <h3>Attendance Records:</h3>
// //                     <table>
// //                         <thead>
// //                             <tr>
// //                                 <th>Date</th>
// //                                 <th>Time In</th>
// //                                 <th>Status</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {attendanceData.map((record, index) => (
// //                                 <tr key={index}>
// //                                     <td>{record.date}</td>
// //                                     <td>{record.time_in}</td>
// //                                     <td>{record.status}</td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default ViewAttendance;
// import React, { useState } from 'react';

// const ViewAttendance = () => {
//     const [rollNumber, setRollNumber] = useState('');
//     const [name, setName] = useState('');
//     const [attendanceRecords, setAttendanceRecords] = useState([]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Logging the inputs to check if they are correct
//         console.log('Form Submitted');
//         console.log('Roll Number:', rollNumber);
//         console.log('Name:', name);

//         // Prepare the request data, ensuring it's not empty
//         const requestData = {
//             roll_number: rollNumber.trim() ? rollNumber : null,
//             name: name.trim() ? name : null,
//         };

//         // Log the data being sent in the request
//         console.log('Request Data:', requestData);

//         try {
//             // Send POST request to the backend
//             const response = await fetch("http://localhost:5000/api/view-attendance", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(requestData),
//             });

//             const data = await response.json();

//             // Log the response from the server
//             console.log('Server Response:', data);

//             if (response.ok) {
//                 // If records are found, update state
//                 setAttendanceRecords(data.attendance);
//             } else {
//                 // If no records are found, log and set an empty array
//                 console.log('No attendance records found');
//                 setAttendanceRecords([]);
//             }
//         } catch (error) {
//             // Catch any errors and log them
//             console.error('Error fetching attendance data:', error);
//         }
//     };

//     return (
//         <div>
//             <h3>View Attendance</h3>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="rollNumber">Roll Number: </label>
//                     <input
//                         type="text"
//                         id="rollNumber"
//                         value={rollNumber}
//                         onChange={(e) => setRollNumber(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="name">Name: </label>
//                     <input
//                         type="text"
//                         id="name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                     />
//                 </div>
//                 <button type="submit">View Attendance</button>
//             </form>

//             {attendanceRecords && attendanceRecords.length > 0 ? (
//                 <div>
//                     <h4>Attendance Records</h4>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Roll No</th>
//                                 <th>Date</th>
//                                 <th>Time</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {attendanceRecords.map((record, index) => (
//                                 <tr key={index}>
//                                     <td>{record.name}</td>
//                                     <td>{record.rollNo}</td>
//                                     <td>{record.date}</td>
//                                     <td>{record.time}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p>No attendance records found.</p>
//             )}
//         </div>
//     );
// };

// export default ViewAttendance;
