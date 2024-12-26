import React, { useState } from "react";
import Header from "./Header";
import AttendanceHistory from "./AttendanceHistory";
import Profile from "./Profile";

function MAINAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  // Handler function to add or update attendance data
  const handleClockAction = (actionType) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    const dayString = now.toLocaleDateString("en-US", { weekday: "long" });

    if (actionType === "clockIn") {
      const newEntry = {
        date: dateString,
        day: dayString,
        clockIn: timeString,
        clockOut: "",
        duration: "",
      };
      setAttendanceData([...attendanceData, newEntry]);
      setLastAction(`Clocked in at ${timeString}`);
    } else if (actionType === "clockOut") {
      const updatedData = [...attendanceData];
      const lastEntry = updatedData[updatedData.length - 1];
      const clockInTime = new Date(`${lastEntry.date} ${lastEntry.clockIn}`);
      const clockOutTime = new Date(`${dateString} ${timeString}`);
      const durationMs = clockOutTime - clockInTime;
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      const duration = `${hours}h ${minutes}m`;

      lastEntry.clockOut = timeString;
      lastEntry.duration = duration;

      setAttendanceData(updatedData);
      setLastAction(`Clocked out at ${timeString}`);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header />
      <main className="container py-4" >
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="row g-4">
           
              <div className="col-md-6">
                <Profile />
              </div>
            </div>
            <div className="mt-4">
              <AttendanceHistory attendanceData={attendanceData} />
            </div>
          </div>
          <div className="col-lg-4">
            {/* Additional content for the right column can go here */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MAINAttendance;
