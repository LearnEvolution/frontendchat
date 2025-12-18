import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://backend-chat.onrender.com");
const userName = localStorage.getItem("user_name");
const userId = localStorage.getItem("user_id");

export default function Chat() {

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    socket.emit("user_connected", {
      name: userName,
      id: userId
    });

    socket.on("online_users", (users) => {
      const unique = [];
      const ids = new Set();

      for (const u of users) {
        if (!ids.has(u.id)) {
          ids.add(u.id);
          unique.push(u);
        }
      }

      setOnlineUsers(unique);
    });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

  }, []);

  function sendMessage() {
    if (message.trim() === "") return;

    socket.emit("send_message", {
      text: message,
      owner: userName
    });

    setMessage("");
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      <div style={{ width: "40%", background: "#111", padding: 20, color: "white" }}>
        <h2>Online</h2>

        {onlineUsers.map(u => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <div style={{
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "green",
              marginRight: 10,
            }}></div>

            <span>{u.name}</span>
          </div>
        ))}

      </div>

      <div style={{ flex: 1, padding: 20 }}>
        <div style={{
          width: "100%",
          height: "85%",
          border: "1px solid black",
          overflowY: "scroll",
          marginBottom: 10
        }}>
          {messages.map((m, index) => (
            <p key={index}><b>{m.owner}:</b> {m.text}</p>
          ))}
        </div>

        <input
          placeholder="Digite uma mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "80%",
            padding: 10,
            border: "1px solid gray",
            marginRight: 10
          }}
        />

        <button
          onClick={sendMessage}
          style={{ padding: 10 }}
        >
          Enviar
        </button>
      </div>

    </div>
  );
}
