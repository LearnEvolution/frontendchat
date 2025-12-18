import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://backendchat-yise.onrender.com", {
  transports: ["websocket"],
});

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const usuario = localStorage.getItem("user");

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("chatMessage", {
      usuario,
      text: message,
      time: new Date().toLocaleTimeString(),
    });
    setMessage("");
  };

  return (
    <div style={{ padding: "20px", background: "white" }}>
      <h2>Chat Online</h2>

      <div
        style={{
          border: "1px solid black",
          height: "300px",
          overflowY: "auto",
          marginBottom: "20px",
          padding: "10px",
          background: "white",
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
  );
}
