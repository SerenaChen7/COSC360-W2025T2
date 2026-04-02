import { useState } from "react";
import "./AdminActions.css";
import EditCourseModal from "./EditCourseModal";

function AdminActions({ course, onCourseUpdated }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="admin-actions-card">
        <h3>ACTIONS</h3>
        <button className="admin-action-button" onClick={() => setShowEdit(true)}>
          Edit Hub
        </button>
        <button className="admin-action-button">Manage Members</button>
        <button className="admin-action-button danger">Block Hub</button>
      </div>

      {showEdit && course && (
        <EditCourseModal
          course={course}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => {
            onCourseUpdated?.(updated);
            setShowEdit(false);
          }}
        />
      )}
    </>
  );
}

export default AdminActions;