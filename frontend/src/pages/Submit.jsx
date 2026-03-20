import { useState } from "react";

export default function Submit() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    //react is sending an HTTP POST request to the backend server at http://localhost:3000/api/submit with a JSON body containing the project title. 
    //The backend server will process this request and return a JSON response, which we will then display on the frontend.
    const res = await fetch("http://localhost:3000/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    //Data is the JSON response from the backend
    const data = await res.json();
    setResponseMsg(data.message);
  };

  return (
    <div>
      <h2>Edit Course Detail</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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