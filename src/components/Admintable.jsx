
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

//   // Bulk attendance state
//   const [bulkFile, setBulkFile] = useState(null);

//   // Edit form state
//   const [editForm, setEditForm] = useState({
//     date: "",
//     day: "",
//     IN: "",
//     report: "",
//     verification: "",
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

//     if (nameFilter) {
//       filtered = filtered.filter((record) =>
//         record.name.toLowerCase().includes(nameFilter.toLowerCase())
//       );
//     }

//     if (startDate) {
//       const filterStartDate = new Date(startDate);
//       filterStartDate.setHours(0, 0, 0, 0);

//       filtered = filtered.filter((record) => {
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

//   // Bulk attendance handler
//   const handleBulkUpload = async (e) => {
//     e.preventDefault();
//     if (!bulkFile) {
//       alert("Please select a file to upload.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", bulkFile);

//     try {
//       const response = await axios.post("https://back-ajnk.onrender.com/attendance/bulk-upload", formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.status === 200) {
//         alert("Bulk attendance uploaded successfully!");
//         fetchAttendanceData();
//         setBulkFile(null);
//       }
//     } catch (err) {
//       console.error("Error uploading bulk attendance:", err);
//       alert("Failed to upload bulk attendance. Please try again.");
//     }
//   };

//   const handleFileChange = (e) => {
//     setBulkFile(e.target.files[0]);
//   };

