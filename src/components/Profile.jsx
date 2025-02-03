import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const username = localStorage.getItem("username") || "John Doe";
  const [attendanceData, setAttendanceData] = useState([]);

  // Function to adjust time by subtracting 5:30 hours
  const getAdjustedDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() - 5 * 60 * 60 * 1000 - 30 * 60 * 1000);
  };

  // Function to format adjusted date to locale string
  const formatAdjustedDate = (dateString) => {
    const adjustedDate = getAdjustedDate(dateString);
    return adjustedDate.toLocaleDateString();
  };

  // Function to get adjusted day
  const getAdjustedDay = (dateString) => {
    const adjustedDate = getAdjustedDate(dateString);
    return adjustedDate.toLocaleDateString("en-US", { weekday: "long" });
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const [internDetails, setInternDetails] = useState(null);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        "https://back-ajnk.onrender.com/attendance",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Filter attendance data for the current user and adjust dates
      const userAttendance = response.data
        .filter((record) => record.name === username)
        .map((record) => ({
          ...record,
          adjustedDate: formatAdjustedDate(record.date),
          adjustedDay: getAdjustedDay(record.date),
        }));

      setAttendanceData(userAttendance);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Calculate total verified hours
  const totalVerifiedDuration = attendanceData
    .filter((record) => record.verification === "verified")
    .reduce((total, record) => total + parseInt(record.IN || 0, 10), 0);

  // Progress bar value
  const progress = (totalVerifiedDuration / 116) * 100;

  const fetchInternDetails = async () => {
    try {
      const response = await axios.get(
        `https://back-ajnk.onrender.com/interninfo/${username}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const {
        name,
        internshipType,
        internshipDuration,
        dailyHours,
        contactNumber,
      } = response.data;

      return {
        name,
        internshipType,
        internshipDuration,
        dailyHours,
        contactNumber,
      };
    } catch (error) {
      console.error("Error fetching intern details:", error);
      setError("Failed to fetch intern details. Please try again later.");
      return null;
    }
  };

  useEffect(() => {
    const fetchAndSetInternDetails = async () => {
      const details = await fetchInternDetails();
      setInternDetails(details);
    };
    fetchAndSetInternDetails();
  }, []);

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h2 className="card-title h5 mb-4">Intern Profile</h2>
        {internDetails && (
          <div className="d-flex flex-column align-items-start mb-3">
            <div className="d-flex align-items-center mb-2">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="Intern"
                className="rounded-circle me-3"
                style={{ height: "80px", width: "80px" }}
              />
              <div>
                <h3 className="h5 mb-3">{internDetails.name}</h3>
              </div>
            </div>
            <div className="container p-3 bg-light rounded border">
              <div className="row g-3">
                <div className="col-md-6">
                  <h4 className="h6  mb-1">Internship Type:</h4>
                  <p className="mb-0 fw-medium">
                    {internDetails.internshipType}
                  </p>
                </div>
                <div className="col-md-6">
                  <h4 className="h6  mb-1">Internship Duration:</h4>
                  <p className="mb-0 fw-medium">
                    {internDetails.internshipDuration}
                  </p>
                </div>
              </div>
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <h4 className="h6  mb-1">Daily Working Hours:</h4>
                  <p className="mb-0 fw-medium">{internDetails.dailyHours}</p>
                </div>
                <div className="col-md-6">
                  <h4 className="h6  mb-1">Contact Number:</h4>
                  <p className="mb-0 fw-medium">
                    {internDetails.contactNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                          record.verification === "verified"
                            ? "bg-success"
                            : "bg-warning text-dark"
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
            <p className="text-muted">Nothing found.</p>
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
