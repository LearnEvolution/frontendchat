import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const register = async (e) => {
    e.preventDefault(); // 🔥 ENTER funciona
    setMessage("");

    const res = await fetch("http://localhost:3001/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => navigate("/"), 1000); // 🔥 volta pro login
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Cadastro</h2>

      <form onSubmit={register}>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Cadastrar</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
