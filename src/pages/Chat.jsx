import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://backendchat-yise.onrender.com";

function Chat() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // conectar socket UMA vez
    socketRef.current = io(API_URL, {
      transports: ["websocket"],
    });

    // ao conectar, entra no chat
    socketRef.current.emit("join", user.name);

    // carregar histórico
    fetch(`${API_URL}/api/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    // receber mensagens em tempo real
    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // receber lista de online
    socketRef.current.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current.emit("sendMessage", {
      name: user.name,
      message,
    });

    setMessage("");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-layout">
      <div className="sidebar">
        <h4>Online</h4>
        {onlineUsers.map((u, i) => (
          <p key={i}>🟢 {u}</p>
        ))}
        <button onClick={logout} className="logout-btn">
          Sair
        </button>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <span>{user.name}</span>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`message ${
                m.name === user.name ? "message-own" : "message-other"
              }`}
            >
              <strong>{m.name}</strong> {m.message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            placeholder="Digite uma mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
