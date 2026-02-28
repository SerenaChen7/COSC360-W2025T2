import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <div style={{ padding: 12 }}>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("home")} style={{ marginLeft: 8 }}>
          Home
        </button>
      </div>

      {page === "login" ? <Login /> : <Home />}
    </>
  );
}