import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return (
    <div>
      <Login />
    </div>
  );
}

export default App;
