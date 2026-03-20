import { useState } from "react";

export default function Submit() {
  // Requirement: Collect at least TWO pieces of information 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Requirement: Send data using fetch() and an Express POST route 】
    const res = await fetch("http://localhost:3000/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    // Requirement: Return a JSON response and display it 
    const data = await res.json();
    setResponseMsg(data.message);
  };

  return (
    <div>
      <h2>Edit Course Detail</h2>

      <form onSubmit={handleSubmit}>
        {/* First Input */}
        <input
          type="text"
          placeholder="Course Title"
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
        <input
          type="text"
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        <button type="submit">Submit</button>
      </form>

      <p>{responseMsg}</p >
    </div>
  );
}