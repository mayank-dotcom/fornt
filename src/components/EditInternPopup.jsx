import React, { useState, useEffect } from "react";
import axios from "axios";

function EditInternPopup({ names, id, onClose, onSave }) {
  const internshipTypes = ["Mern Stack", "HR Department"];
  const internshipDurations = ["1 month", "2 months", "3 months", "6 months"];
  const dailyHours = [
    "1:00",
    "1:30",
    "2:00",
    "2:30",
    "3:00",
    "3:30",
    "4:00",
    "4:30",
    "5:00",
  ];

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    internshipType: "",
    internshipDuration: "",
    dailyHours: "",
    contactNumber: "",
  });

  useEffect(() => {
    const fetchInternData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/internDetails/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching intern data:", err);
      }
    };

    if (id) {
      fetchInternData();
    } else {
      setEditMode(true);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      name: "",
      internshipType: "",
      internshipDuration: "",
      dailyHours: "",
      contactNumber: "",
    });
  };

  const handleSave = async () => {
    try {
      if (id) {
        // Update existing intern
        await axios.put(`http://localhost:8000/updateIntern/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        // Create new intern
        console.log("creating intern");
        await axios.post("http://localhost:8000/createIntern", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      setEditMode(false);
      onSave(); // Call the onSave callback to update the main table
    } catch (error) {
      console.error("Error updating/creating intern:", error);
      alert("Failed to update/create intern. Please try again.");
    }
  };

  return (
    <div
      className="modal show"
      tabIndex="-1"
      role="dialog"
      style={{ display: "block" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{id ? formData.name : "New Intern"}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                {editMode ? (
                <select
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                >
                <option value="">Select name</option>
                {names.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    disabled
                  />
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="internshipType" className="form-label">
                  Internship Type
                </label>
                {editMode ? (
                  <select
                    className="form-select"
                    id="internshipType"
                    name="internshipType"
                    value={formData.internshipType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select an internship type</option>
                    {internshipTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="internshipType"
                    name="internshipType"
                    value={formData.internshipType}
                    disabled
                  />
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="internshipDuration" className="form-label">
                  Internship Duration
                </label>
                {editMode ? (
                  <select
                    className="form-select"
                    id="internshipDuration"
                    name="internshipDuration"
                    value={formData.internshipDuration}
                    onChange={handleInputChange}
                  >
                    <option value="">Select an internship duration</option>
                    {internshipDurations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="internshipDuration"
                    name="internshipDuration"
                    value={formData.internshipDuration}
                    disabled
                  />
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="dailyHours" className="form-label">
                  Daily Working Hours
                </label>
                {editMode ? (
                  <select
                    className="form-select"
                    id="dailyHours"
                    name="dailyHours"
                    value={formData.dailyHours}
                    onChange={handleInputChange}
                  >
                    <option value="">Select daily working hours</option>
                    {dailyHours.map((hours) => (
                      <option key={hours} value={hours}>
                        {hours}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="dailyHours"
                    name="dailyHours"
                    value={formData.dailyHours}
                    disabled
                  />
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="contactNumber" className="form-label">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            {editMode ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSave()}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditInternPopup;
