import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://backendchat-yise.onrender.com";

const socket = io(API_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

function Chat() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const messagesEndRef = useRef(null);

  // ================= CHECK LOGIN =================
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  // ================= LOAD HISTORY =================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, []);

  // ================= SOCKET EVENTS =================
  useEffect(() => {
    if (!user) return;

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
  }, [user]);

  // ================= SCROLL AUTO =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND =================
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      name: user.name,
      message,
    });

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
          <span>{user?.name}</span>
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
