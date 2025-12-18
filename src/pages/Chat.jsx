import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

export default function Chat({ user }) {

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!user) return;

    const s = io("https://backendchat-yise.onrender.com", {
      transports: ["websocket"],
    });

    setSocket(s);

    s.emit("userOnline", user);

    s.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    s.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };

  }, [user]);


  const sendMsg = () => {
    if (!text) return;
    socket.emit("chatMessage", {
      user,
      text,
    });
    setText("");
  };

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h2>Chat</h2>

      <h4>Usuários online:</h4>
      {onlineUsers.map((u, i) => (
        <p key={i}>{u.email}</p>
      ))}

      <hr/>

      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.user.email}:</b> {m.text}
          </p>
        ))}
      </div>

      <hr/>

      <input
        placeholder="Digite sua mensagem..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={sendMsg}>Enviar</button>
    </div>
  );
}
