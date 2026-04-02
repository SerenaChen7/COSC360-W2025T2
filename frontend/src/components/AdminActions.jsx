import "./AdminActions.css";

// 1. Pass the courseId so the database knows which record to remove
function AdminActions({ courseId }) {

  // 2. This is the logic for Task 5: Delete (Remove Data)
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
    <div className="admin-actions-card">
      <h3>ACTIONS</h3>
      <button className="admin-action-button">Edit Hub</button>
      <button className="admin-action-button">Manage Members</button>
      
      {/* 3. Using the existing 'danger' class for our Delete button */}
      <button 
        className="admin-action-button danger" 
        onClick={handleDelete}
      >
        Delete Hub 🗑️
      </button>
    </div>
  );
}

export default AdminActions;