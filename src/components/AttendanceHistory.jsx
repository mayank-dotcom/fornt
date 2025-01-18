// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AttendanceHistory = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filterDate, setFilterDate] = useState("");
//   const [newAttendance, setNewAttendance] = useState({
//     date: "",
//     clockIn: "",
//     report: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
//   const username = decodedToken?.username;

//   const config = {
//     headers: { Authorization: `Bearer ${token}` },
//   };

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     console.log("Current token:", token);
//     try {
//       const decoded = JSON.parse(atob(token.split(".")[1]));
//       console.log("Decoded token:", decoded);
//       if (decoded.username) {
//         fetchAttendanceData();
//       }
//     } catch (error) {
//       console.error("Token decoding error:", error);
//       setError("Authentication error. Please login again.");
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   const fetchAttendanceData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         "https://back-ajnk.onrender.com/attendance",
//         config
//       );
//       console.log("Attendance data:", response.data);
//       setAttendanceData(response.data);
//       setFilteredData(response.data);
//       setError(null);
//     } catch (err) {
//       console.error("Error details:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         headers: err.response?.headers,
//       });

//       if (err.response?.status === 401) {
//         setError("Your session has expired. Please login again.");
//         navigate("/login");
//       } else {
//         setError("Failed to fetch attendance data. Please try again later.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateTimeOptions = () => {
//     const options = [];
//     for (let h = 0; h <= 8; h++) {
//       for (let m = 0; m < 60; m += 15) {
//         // Increment by 15 minutes
//         const hour = h.toString().padStart(2, "0");
//         const minute = m.toString().padStart(2, "0");
//         options.push(
//           <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
//             {hour}:{minute}
//           </option>
//         );
//       }
//     }
//     return options;
//   };

//   const handleNewAttendanceChange = (field, value) => {
//     setNewAttendance({ ...newAttendance, [field]: value });
//   };

//   const handleTimeChange = (index, field, value) => {
//     const updatedData = [...attendanceData];
//     updatedData[index][field] = value;
//     setAttendanceData(updatedData);

//     if (filterDate) {
//       const updatedFiltered = updatedData.filter((row) => {
//         const recordDate = new Date(row.date).toISOString().split("T")[0];
//         return recordDate === filterDate;
//       });
//       setFilteredData(updatedFiltered);
//     } else {
//       setFilteredData(updatedData);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!username) {
//       setError("User not authenticated");
//       return;
//     }

//     const { date, clockIn, report } = newAttendance;

//     if (date && clockIn && report) {
//       const formattedDate = new Date(date).toLocaleDateString("en-CA");
//       const todayDate = new Date().toLocaleDateString("en-CA");

//       console.log("Formatted Date (Local):", formattedDate);
//       console.log("Today's Date (Local):", todayDate);

//       if (formattedDate === todayDate) {
//         try {
//           const response = await axios.post(
//             "https://back-ajnk.onrender.com/attendance/new",
//             {
//               date: formattedDate,
//               clockIn: clockIn,
//               report: report,
//             },
//             config
//           );

//           console.log("Attendance submission response:", response.data);
//           setNewAttendance({ date: "", clockIn: "", report: "" });
//           await fetchAttendanceData();
//           alert("Attendance submitted successfully!");
//         } catch (err) {
//           console.error("Error adding new attendance:", err);
//           setError(
//             "Failed to submit attendance: " +
//               (err.response?.data?.message || err.message)
//           );
//         }
//       } else {
//         alert(
//           `You can only mark attendance for today.\nSelected Date: ${formattedDate}\nToday's Date: ${todayDate}`
//         );
//       }
//     } else {
//       let missingFields = [];
//       if (!date) missingFields.push("Date");
//       if (!clockIn) missingFields.push("Time");
//       if (!report) missingFields.push("Report");

//       alert(`Please fill in all required fields: ${missingFields.join(", ")}.`);
//     }
//   };

//   const handleEditSubmit = async (rowId, rowData) => {
//     try {
//       await axios.put(
//         "https://back-ajnk.onrender.com/attendance/update",
//         {
//           id: rowId,
//           clockIn: rowData.IN,
//           report: rowData.report,
//         },
//         config
//       );

