import "./AdminActions.css";

function AdminActions() {
  return (
    <div className="admin-actions-card">
      <h3>ACTIONS</h3>
      <button className="admin-action-button">Edit Hub</button>
      <button className="admin-action-button">Manage Members</button>
      <button className="admin-action-button danger">Block Hub</button>
    </div>
  );
}

export default AdminActions;