import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AttendanceHistory = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [newAttendance, setNewAttendance] = useState({ date: "", clockIn: "", report: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const username = decodedToken?.username;

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    console.log('Current token:', token);
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded token:', decoded);
      if (decoded.username) {
        fetchAttendanceData();
      }
    } catch (error) {
      console.error('Token decoding error:', error);
      setError('Authentication error. Please login again.');
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://new2att.onrender.com/attendance", config);
      console.log('Attendance data:', response.data);
      setAttendanceData(response.data);
      setFilteredData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error details:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      
      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        navigate('/login');
      } else {
        setError("Failed to fetch attendance data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewAttendanceChange = (field, value) => {
    setNewAttendance({ ...newAttendance, [field]: value });
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

  const handleSubmit = async () => {
    if (!username) {
      setError("User not authenticated");
      return;
    }

    if (newAttendance.date && newAttendance.clockIn) {
      const formattedDate = new Date(newAttendance.date).toLocaleDateString("en-CA");
      const todayDate = new Date().toLocaleDateString("en-CA");

      console.log("Formatted Date (Local):", formattedDate);
      console.log("Today's Date (Local):", todayDate);

      if (formattedDate === todayDate) {
        try {
          const response = await axios.post("https://new2att.onrender.com/attendance/new", {
            date: formattedDate,
            clockIn: newAttendance.clockIn,
            report: newAttendance.report,
          }, config);

          console.log('Attendance submission response:', response.data);
          setNewAttendance({ date: "", clockIn: "", report: "" });
          await fetchAttendanceData();
          alert("Attendance submitted successfully!");
        } catch (err) {
          console.error("Error adding new attendance:", err);
          setError("Failed to submit attendance: " + (err.response?.data?.message || err.message));
        }
      } else {
        setError(`You can only mark attendance for today.\nSelected Date: ${formattedDate}\nToday's Date: ${todayDate}`);
      }
    } else {
      setError("Please fill in all required fields.");
    }
  };

  const handleEditSubmit = async (rowId, rowData) => {
    try {
      await axios.put('https://new2att.onrender.com/attendance/update', {
        id: rowId,
        clockIn: rowData.IN,
        report: rowData.report
      }, config);
      
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
    return <div className="container mt-5">Please log in to view attendance history.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Attendance History for {username}</h2>
      
      <div className="card mb-4">
        <div className="card-header">
          <h4>Mark Attendance</h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Date:</label>
            <input
              type="date"
              className="form-control"
              value={newAttendance.date}
              onChange={(e) => handleNewAttendanceChange("date", e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Duration:</label>
            <input
              type="time"
              className="form-control"
              value={newAttendance.clockIn}
              onChange={(e) => handleNewAttendanceChange("clockIn", e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Report:</label>
            <textarea
              className="form-control"
              value={newAttendance.report}
              onChange={(e) => handleNewAttendanceChange("report", e.target.value)}
              placeholder="Enter your daily report"
              rows="3"
            />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={!newAttendance.date || !newAttendance.clockIn}
          >
            Submit Attendance
          </button>
        </div>
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
                    <td>{new Date(row.date).toLocaleDateString()}</td>
                    <td>{row.day}</td>
                    <td>
                      <input
                        type="time"
                        value={row.IN || ""}
                        disabled={!isEditable(row.date)}
                        onChange={(e) => handleTimeChange(index, "IN", e.target.value)}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <textarea
                        value={row.report || ""}
                        disabled={!isEditable(row.date)}
                        onChange={(e) => handleTimeChange(index, "report", e.target.value)}
                        placeholder="Enter report"
                        className="form-control"
                        rows="2"
                      />
                    </td>
                    <td>
                      <span className={`badge ${row.verification === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                        {row.verification || "Pending"}
                      </span>
                    </td>
                    <td>
                      {isEditable(row.date) && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditSubmit(row._id, row)}
                        >
                          Save Changes
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">No attendance records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;