import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CoverPage  from "./pages/CoverPage";
import Submit from "./pages/Submit";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <div style={{ padding: 12 }}>
        <button onClick={() => setPage("cover")} style={{ marginLeft: 8 }}>
          Cover Page
        </button>

        <button onClick={() => setPage("login")} style={{ marginLeft: 8 }}>
          Login
        </button>
        <button onClick={() => setPage("home")} style={{ marginLeft: 8 }}>
          Home
        </button>
        <button onClick={() => setPage("submit")} style={{ marginLeft: 8 }}>
          Submit
        </button>
      </div>

      {page === "cover" && <CoverPage />}
      {page === "home" && <Home />}
      {page === "login" && <Login />}
      {page === "submit" && <Submit />}
    </>
  );
}