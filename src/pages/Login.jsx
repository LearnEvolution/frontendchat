import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "https://backendchat-yise.onrender.com";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erro no login");
        return;
      }

      // 🔥 salva o usuário para liberar o chat
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 redireciona
      navigate("/chat");

    } catch (err) {
      setMessage("Erro ao conectar no servidor");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <form onSubmit={handleLogin}>
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

        <button type="submit">Entrar</button>
      </form>

      <p>
        Não tem conta? <Link to="/register">Cadastrar</Link>
      </p>
    </div>
  );
}

export default Login;
