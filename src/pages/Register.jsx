import { useState } from "react";
import axios from "axios";
import "../styles/Register.css";

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://backendchat-yise.onrender.com/user/register",
        { name, email, password }
      );

      setMsg("Registrado com sucesso!");
      console.log(res.data);

    } catch (err) {
      setMsg("Erro ao registrar.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h2>Registrar</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button type="submit">Registrar</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}
