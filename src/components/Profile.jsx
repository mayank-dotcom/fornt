
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function Profile() {
//   const username = localStorage.getItem("username") || "John Doe";
//   const [attendanceData, setAttendanceData] = useState([]);

//   useEffect(() => {
//     fetchAttendanceData();
//   }, []);

//   const fetchAttendanceData = async () => {
//     try {
//       const response = await axios.get("https://back-ajnk.onrender.com/attendance", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
      
//       // Filter attendance data for the current user
//       const userAttendance = response.data.filter(record => record.name === username);
//       setAttendanceData(userAttendance);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//     }
//   };

//   // Calculate total verified hours
//   const totalVerifiedDuration = attendanceData
//     .filter(record => record.verification === 'verified')
//     .reduce((total, record) => total + parseInt(record.IN || 0, 10), 0);

//   // Progress bar value
//   const progress = (totalVerifiedDuration / 116) * 100;

//   return (
//     <div className="card h-100">
//       <div className="card-body d-flex flex-column">
//         <h2 className="card-title h5 mb-4">Intern Profile</h2>
//         <div className="d-flex align-items-center mb-3">
//           <img
//             src="/placeholder.svg?height=80&width=80"
//             alt="Intern"
//             className="rounded-circle me-3"
//             style={{ height: "80px", width: "80px" }}
//           />
//           <div>
//             <h3 className="h6 mb-1">{username}</h3>
//           </div>
//         </div>
        
//         {/* Attendance Records Section */}
//         <div className="mt-3">
//           <h4 className="h6 mb-3">Attendance Records</h4>
//           {attendanceData.length > 0 ? (
//             <table className="table table-sm table-striped">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Day</th>
//                   <th>Duration</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendanceData.map((record) => (
//                   <tr key={record._id}>
//                     <td>{new Date(record.date).toLocaleDateString()}</td>
//                     <td>{record.day}</td>
//                     <td>{record.IN}</td>
//                     <td>
//                       <span 
//                         className={`badge ${
//                           record.verification === 'verified' 
//                             ? 'bg-success' 
//                             : 'bg-warning text-dark'
//                         }`}
//                       >
//                         {record.verification}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-muted">No attendance records found.</p>
//           )}

//           {/* Progress Bar Section */}
//           <div className="mt-4">
//             <h5 className="mb-2">Progress towards 116 hours</h5>
//             <div className="progress">
//               <div
//                 className="progress-bar"
//                 role="progressbar"
//                 style={{ width: `${progress}%` }}
//                 aria-valuenow={progress}
//                 aria-valuemin="0"
//                 aria-valuemax="100"
//               >
//                 {Math.round(progress)}%
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;
import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const username = localStorage.getItem("username") || "John Doe";
  const [attendanceData, setAttendanceData] = useState([]);

  // Function to adjust time by subtracting 5:30 hours
  const getAdjustedDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() - (5 * 60 * 60 * 1000) - (30 * 60 * 1000));
  };

  // Function to format adjusted date to locale string
  const formatAdjustedDate = (dateString) => {
    const adjustedDate = getAdjustedDate(dateString);
    return adjustedDate.toLocaleDateString();
  };

  // Function to get adjusted day
  const getAdjustedDay = (dateString) => {
    const adjustedDate = getAdjustedDate(dateString);
    return adjustedDate.toLocaleDateString('en-US', { weekday: 'long' });
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get("https://back-ajnk.onrender.com/attendance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Filter attendance data for the current user and adjust dates
      const userAttendance = response.data
        .filter(record => record.name === username)
        .map(record => ({
          ...record,
          adjustedDate: formatAdjustedDate(record.date),
          adjustedDay: getAdjustedDay(record.date)
        }));

      setAttendanceData(userAttendance);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Calculate total verified hours
  const totalVerifiedDuration = attendanceData
    .filter(record => record.verification === 'verified')
    .reduce((total, record) => total + parseInt(record.IN || 0, 10), 0);

  // Progress bar value
  const progress = (totalVerifiedDuration / 116) * 100;

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h2 className="card-title h5 mb-4">Intern Profile</h2>
        <div className="d-flex align-items-center mb-3">
          <img
            src="/placeholder.svg?height=80&width=80"
            alt="Intern"
            className="rounded-circle me-3"
            style={{ height: "80px", width: "80px" }}
          />
          <div>
            <h3 className="h6 mb-1">{username}</h3>
          </div>
        </div>
        
        {/* Attendance Records Section */}
        <div className="mt-3">
          <h4 className="h6 mb-3">Attendance Records</h4>
          {attendanceData.length > 0 ? (
            <table className="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record._id}>
                    <td>{record.adjustedDate}</td>
                    <td>{record.adjustedDay}</td>
                    <td>{record.IN}</td>
                    <td>
                      <span 
                        className={`badge ${
                          record.verification === 'verified' 
                            ? 'bg-success' 
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {record.verification}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted">No attendance records found.</p>
          )}

          {/* Progress Bar Section */}
          <div className="mt-4">
            <h5 className="mb-2">Progress towards 116 hours</h5>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;