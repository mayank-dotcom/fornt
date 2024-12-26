import React from "react";

function Profile() {
  const username = localStorage.getItem("username") || "John Doe";

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column justify-content-between">
        <h2 className="card-title h5 mb-4">Intern Profile</h2>
        <div className="d-flex align-items-center">
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
      </div>
    </div>
  );
}

export default Profile;
