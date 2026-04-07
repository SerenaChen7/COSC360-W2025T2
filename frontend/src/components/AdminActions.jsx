import { useState } from "react";
import "./AdminActions.css";
import EditCourseModal from "./EditCourseModal";

function AdminActions({ courseId, course, onCourseUpdated, managingMembers, onToggleManage }) {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    // A simple check so we don't delete by accident
    const confirmDelete = window.confirm("Are you sure you want to delete this Hub forever?");
    
    if (confirmDelete) {
      try {
        // Fetching our backend route: DELETE /api/courses/:id
        const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert("Hub deleted successfully!");
          // Go back to the home page after deleting
          window.location.href = "/";
        } else {
          alert("Failed to delete. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };
return (
    <>
      <div className="admin-actions-card">
        <h3>ACTIONS</h3>
        <button className="admin-action-button" onClick={() => setShowEdit(true)}>
          Edit Hub
        </button>
        
        <button className="admin-action-button" onClick={onToggleManage}>
          {managingMembers ? "Done Managing" : "Manage Members"}
        </button>

        <button className="admin-action-button danger" onClick={handleDelete}>
          Delete Hub 🗑️
        </button>
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