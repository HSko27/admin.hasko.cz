import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [names, setNames] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Odesílám:", { names, pass });
      const response = await axios.post("http://5.39.202.91:3002/login", { names, pass });
      console.log("Odpověď serveru:", response.data);

      localStorage.setItem("token", response.data.token);
      alert("Přihlášení úspěšné!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Chyba při přihlášení:", err);
      setError("Přihlášení se nezdařilo. Zkontrolujte své údaje a zkuste to znovu.");
    }
  };

  return (
    <div className="screen">
      <div className="justify-center flex">
        <form onSubmit={handleSubmit} className="bg-neutral-800 rounded-md mt-60 p-6 md:w-1/3 flex flex-col w-full">
          <h2 className="text-2xl font-bold text-center text-slate-50 mb-4">Admin Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <input
            type="text"
            placeholder="Jméno"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            className="w-1/2 text-slate-50 mx-auto p-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="Heslo"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-1/2 text-slate-50 mx-auto p-2 border rounded mb-3"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Přihlásit se</button>
        </form>
      </div>
    </div>
  );
};

export default Login;