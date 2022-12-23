import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [data, setData] = useState({
    message: "",
  });

  const [message, setMessage] = useState("");

  const getData = async () => {
    const response = await axios.get("http://localhost:5050/api");
    setData(response.data);
  };

  const fetchSecretMessage = async () => {
    const response = await axios.get("http://localhost:5050/api/secret");
    setMessage(response.data.message);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      <div>
        <a href="http://nyumat.tech" target="_blank"></a>
        <a href="https://github.com/nyumat" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>
        <span
          style={{
            color: "white",
            fontSize: "4rem",
          }}
        >
          {data.message}
        </span>
      </h1>
      <div className="card flexer">
        <button onClick={() => fetchSecretMessage()}>
          Fetch Secret Message
        </button>
        <button onClick={() => setMessage("")}>Hide Secret Message</button>
        <p
          style={{
            display: "block",
            left: "38%",
            top: "45%",
            fontSize: "2rem",
            position: "absolute",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default App;
