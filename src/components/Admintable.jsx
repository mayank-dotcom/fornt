// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Header";
// import { Link } from "react-router-dom";

// function Admintable() {
//   // State management
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filter states
//   const [nameFilter, setNameFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   // Edit form state
//   const [editForm, setEditForm] = useState({
//     date: "",
//     day: "",
//     IN: "",
//     report: "",
//     verification: ""
//   });

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchAttendanceData();
//   }, []);

//   // Filter effect
//   useEffect(() => {
//     filterData();
//   }, [attendanceData, nameFilter, startDate]);

//   // Data fetching function
//   const fetchAttendanceData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("https://back-ajnk.onrender.com/attendance", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setAttendanceData(response.data);
//       setFilteredData(response.data);
//       setError(null);
//     } catch (err) {
//       setError("Failed to fetch attendance data. Please try again later.");
//       console.error("Error fetching attendance data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter function
//   const filterData = () => {
//     let filtered = [...attendanceData];

//     // Apply name filter
//     if (nameFilter) {
//       filtered = filtered.filter(record =>
//         record.name.toLowerCase().includes(nameFilter.toLowerCase())
//       );
//     }

//     // Apply date filter
//     if (startDate) {
//       const filterStartDate = new Date(startDate);
//       filterStartDate.setHours(0, 0, 0, 0);

//       filtered = filtered.filter(record => {
//         const recordDate = new Date(record.date);
//         return recordDate >= filterStartDate;
//       });
//     }

//     setFilteredData(filtered);
//   };

//   const clearFilters = () => {
//     setNameFilter("");
//     setStartDate("");
//   };

