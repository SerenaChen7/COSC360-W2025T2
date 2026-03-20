import { useState } from "react";

export default function Submit() {
  // Requirement: Collect at least TWO pieces of information 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Second piece of info
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Requirement: Send data using fetch() and an Express POST route 】
    const res = await fetch("http://localhost:3000/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Sending both pieces of information in the body
      body: JSON.stringify({ title, description }), 
    });

    // Requirement: Return a JSON response and display it 
    const data = await res.json();
    setResponseMsg(data.message);
  };

  return (
    <div>
      <h2>Submit Project</h2>

      <form onSubmit={handleSubmit}>
        {/* First Input */}
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Second Input (Added to meet requirement ) */}
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0' }}
        />

        <button type="submit">Submit</button>
      </form>

      {/* Requirement: Display the response in React  */}
      {responseMsg && <p>Server Response: {responseMsg}</p>}
    </div>
  );
}