// import React, { useState, useRef } from "react";
// import Webcam from "react-webcam";
// import {
//   registerFace,
//   recognizeFace,
//   getAttendanceReport,
// } from "../api/faceRecognitionAPI";
// import Header from "./Header";

// const FaceRecognition = () => {
//   const webcamRef = useRef(null);
//   const [name, setName] = useState("");
//   const [rollNo, setRollNo] = useState("");
//   const [role, setRole] = useState("");
//   const [result, setResult] = useState(null);
//   const [isRegisterMode, setIsRegisterMode] = useState(true);
//   const [isWebcamActive, setIsWebcamActive] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [attendanceHistory, setAttendanceHistory] = useState([]);
//   const [showReport, setShowReport] = useState(false);

//   const [isWebcamOpen, setIsWebcamOpen] = useState(false);

//   // Capture image from webcam
//   const captureImage = async () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       const blob = await fetch(imageSrc).then((res) => res.blob());
//       return new File([blob], "capture.jpg", { type: "image/jpeg" });
//     }
//     return null;
//   };

//   // Register a new user with captured face
//   const handleRegister = async () => {
//     if (!name || !rollNo || !role) {
//       setError("Please enter all details.");
//       return;
//     }

//     setError(null);
//     setIsWebcamActive(true);
//     setIsRegisterMode(true);
//   };

//   const submitRegistration = async () => {
//     setLoading(true);
//     const imageFile = await captureImage();
//     if (imageFile) {
//       const result = await registerFace(imageFile, name, rollNo, role);
//       if (result.error) {
//         setError(result.error);
//       } else {
//         setIsWebcamActive(false); // Close webcam immediately after successful registration
//         setLoading(false); // Stop loading spinner immediately
//         setName("");
//         setRollNo("");
//         setRole("");

//         // Add a small delay to ensure webcam closes before showing the alert
//         setTimeout(() => {
//           alert(result.message || "Registration successful");
//         }, 500);
//       }
//     } else {
//       setLoading(false);
//     }
//   };

//   // Recognize an existing user
//   const handleRecognize = async () => {
//     setIsWebcamActive(true);
//     setIsRegisterMode(false);
//   };

//   const submitRecognition = async () => {
//     setLoading(true);
//     const imageFile = await captureImage();
//     if (imageFile) {
//       const result = await recognizeFace(imageFile);
//       if (result.error) {
//         setError(result.error);
//       } else {
//         setResult(result);
//       }
//     }
//     setLoading(false);
//     setIsWebcamActive(false);
//   };

//   return (
//     <div>
//       <Header />

//       <h2>{isRegisterMode ? "Register Your Face" : "Mark Attendance"}</h2>

//       {isRegisterMode ? (
//         <>
//           <input
//             type="text"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Roll No"
//             value={rollNo}
//             onChange={(e) => setRollNo(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Role"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           />
//           <button onClick={handleRegister}>Register Face</button>
//         </>
//       ) : (
//         <button onClick={handleRecognize}>Mark Attendance</button>
//       )}

//       <button onClick={() => setIsRegisterMode(!isRegisterMode)}>
//         {isRegisterMode
//           ? "Switch to Attendance Mode"
//           : "Switch to Registration Mode"}
//       </button>

//       {isWebcamActive && (
//         <div>
//           <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
//           {isRegisterMode ? (
//             <button onClick={submitRegistration} disabled={loading}>
//               {loading ? "Registering..." : "Capture & Register"}
//             </button>
//           ) : (
//             <button onClick={submitRecognition} disabled={loading}>
//               {loading ? "Recognizing..." : "Capture & Mark Attendance"}
//             </button>
//           )}
//         </div>
//       )}

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {result && (
//         <div>
//           <h3>Recognition Result</h3>
//           <p>{result.message}</p>
//           <p>{`Name: ${result.name || "Unknown"}, Role: ${
//             result.role || "Unknown"
//           }`}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FaceRecognition;
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { registerFace, recognizeFace, markAttendance } from "../api/faceRecognitionAPI";
import Header from "./Header";
import ViewAttendance from "./ViewAttendance";
import MarkAttendance from "./MarkAttendance/MarkAttendance";

const FaceRecognition = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState(""); // New field for username
  const [password, setPassword] = useState(""); // New field for password
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(true); // Switch between Register and Mark Attendance
  const [previousDatesTimes, setPreviousDatesTimes] = useState([]);

  // Capture image from webcam
  const captureImage = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = await fetch(imageSrc).then((res) => res.blob());
      return new File([blob], "capture.jpg", { type: "image/jpeg" });
    }
    return null;
  };

  // Handle registration (Capture face and info)
  const handleRegister = () => {
    if (!name || !rollNo || !role || !username || !password) {
      setError("Please enter all details.");
      return;
    }
    setError(null);
    setIsWebcamActive(true);
    setIsRegisterMode(true);
  };

  // Submit registration (Upload user info and captured image)
  const submitRegistration = async () => {
    setLoading(true);
    const imageFile = await captureImage();
    if (imageFile) {
      const result = await registerFace(imageFile, name, rollNo, role, username, password);
      if (result.error) {
        setError(result.error);
      } else {
        setLoading(false);
        setIsWebcamActive(false); // Close webcam after registration
        setName("");
        setRollNo("");
        setRole("");
        setUsername(""); // Clear username
        setPassword(""); // Clear password
        setTimeout(() => {
          alert(result.message || "Registration successful!");
        }, 500);
      }
    } else {
      setLoading(false);
      setError("Failed to capture image.");
    }
  };

  // Handle attendance recognition
  const handleRecognize = () => {
    setIsWebcamActive(true);
    setIsRegisterMode(false);
  };

  // Submit face recognition for attendance
  const submitRecognition = async () => {
    setLoading(true);
    const imageFile = await captureImage();
    if (imageFile) {
      const result = await recognizeFace(imageFile, username, password); // Pass username and password
      if (result.error) {
        setError(result.error);
      } else {
        setResult(result);
        setPreviousDatesTimes(result.previous_dates_times || []);
      }
    }
    setLoading(false);
    setIsWebcamActive(false);
  };

  return (
    <div>
      <Header />
      <h2>{isRegisterMode ? "Register Your Face" : "Mark Attendance"}</h2>

      {isRegisterMode ? (
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Roll No"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register Face</button>
        </div>
      ) : (
        <button onClick={handleRecognize}>Mark Attendance</button>
      )}
      <button onClick={() => setIsRegisterMode(!isRegisterMode)}>
        {isRegisterMode
          ? "Switch to Attendance Mode"
          : "Switch to Registration Mode"}
      </button>
<MarkAttendance> </MarkAttendance>
      <ViewAttendance>view attendance man</ViewAttendance>

      {isWebcamActive && (
        <div>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          {isRegisterMode ? (
            <button onClick={submitRegistration} disabled={loading}>
              {loading ? "Registering..." : "Capture & Register"}
            </button>
          ) : (
            <button onClick={submitRecognition} disabled={loading}>
              {loading ? "Recognizing..." : "Capture & Mark Attendance"}
            </button>
          )}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3>Recognition Result</h3>
          <p>{result.message}</p>
          <p>{`Name: ${result.name || "Unknown"}, Role: ${
            result.role || "Unknown"
          }`}</p>

          {previousDatesTimes.length > 0 && (
            <div>
              <h4>Previous Attendance Records</h4>
              <ul>
                {previousDatesTimes.map((record, index) => (
                  <li key={index}>{`Date: ${record.date}, Time: ${record.time}`}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
