import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3001");

function Chat() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // entra no chat
    socket.emit("join", user.name);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
    };
  }, []);

  const sendMessage = () => {
    if (!message) return;

    socket.emit("sendMessage", {
      name: user.name,
      message,
    });

    setMessage("");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* usuários online */}
      <div style={{ width: 200, borderRight: "1px solid #ccc", padding: 10 }}>
        <h4>Online</h4>
        {onlineUsers.map((u, i) => (
          <p key={i}>🟢 {u}</p>
        ))}

        <button onClick={logout} style={{ marginTop: 20 }}>
          Sair
        </button>
      </div>

      {/* chat */}
      <div style={{ flex: 1, padding: 20 }}>
        <h2>Chat</h2>

        <div style={{ height: 300, overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
          {messages.map((m, i) => (
            <p key={i}>
              <strong>{m.name}:</strong> {m.message}
            </p>
          ))}
        </div>

        <input
          placeholder="Digite uma mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "80%" }}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default Chat;
