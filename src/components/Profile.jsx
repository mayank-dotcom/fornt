// import React from "react";

// function Profile() {
//   const username = localStorage.getItem("username") || "John Doe";

//   return (
//     <div className="card h-100">
//       <div className="card-body d-flex flex-column justify-content-between">
//         <h2 className="card-title h5 mb-4">Intern Profile</h2>
//         <div className="d-flex align-items-center">
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
      
      // Filter attendance data for the current user
      const userAttendance = response.data.filter(record => record.name === username);
      setAttendanceData(userAttendance);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

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
                  <th>Clock In</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.day}</td>
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
        </div>
      </div>
    </div>
  );
}

export default Profile;