//   // Edit handlers
//   const handleEdit = (record) => {
//     setEditingId(record._id);
//     setEditForm({
//       date: new Date(record.date).toISOString().split("T")[0],
//       day: record.day,
//       IN: record.IN || "",
//       report: record.report || "",
//       verification: record.verification,
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditForm({
//       date: "",
//       day: "",
//       IN: "",
//       report: "",
//       verification: "",
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (name === "date") {
//       const newDate = new Date(value);
//       const day = newDate.toLocaleString("en-US", { weekday: "long" });
//       setEditForm((prev) => ({
//         ...prev,
//         day: day,
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
//           verification: editForm.verification,
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

//         setAttendanceData((prevData) =>
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

//       setAttendanceData((prevData) =>
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

//         {/* Bulk Upload Section */}
//         <div className="card shadow-sm border-0 mb-4">
//           <div className="card-body">
//             <h5 className="card-title mb-3">Bulk Attendance Upload</h5>
//             <form onSubmit={handleBulkUpload}>
//               <div className="row g-3 align-items-center">
//                 <div className="col-md-8">
//                   <input
//                     type="file"
//                     className="form-control"
//                     accept=".csv"
//                     onChange={handleFileChange}
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <button type="submit" className="btn btn-primary">
//                     Upload
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
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
//                     <th>Report</th>
//                     <th>Verification</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.map((record) => (
//                     <tr key={record._id}>
//                       <td>{record.name}</td>
//                       <td>{new Date(record.date).toLocaleDateString()}</td>
//                       <td>{record.day}</td>
//                       <td>{record.IN || "N/A"}</td>
//                       <td>{record.report || "No report"}</td>
//                       <td>
//                         <span
//                           className={`badge ${
//                             record.verification === "verified"
//                               ? "bg-success"
//                               : "bg-warning"
//                           }`}
//                         >
//                           {record.verification}
//                         </span>
//                       </td>
//                       <td>
//                         {editingId === record._id ? (
//                           <>
//                             <button
//                               className="btn btn-primary btn-sm me-2"
//                               onClick={() => handleUpdate(record._id)}
//                             >
//                               Save
//                             </button>
//                             <button
//                               className="btn btn-secondary btn-sm"
//                               onClick={handleCancelEdit}
//                             >
//                               Cancel
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             <button
//                               className="btn btn-outline-primary btn-sm me-2"
//                               onClick={() => handleEdit(record)}
//                             >
//                               Edit
//                             </button>
//                             <button
//                               className="btn btn-outline-danger btn-sm me-2"
//                               onClick={() => handleDelete(record._id)}
//                             >
//                               Delete
//                             </button>
//                             {record.verification !== "verified" && (
//                               <button
//                                 className="btn btn-outline-success btn-sm"
//                                 onClick={() => handleVerify(record._id)}
//                               >
//                                 Verify
//                               </button>
//                             )}
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
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

function Admintable() {
  // State management
  const [attendanceData, setAttendanceData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Bulk attendance state
  const [bulkFile, setBulkFile] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    date: "",
    day: "",
    IN: "",
    report: "",
    verification: "",
  });

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

  // Fetch data on component mount
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // Filter effect
  useEffect(() => {
    filterData();
  }, [attendanceData, nameFilter, startDate]);

  // Data fetching function
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://back-ajnk.onrender.com/attendance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Adjust dates in the fetched data
      const adjustedData = response.data.map(record => ({
        ...record,
        adjustedDate: formatAdjustedDate(record.date),
        adjustedDay: getAdjustedDay(record.date)
      }));
      
      setAttendanceData(adjustedData);
      setFilteredData(adjustedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch attendance data. Please try again later.");
      console.error("Error fetching attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter function
  const filterData = () => {
    let filtered = [...attendanceData];

    if (nameFilter) {
      filtered = filtered.filter((record) =>
        record.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (startDate) {
      const filterStartDate = getAdjustedDate(startDate);
      filterStartDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter((record) => {
        const recordDate = getAdjustedDate(record.date);
        return recordDate >= filterStartDate;
      });
    }

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setNameFilter("");
    setStartDate("");
  };

  // Bulk attendance handler remains the same
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      const response = await axios.post("https://back-ajnk.onrender.com/attendance/bulk-upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Bulk attendance uploaded successfully!");
        fetchAttendanceData();
        setBulkFile(null);
      }
    } catch (err) {
      console.error("Error uploading bulk attendance:", err);
      alert("Failed to upload bulk attendance. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    setBulkFile(e.target.files[0]);
  };

  // Edit handlers with adjusted time
  const handleEdit = (record) => {
    setEditingId(record._id);
    const adjustedDate = getAdjustedDate(record.date);
    setEditForm({
      date: adjustedDate.toISOString().split("T")[0],
      day: getAdjustedDay(record.date),
      IN: record.IN || "",
      report: record.report || "",
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
      const adjustedDate = getAdjustedDate(value);
      const day = adjustedDate.toLocaleString("en-US", { weekday: "long" });
      setEditForm((prev) => ({
        ...prev,
        day: day,
      }));
    }
  };

  // Update handler
  const handleUpdate = async (id) => {
    try {
      // Add 5:30 hours back before sending to server
      const serverDate = new Date(editForm.date);
      serverDate.setTime(serverDate.getTime() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000));
      
      const response = await axios.put(
        "https://back-ajnk.onrender.com/attendance/update",
        {
          id,
          date: serverDate.toISOString().split("T")[0],
          clockIn: editForm.IN,
          report: editForm.report,
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

  // Delete and verify handlers remain the same
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`https://back-ajnk.onrender.com/delete-record/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

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
      <div className="container-fluid py-4">
        {/* Top Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Attendance Management</h2>
          <Link to="/Insert" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-lg me-2"></i>Add New Record
          </Link>
        </div>

        {/* Bulk Upload Section */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Bulk Attendance Upload</h5>
            <form onSubmit={handleBulkUpload}>
              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <input
                    type="file"
                    className="form-control"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-md-4">
                  <button type="submit" className="btn btn-primary">
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Filter Section */}
        <div className="card shadow-sm border-0 mb-4">
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
        <div className="card shadow-lg border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Duration</th>
                    <th>Report</th>
                    <th>Verification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr key={record._id}>
                      <td>{record.name}</td>
                      <td>{record.adjustedDate}</td>
                      <td>{record.adjustedDay}</td>
                      <td>{record.IN || "N/A"}</td>
                      <td>{record.report || "No report"}</td>
                      <td>
                        <span
                          className={`badge ${
                            record.verification === "verified"
                              ? "bg-success"
                              : "bg-warning"
                          }`}
                        >
                          {record.verification}
                        </span>
                      </td>
                      <td>
                        {editingId === record._id ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={() => handleUpdate(record._id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-outline-primary btn-sm me-2"
                              onClick={() => handleEdit(record)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm me-2"
                              onClick={() => handleDelete(record._id)}
                            >
                              Delete
                            </button>
                            {record.verification !== "verified" && (
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() => handleVerify(record._id)}
                              >
                                Verify
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admintable;