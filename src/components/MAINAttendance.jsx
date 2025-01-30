// import React, { useState } from "react";
// import Header from "./Header";
// import AttendanceHistory from "./AttendanceHistory";
// import Profile from "./Profile";

// function MAINAttendance() {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [lastAction, setLastAction] = useState(null);

//   // Handler function to add or update attendance data
//   const handleClockAction = (actionType) => {
//     const now = new Date();
//     const timeString = now.toLocaleTimeString();
//     const dateString = now.toLocaleDateString();
//     const dayString = now.toLocaleDateString("en-US", { weekday: "long" });

//     if (actionType === "clockIn") {
//       const newEntry = {
//         date: dateString,
//         day: dayString,
//         clockIn: timeString,
//         clockOut: "",
//         duration: "",
//       };
//       setAttendanceData([...attendanceData, newEntry]);
//       setLastAction(`Clocked in at ${timeString}`);
//     } else if (actionType === "clockOut") {
//       const updatedData = [...attendanceData];
//       const lastEntry = updatedData[updatedData.length - 1];
//       const clockInTime = new Date(`${lastEntry.date} ${lastEntry.clockIn}`);
//       const clockOutTime = new Date(`${dateString} ${timeString}`);
//       const durationMs = clockOutTime - clockInTime;
//       const hours = Math.floor(durationMs / (1000 * 60 * 60));
//       const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
//       const duration = `${hours}h ${minutes}m`;

//       lastEntry.clockOut = timeString;
//       lastEntry.duration = duration;

//       setAttendanceData(updatedData);
//       setLastAction(`Clocked out at ${timeString}`);
//     }
//   };

//   return (
//     <div className="min-vh-100 bg-light">
//       <Header />
//       <main className="container py-4" >
//         <div className="row g-4">
//           <div className="col-lg-8">
//             <div className="row g-4">
           
//               <div className="col-md-6">
//                 <Profile />
//               </div>
//             </div>
//             <div className="mt-4">
//               <AttendanceHistory attendanceData={attendanceData} />
//             </div>
//           </div>
//           <div className="col-lg-4">
//             {/* Additional content for the right column can go here */}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default MAINAttendance;
import React, { useState } from "react";
import Header from "./Header";
import AttendanceHistory from "./AttendanceHistory";
import Profile from "./Profile";

function MAINAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  // Function to adjust time by subtracting 5:30 hours
  const getAdjustedDate = () => {
    const now = new Date();
    // Subtract 5 hours and 30 minutes (in milliseconds)
    return new Date(now.getTime() - (5 * 60 * 60 * 1000) - (30 * 60 * 1000));
  };

  // Function to format time string
  const formatTimeString = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Handler function to add or update attendance data
  const handleClockAction = (actionType) => {
    const adjustedDate = getAdjustedDate();
    const timeString = formatTimeString(adjustedDate);
    const dateString = adjustedDate.toLocaleDateString();
    const dayString = adjustedDate.toLocaleDateString("en-US", { weekday: "long" });

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
      
      // Parse the clock-in time and adjust it
      const clockInParts = lastEntry.clockIn.match(/(\d+):(\d+):(\d+)\s(AM|PM)/);
      if (!clockInParts) return;
      
      const clockInDate = new Date(lastEntry.date);
      clockInDate.setHours(
        clockInParts[4] === 'PM' ? parseInt(clockInParts[1]) + 12 : parseInt(clockInParts[1]),
        parseInt(clockInParts[2]),
        parseInt(clockInParts[3])
      );

      // Calculate duration
      const durationMs = adjustedDate - clockInDate;
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
      <main className="container py-4">
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
            {/* Clock In/Out Buttons */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Attendance Actions</h5>
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleClockAction("clockIn")}
                  >
                    Clock In
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleClockAction("clockOut")}
                  >
                    Clock Out
                  </button>
                </div>
                {lastAction && (
                  <div className="mt-3 text-muted">
                    <small>{lastAction}</small>
                  </div>
                )}
              </div>
            </div>

            {/* Status Display */}
            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title">Current Status</h5>
                <p className="card-text">
                  {attendanceData.length > 0 && !attendanceData[attendanceData.length - 1].clockOut
                    ? "Currently Clocked In"
                    : "Currently Clocked Out"}
                </p>
                <p className="card-text">
                  <small className="text-muted">
                    Adjusted time: {formatTimeString(getAdjustedDate())}
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MAINAttendance;