//   // Edit handlers
//   const handleEdit = (record) => {
//     setEditingId(record._id);
//     setEditForm({
//       date: new Date(record.date).toISOString().split('T')[0],
//       day: record.day,
//       IN: record.IN || "",
//       report: record.report || "",
//       verification: record.verification
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditForm({
//       date: "",
//       day: "",
//       IN: "",
//       report: "",
//       verification: ""
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     // Update day automatically when date changes
//     if (name === "date") {
//       const newDate = new Date(value);
//       const day = newDate.toLocaleString("en-US", { weekday: "long" });
//       setEditForm(prev => ({
//         ...prev,
//         day: day
//       }));
//     }
//   };

//   // Update handler
//   const handleUpdate = async (id) => {
//     try {
//       const response = await axios.put(
//         "https://back-ajnk.onrender.com/attendance/update",
//         {
//           id,
//           date: editForm.date,
//           clockIn: editForm.IN,
//           report: editForm.report,
//           verification: editForm.verification
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         setEditingId(null);
//         await fetchAttendanceData();
//       }
//     } catch (error) {
//       console.error("Error updating record:", error);
//       alert("Failed to update record. Please try again.");
//     }
//   };

//   // Delete handler
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this record?")) {
//       try {
//         await axios.delete(`https://back-ajnk.onrender.com/delete-record/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         setAttendanceData(prevData =>
//           prevData.filter((record) => record._id !== id)
//         );
//       } catch (error) {
//         console.error("Error deleting record:", error);
//         alert("Failed to delete record. Please try again.");
//       }
//     }
//   };

//   // Verify handler
//   const handleVerify = async (id) => {
//     try {
//       await axios.put(
//         "https://back-ajnk.onrender.com/attendance/update",
//         { id, verification: "verified" },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setAttendanceData(prevData =>
//         prevData.map((record) =>
//           record._id === id ? { ...record, verification: "verified" } : record
//         )
//       );
//     } catch (error) {
//       console.error("Error verifying record:", error);
//       alert("Failed to verify record. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-vh-100 d-flex justify-content-center align-items-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-vh-100 d-flex justify-content-center align-items-center">
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-vh-100 bg-light d-flex flex-column">
//       <Header />
//       <div className="container-fluid py-4">
//         {/* Top Section */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h2 className="mb-0">Attendance Management</h2>
//           <Link to="/Insert" className="btn btn-primary shadow-sm">
//             <i className="bi bi-plus-lg me-2"></i>Add New Record
//           </Link>
//         </div>

//         {/* Filter Section */}
//         <div className="card shadow-sm border-0 mb-4">
//           <div className="card-body">
//             <h5 className="card-title mb-3">Filters</h5>
//             <div className="row g-3">
//               <div className="col-md-4">
//                 <label className="form-label">Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Filter by name..."
//                   value={nameFilter}
//                   onChange={(e) => setNameFilter(e.target.value)}
//                 />
//               </div>
//               <div className="col-md-4">
//                 <label className="form-label">Start Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </div>
//               <div className="col-md-4 d-flex align-items-end">
//                 <button
//                   className="btn btn-outline-secondary"
//                   onClick={clearFilters}
//                 >
//                   <i className="bi bi-x-circle me-2"></i>Clear Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Results count */}
//         <div className="mb-3 text-muted">
//           Showing {filteredData.length} of {attendanceData.length} records
//         </div>

//         {/* Table Section */}
//         <div className="card shadow-lg border-0">
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead className="table-dark">
//                   <tr>
//                     <th>Name</th>
//                     <th>Date</th>
//                     <th>Day</th>
//                     <th>Duration</th>
//                     <th>Verification Status</th>
//                     <th>Report</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     filteredData.map((record) => (
//                       <tr key={record._id}>
//                         <td>{record.name}</td>
//                         <td>
//                           {editingId === record._id ? (
//                             <input
//                               type="date"
//                               className="form-control form-control-sm"
//                               name="date"
//                               value={editForm.date}
//                               onChange={handleInputChange}
//                             />
//                           ) : (
//                             new Date(record.date).toLocaleDateString()
//                           )}
//                         </td>
//                         <td>
//                           {editingId === record._id ? (
//                             <input
//                               type="text"
//                               className="form-control form-control-sm"
//                               name="day"
//                               value={editForm.day}
//                               onChange={handleInputChange}
//                               disabled
//                             />
//                           ) : (
//                             record.day
//                           )}
//                         </td>
//                         <td>
//                           {editingId === record._id ? (
//                             <input
//                               type="text"
//                               className="form-control form-control-sm"
//                               name="IN"
//                               value={editForm.IN}
//                               onChange={handleInputChange}
//                             />
//                           ) : (
//                             record.IN || "N/A"
//                           )}
//                         </td>
//                         <td>
//                           {editingId === record._id ? (
//                             <select
//                               className="form-select form-select-sm"
//                               name="verification"
//                               value={editForm.verification}
//                               onChange={handleInputChange}
//                             >
//                               <option value="pending">Pending</option>
//                               <option value="verified">Verified</option>
//                             </select>
//                           ) : (
//                             <span
//                               className={`badge rounded-pill ${
//                                 record.verification === "verified"
//                                   ? "bg-success"
//                                   : "bg-warning text-dark"
//                               }`}
//                             >
//                               {record.verification}
//                             </span>
//                           )}
//                         </td>
//                         <td>
//                           {editingId === record._id ? (
//                             <input
//                               type="text"
//                               className="form-control form-control-sm"
//                               name="report"
//                               value={editForm.report}
//                               onChange={handleInputChange}
//                             />
//                           ) : (
//                             record.report
//                           )}
//                         </td>
//                         <td>
//                           {editingId === record._id ? (
//                             <div className="btn-group btn-group-sm">
//                               <button
//                                 className="btn btn-success"
//                                 onClick={() => handleUpdate(record._id)}
//                               >
//                                 <i className="bi bi-check"></i> Save
//                               </button>
//                               <button
//                                 className="btn btn-secondary"
//                                 onClick={handleCancelEdit}
//                               >
//                                 <i className="bi bi-x"></i> Cancel
//                               </button>
//                             </div>
//                           ) : (
//                             <div className="btn-group btn-group-sm">
//                               <button
//                                 className="btn btn-outline-primary"
//                                 onClick={() => handleEdit(record)}
//                                 title="Edit"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 className="btn btn-outline-danger"
//                                 onClick={() => handleDelete(record._id)}
//                                 title="Delete"
//                               >
//                                 Delete
//                               </button>
//                               {record.verification === "pending" && (
//                                 <button
//                                   className="btn btn-outline-success"
//                                   onClick={() => handleVerify(record._id)}
//                                   title="Verify"
//                                 >
//                                   Verify
//                                 </button>
//                               )}
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="text-center text-muted py-4">
//                         <i className="bi bi-inbox fs-4 d-block mb-2"></i>
//                         No matching records found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Admintable;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { Link } from "react-router-dom";
import "./Css/Admintable.css";
// import { createLogger } from "vite";

function Admintable() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [editForm, setEditForm] = useState({
    date: "",
    day: "",
    IN: "",
    report: "",
    verified_report: "",
    verification: "",
  });
  const [showPopup_report, setShowPopup_report] = useState(false);
  const [showPopup_verifiedreport, setShowPopup_verifiedreport] = useState(false);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    filterData();
  }, [attendanceData, nameFilter, startDate]);

  useEffect(() => {
    // Function to prevent scrolling
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation(); // Stop event bubbling
      return false;
    };

    if (showPopup_report || showPopup_verifiedreport) {
      // Add event listeners to prevent scrolling
      window.addEventListener("wheel", preventScroll, { passive: false }); // Modern browsers
      window.addEventListener("touchmove", preventScroll, { passive: false }); // For touch devices
      document.body.style.overflow = "hidden"; // fallback for some cases
    } else {
      // Remove event listeners
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.body.style.overflow = "unset";
    }

    // Cleanup function to remove listeners when component unmounts or state changes
    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.body.style.overflow = "unset";
    };
  }, [showPopup_report, showPopup_verifiedreport]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://back-ajnk.onrender.com/attendance",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAttendanceData(response.data);
      setFilteredData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch attendance data. Please try again later.");
      console.error("Error fetching attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...attendanceData];

    if (nameFilter) {
      filtered = filtered.filter((record) =>
        record.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (startDate) {
      const filterStartDate = new Date(startDate);
      filterStartDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= filterStartDate;
      });
    }

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setNameFilter("");
    setStartDate("");
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    const date_value = record.date.split("T")[0];

    setEditForm({
      date: date_value,
      day: record.day,
      IN: record.IN || "",
      report: record.report || "",
      verified_report: record.verified_report || "",
      verification: record.verification,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      date: "",
      day: "",
      IN: "",
      report: "",
      verified_report: "",
      verification: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "date") {
      const newDate = new Date(value);
      const day = newDate.toLocaleString("en-US", { weekday: "long" });
      setEditForm((prev) => ({
        ...prev,
        day: day,
      }));
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(
        "https://back-ajnk.onrender.com/attendance/update",
        {
          id,
          date: editForm.date,
          clockIn: editForm.IN,
          report: editForm.report,
          verified_report: editForm.verified_report,
          verification: editForm.verification,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setEditingId(null);
        await fetchAttendanceData();
      }
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update record. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(
          `https://back-ajnk.onrender.com/delete-record/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setAttendanceData((prevData) =>
          prevData.filter((record) => record._id !== id)
        );
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("Failed to delete record. Please try again.");
      }
    }
  };

  const handleVerify = async (id) => {
    try {
      await axios.put(
        "https://back-ajnk.onrender.com/attendance/update",
        { id, verification: "verified" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAttendanceData((prevData) =>
        prevData.map((record) =>
          record._id === id ? { ...record, verification: "verified" } : record
        )
      );
    } catch (error) {
      console.error("Error verifying record:", error);
      alert("Failed to verify record. Please try again.");
    }
  };

  const handleButtonClick = (data, tag) => {
    setPopupData(data);
    if(tag) {
      setShowPopup_report(true);
    }else{
      setShowPopup_verifiedreport(true);
    }
    console.log("data is from", data.name);
  };

  const handleClosePopup = () => {
    setShowPopup_report(false);
    setShowPopup_verifiedreport(false);
    setPopupData(null);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Header />
      <div className="container-fluid py-4" id="main-cont">
        <div
          id="head-cont"
          className="d-flex justify-content-between align-items-center mb-4"
        >
          <h2 className="mb-0">Attendance Management</h2>
          <Link to="/Insert" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-lg me-2"></i>Add New Record
          </Link>
        </div>

        {/* Filter Section */}
        <div className="card shadow-sm border-1 mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Filters</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by name..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <i className="bi bi-x-circle me-2"></i>Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-3 text-muted">
          Showing {filteredData.length} of {attendanceData.length} records
        </div>

        {/* Table Section */}
        <div className="card shadow-lg border-2">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark align-baseline">
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Duration</th>
                    <th>Verification Status</th>
                    <th>Report</th>
                    <th>Verified Report</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((record) => (
                      <tr key={record._id}>
                        <td>
                          <p style={{ width: "150px" }}>{record.name}</p>
                        </td>
                        <td>
                          {editingId === record._id ? (
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              name="date"
                              value={editForm.date}
                              onChange={handleInputChange}
                            />
                          ) : (
                            new Date(
                              record.date.split("T")[0]
                            ).toLocaleDateString("en-IN")
                          )}
                        </td>
                        <td>
                          {editingId === record._id ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              name="day"
                              value={editForm.day}
                              onChange={handleInputChange}
                              disabled
                            />
                          ) : (
                            record.day
                          )}
                        </td>
                        <td>
                          {editingId === record._id ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              name="IN"
                              value={editForm.IN}
                              onChange={handleInputChange}
                            />
                          ) : (
                            record.IN || "N/A"
                          )}
                        </td>
                        <td>
                          {editingId === record._id ? (
                            <select
                              className="form-select form-select-sm"
                              name="verification"
                              value={editForm.verification}
                              onChange={handleInputChange}
                            >
                              <option value="pending">Pending</option>
                              <option value="verified">Verified</option>
                            </select>
                          ) : (
                            <span
                              className={`badge rounded-pill ${
                                record.verification === "verified"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                              style={{
                                width: "85px",
                                fontWeight: 300,
                                fontSize: "16px",
                              }}
                            >
                              {record.verification}
                            </span>
                          )}
                        </td>
                        <td>
                          <p className="report">{record.report}</p>
                          <p className="btn btn-link report-button" onClick={() => handleButtonClick(record, true)}>
                            more
                          </p>
                        </td>
                        <td>
                          <p className="report verified">{record.verified_report}</p>
                          <p className="btn btn-link report-buttton" style={{padding:"0"}} onClick={() => handleButtonClick(record, false)}>
                            more
                          </p>
                        </td>
                        <td>
                          {editingId === record._id ? (
                            <div className="btn-group" style={{ gap: "5px" }}>
                              <button
                                className="btn btn-success"
                                onClick={() => handleUpdate(record._id)}
                              >
                                <i className="bi bi-check"></i> Save
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                              >
                                <i className="bi bi-x"></i> Cancel
                              </button>
                            </div>
                          ) : (
                            <div
                              className="btn-group btn-group-sm"
                              style={{ gap: "5px" }}
                            >
                              <button
                                className="btn btn-primary"
                                style={{ background: "light-blue" }}
                                onClick={() => handleEdit(record)}
                                title="Edit"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(record._id)}
                                title="Delete"
                              >
                                Delete
                              </button>
                              {record.verification === "pending" && (
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleVerify(record._id)}
                                  title="Verify"
                                >
                                  Verify
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">
                        <i className="bi bi-inbox fs-4 d-block mb-2"></i>
                        No matching records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showPopup_report && popupData && (
        <div className="popup-overlay popup-container">
          <div className="popup">
            <div className="top">
              <div>
              <h2>{popupData.name}'s Report</h2>
              <p>on {new Date(popupData.date).toLocaleDateString("en-IN")} {popupData.day}</p>
              </div>
              <button className="btn btn-danger" onClick={handleClosePopup}>Close</button>
              </div>
              <div className="middle">

              {editingId === popupData._id ? (
                <textarea
                type="text"
                className="form-control"
                name="report"
                value={editForm.report}
                style={{maxHeight:"80%", scrollBehavior:"auto"}}
                onChange={(e)=>{
                  handleInputChange(e);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                />
              ) : (
               <p> {popupData.report}</p>
              )}
                  </div>
                  <div className="bottom">

              {editingId === popupData._id ? (
                <div className="btn-group" style={{ gap: "15px" }}>
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdate(popupData._id)}
                    >
                    <i className="bi bi-check"></i> Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                    >
                    <i className="bi bi-x"></i> Cancel
                  </button>
                </div>
              ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(popupData)}
                    title="Edit"
                    >
                    Edit
                  </button>
                
              )}
              </div>
            
          </div>
        </div>
      )}
      {showPopup_verifiedreport && popupData && (
        <div className="popup-overlay popup-container">
          <div className="popup">
              <div className="top">
                <div>
              <h2>{popupData.name}'s Verification Report</h2>
              <p>on {new Date(popupData.date).toLocaleDateString("en-IN")} {popupData.day}</p>
                </div>
              <button className="btn btn-danger" onClick={handleClosePopup}>Close</button>
              </div>
              <div className="middle">
              {editingId === popupData._id ? (
                <textarea
                  type="text"
                  className="form-control form-control-sm"
                  name="report"
                  value={editForm.verified_report}
                  style={{maxHeight:"80%", scrollBehavior:"auto"}}
                onChange={(e)=>{
                  handleInputChange(e);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                />
              ) : (
                <p>{popupData.verified_report}</p>
              )}
              </div>
              <div className="bottom">
              {editingId === popupData._id ? (
                <div className="btn-group" style={{ gap: "15px" }}>
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdate(popupData._id)}
                  >
                    <i className="bi bi-check"></i> Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    <i className="bi bi-x"></i> Cancel
                  </button>
                </div>
              ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(popupData)}
                    title="Edit"
                  >
                    Edit
                  </button>
                
              )}
              </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default Admintable;
