import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://backendchat-yise.onrender.com", {
  transports: ["websocket"],
});

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    socket.emit("join", user.name);

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("onlineUsers");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("chatMessage", {
      usuario: user.name,
      text: message,
      time: new Date().toLocaleTimeString(),
    });

    setMessage("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LADO ESQUERDO – USUÁRIOS ONLINE */}
      <div
        style={{
          width: "200px",
          background: "#1E1E1E",
          color: "white",
          padding: "10px",
        }}
      >
        <h3>Online</h3>

        {onlineUsers.map((u, i) => (
          <p key={i}>
            🟢 {u}
          </p>
        ))}
      </div>

      {/* LADO DIREITO – CHAT */}
      <div
        style={{
          flex: 1,
          background: "white",
          padding: "20px",
        }}
      >
        <h2>Chat Online</h2>

        <div
          style={{
            border: "1px solid black",
            height: "300px",
            overflowY: "auto",
            marginBottom: "20px",
            padding: "10px",
          }}
        >
          {messages.map((m, i) => (
            <div key={i}>
              <strong>{m.usuario}</strong>: {m.text} — {m.time}
            </div>
          ))}
        </div>

        <input
          style={{ width: "70%", padding: "10px" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite uma mensagem"
        />
        <button
          style={{ width: "25%", padding: "10px" }}
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