//       await fetchAttendanceData();
//       alert("Changes saved successfully!");
//     } catch (err) {
//       console.error("Error updating attendance:", err);
//       setError("Failed to update attendance");
//     }
//   };

//   const isEditable = (date) => {
//     const recordDate = new Date(date).toISOString().split("T")[0];
//     const todayDate = new Date().toISOString().split("T")[0];

//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     const yesterdayDate = yesterday.toISOString().split("T")[0];

//     return recordDate === todayDate || recordDate === yesterdayDate;
//   };

//   const handleFilterDateChange = (e) => {
//     setFilterDate(e.target.value);
//     if (e.target.value) {
//       const filtered = attendanceData.filter((row) => {
//         const recordDate = new Date(row.date).toISOString().split("T")[0];
//         return recordDate === e.target.value;
//       });
//       setFilteredData(filtered);
//     } else {
//       setFilteredData(attendanceData);
//     }
//   };

//   // const formatDateToIST = (dateString) => {
//   //   const date = new Date(dateString);
//   //   return date.toLocaleDateString('en-IN', {
//   //     timeZone: 'Asia/Kolkata',
//   //     year: 'numeric',
//   //     month: '2-digit',
//   //     day: '2-digit'
//   //   });
//   // };

//   const formatDateToIST = (dateString) => {
//     const date = new Date(dateString);
//     // Subtract 5 hours and 30 minutes to adjust for IST
//     date.setHours(date.getHours() - 5);
//     date.setMinutes(date.getMinutes() - 30);
//     return date.toLocaleDateString();
//   };

//   if (loading) {
//     return <div className="container mt-5">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mt-5">
//         <div className="alert alert-danger">{error}</div>
//       </div>
//     );
//   }

//   if (!username) {
//     return (
//       <div className="container mt-5">
//         Please log in to view attendance history.
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Attendance History for {username}</h2>

