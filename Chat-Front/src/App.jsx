import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);

    try {
      console.log("Enviando mensaje:", input);
      const res = await axios.post("http://localhost:3000/chat", {
        message: input,
      });
      const reply = res.data.reply;
      setMessages([
        ...messages,
        newMessage,
        { role: "assistant", content: reply },
      ]);
      setInput("");
    } catch (error) {
      alert("Error al contactar el servidor");
    }
  };

  return (
    <div className="container">
      <h1>My Chat</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default App;
