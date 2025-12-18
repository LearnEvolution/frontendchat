import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

export default function Login({ setUser }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://backendchat-yise.onrender.com/user/login",
        { email, password }
      );

      setUser(res.data.user);
      setMsg("Login realizado com sucesso!");
      console.log(res.data);

    } catch (err) {
      setMsg("Erro ao fazer login.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}