//       <div className="card mb-4">
//         <div className="card-header">
//           <h4>Mark Attendance</h4>
//         </div>
//         <div className="card-body">
//           <div className="mb-3">
//             <label className="form-label">Date:</label>
//             <input
//               type="date"
//               className="form-control"
//               value={newAttendance.date}
//               onChange={(e) =>
//                 handleNewAttendanceChange("date", e.target.value)
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Duration:</label>
//             <select
//               type="time"
//               step="60"
//               max="08:00"
//               className="form-control"
//               value={newAttendance.clockIn}
//               onChange={(e) =>
//                 handleNewAttendanceChange("clockIn", e.target.value)
//               }
//             >
//               {" "}
//               {generateTimeOptions()}
//             </select>
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Report:</label>
//             <textarea
//               className="form-control"
//               value={newAttendance.report}
//               onChange={(e) =>
//                 handleNewAttendanceChange("report", e.target.value)
//               }
//               placeholder="Enter your daily report"
//               rows="3"
//             />
//           </div>
//           <button
//             className="btn btn-primary"
//             onClick={handleSubmit()}
//             // disabled={!newAttendance.date || !newAttendance.clockIn}
//           >
//             Submit Attendance
//           </button>
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header d-flex justify-content-between align-items-center">
//           <h4>Attendance Records</h4>
//           <div className="w-25">
//             <label className="form-label">Filter by Date:</label>
//             <input
//               type="date"
//               className="form-control"
//               value={filterDate}
//               onChange={handleFilterDateChange}
//             />
//           </div>
//         </div>
//         <div className="card-body">
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover">
//               <thead className="table-light">
//                 <tr>
//                   <th>Date</th>
//                   <th>Day</th>
//                   <th>Duration</th>
//                   <th>Report</th>
//                   <th>Verification Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((row, index) => (
//                   <tr key={index}>
//                     <td>
//                       <div className="d-flex align-items-start">
//                         {formatDateToIST(row.date)}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="d-flex align-items-start">{row.day}</div>
//                     </td>
//                     <td>
//                       <div className="d-flex align-items-start">
//                         <select
//                           className="form-control"
//                           value={row.IN || ""}
//                           disabled={!isEditable(row.date)}
//                           onChange={(e) =>
//                             handleTimeChange(index, "IN", e.target.value)
//                           }
//                         >
//                           {generateTimeOptions()}
//                         </select>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="d-flex align-items-start">
//                         <textarea
//                           value={row.report || ""}
//                           disabled={!isEditable(row.date)}
//                           onChange={(e) => {
//                             handleTimeChange(index, "report", e.target.value);
//                             e.target.style.height = "auto";
//                             e.target.style.height = `${e.target.scrollHeight}px`;
//                           }}
//                           placeholder="Enter report"
//                           className="form-control"
//                           style={{ overflow: "hidden", maxHeight: "200px" }}
//                           rows="1"
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       <div className="d-flex align-items-start justify-content-center">
//                         <span
//                           className={`badge ${
//                             row.verification === "pending"
//                               ? "bg-warning"
//                               : "bg-success"
//                           }`}
//                           style={{
//                             padding: "7px 20px",
//                             fontWeight: 300,
//                             fontSize: "1em",
//                           }} // Adjust padding and font size
//                         >
//                           {row.verification || "Pending"}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="d-flex align-items-start">
//                         {isEditable(row.date) && (
//                           <button
//                             className="btn btn-primary btn-sm"
//                             onClick={() => handleEditSubmit(row._id, row)}
//                           >
//                             Save Changes
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredData.length === 0 && (
//                   <tr>
//                     <td colSpan="6" className="text-center">
//                       No attendance records found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceHistory;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AttendanceForm = () => {
  const [newAttendance, setNewAttendance] = useState({
    date: "",
    clockIn: "",
    report: "",
  });
  const [filterDate, setFilterDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const username = decodedToken?.username;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    console.log("Current token:", token);
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded token:", decoded);
      if (decoded.username) {
        fetchAttendanceData();
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      setError("Authentication error. Please login again.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleNewAttendanceChange = (field, value) => {
    setNewAttendance((prev) => ({ ...prev, [field]: value }));
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://back-ajnk.onrender.com/attendance",
        config
      );
      console.log("Attendance data:", response.data);
      setAttendanceData(response.data);
      setFilteredData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error details:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
      });

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        navigate("/login");
      } else {
        setError("Failed to fetch attendance data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h <= 8; h++) {
      for (let m = 0; m < 60; m += 15) {
        // Increment by 15 minutes
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        options.push(
          <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
            {hour}:{minute}
          </option>
        );
      }
    }
    return options;
  };

  const handleTimeChange = (index, field, value) => {
    const updatedData = [...attendanceData];
    updatedData[index][field] = value;
    setAttendanceData(updatedData);

    if (filterDate) {
      const updatedFiltered = updatedData.filter((row) => {
        const recordDate = new Date(row.date).toISOString().split("T")[0];
        return recordDate === filterDate;
      });
      setFilteredData(updatedFiltered);
    } else {
      setFilteredData(updatedData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Reset previous errors
    setError("");

    // Check for user authentication
    if (!username) {
      setError("User not authenticated. Please Login");
      return;
    }

    // Destructure fields from newAttendance for easier access
    const { date, clockIn, report } = newAttendance;

    // Validate that all required fields are filled
    if (date && clockIn && report) {
      const formattedDate = new Date(date).toLocaleDateString("en-CA");
      const todayDate = new Date().toLocaleDateString("en-CA");

      console.log("Formatted Date (Local):", formattedDate);
      console.log("Today's Date (Local):", todayDate);

      // Ensure the attendance is marked for today
      if (formattedDate === todayDate) {
        try {
          const response = await axios.post(
            "https://back-ajnk.onrender.com/attendance/new",
            {
              date: formattedDate,
              clockIn: clockIn,
              report: report,
            },
            config
          );

          console.log("Attendance submission response:", response.data);

          // Reset the form fields
          setNewAttendance({ date: "", clockIn: "", report: "" });

          // Fetch updated attendance data
          await fetchAttendanceData();

          alert("Attendance submitted successfully!");
        } catch (err) {
          console.error("Error adding new attendance:", err);
          setError(
            "Failed to submit attendance: " +
              (err.response?.data?.message || err.message)
          );
        }
      } else {
        setError(
          `You can only mark attendance for today.\nSelected Date: ${formattedDate}\nToday's Date: ${todayDate}`
        );
      }
    } else {
      // Identify which fields are missing
      let missingFields = [];
      if (!date) missingFields.push("Date");
      if (!clockIn) missingFields.push("Time");
      if (!report) missingFields.push("Report");

      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}.`
      );
    }
  };

  const handleEditSubmit = async (rowId, rowData) => {
    try {
      await axios.put(
        "https://back-ajnk.onrender.com/attendance/update",
        {
          id: rowId,
          clockIn: rowData.IN,
          report: rowData.report,
        },
        config
      );

      await fetchAttendanceData();
      alert("Changes saved successfully!");
    } catch (err) {
      console.error("Error updating attendance:", err);
      setError("Failed to update attendance");
    }
  };

  const isEditable = (date) => {
    const recordDate = new Date(date).toISOString().split("T")[0];
    const todayDate = new Date().toISOString().split("T")[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];

    return recordDate === todayDate || recordDate === yesterdayDate;
  };

  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
    if (e.target.value) {
      const filtered = attendanceData.filter((row) => {
        const recordDate = new Date(row.date).toISOString().split("T")[0];
        return recordDate === e.target.value;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(attendanceData);
    }
  };

  const formatDateToIST = (dateString) => {
    const date = new Date(dateString);
    // Subtract 5 hours and 30 minutes to adjust for IST
    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="container mt-5">
        Please log in to view attendance history.
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-4">Attendance History for {username}</h2>
      <div className="card mb-4">
        <div className="card-header">
          <h4>Mark Attendance</h4>
        </div>

        <form onSubmit={handleSubmit} className="card-body">
          {/* Date Input */}
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date:
            </label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={newAttendance.date}
              required
              onChange={(e) =>
                handleNewAttendanceChange("date", e.target.value)
              }
            />
          </div>

          {/* Clock-In Time Input */}
          <div className="mb-3">
            <label htmlFor="clockIn" className="form-label">
              Duration:
            </label>
            <select
              type="time"
              step="60"
              max="08:00"
              id="clockIn"
              className="form-control"
              value={newAttendance.clockIn}
              required
              onChange={(e) =>
                handleNewAttendanceChange("clockIn", e.target.value)
              }
            >
              {" "}
              {generateTimeOptions()}
            </select>
          </div>

          {/* Report Textarea */}
          <div className="mb-3">
            <label htmlFor="report" className="form-label">
              Report:
            </label>
            <textarea
              id="report"
              className="form-control"
              value={newAttendance.report}
              required
              onChange={(e) => {
                handleNewAttendanceChange("report", e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="Enter your daily report"
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>Attendance Records</h4>
          <div className="w-25">
            <label className="form-label">Filter by Date:</label>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={handleFilterDateChange}
            />
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Duration</th>
                <th>Report</th>
                <th>Verification Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-start">
                      {formatDateToIST(row.date)}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-start">{row.day}</div>
                  </td>
                  <td>
                    <div className="d-flex align-items-start">
                      <select
                        className="form-control"
                        value={row.IN || ""}
                        disabled={!isEditable(row.date)}
                        style={{ width: "65px", margin: "0 auto" }}
                        onChange={(e) =>
                          handleTimeChange(index, "IN", e.target.value)
                        }
                      >
                        {generateTimeOptions()}
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-start">
                      <textarea
                        value={row.report || ""}
                        disabled={!isEditable(row.date)}
                        onChange={(e) => {
                          handleTimeChange(index, "report", e.target.value);
                          e.target.style.height = "auto";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        placeholder="Enter report"
                        className="form-control"
                        style={{resize: "vertical", width: "200px", margin: "0 auto", scrollBehavior:"auto"}}
                        row={1}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-start justify-content-center">
                      <span
                        className={`badge ${
                          row.verification === "pending"
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        style={{
                          padding: "7px 20px",
                          fontWeight: 300,
                          fontSize: "1em",
                        }} // Adjust padding and font size
                      >
                        {row.verification || "Pending"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-start">
                      {isEditable(row.date) && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditSubmit(row._id, row)}
                        >
                          Save Changes
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AttendanceForm;
