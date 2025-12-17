import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://backendchat-yise.onrender.com";

console.log("API_URL:", API_URL);

function Chat() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const messagesEndRef = useRef(null);

  // socket vai ser criado **depois** de carregar histórico
  const socket = io(API_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // ====== CARREGAR HISTÓRICO ======
    const loadMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
      }
    };
    loadMessages();

    // ====== SOCKET ======
    socket.emit("join", user.name);

    useEffect(() => {
  fetch(`${API_URL}/api/messages`)
    .then((res) => res.json())
    .then((data) => setMessages(data));
}, []);

useEffect(() => {
  socket.emit("join", user.name);

  const handleReceive = (data) => {
    setMessages((prev) => [...prev, data]);
  };

  const handleOnline = (users) => {
    setOnlineUsers(users);
  };

  socket.on("receiveMessage", handleReceive);
  socket.on("onlineUsers", handleOnline);

  return () => {
    socket.off("receiveMessage", handleReceive);
    socket.off("onlineUsers", handleOnline);
  };
}, []);

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msgData = {
      name: user.name,
      message,
    };

    // 🔥 envia para socket
    socket.emit("sendMessage", msgData);

    // 🔥 limpa input
    setMessage("");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

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
