import { useEffect, useState } from "react";
import { getHealthStatus } from "./services/healthService";
import "./App.css";

function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHealthStatus()
      .then((data) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Gestión de Reservas de Laboratorios</h1>
      <p>Estado del backend y base de datos:</p>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {health ? (
        <pre>
          {JSON.stringify(health, null, 2)}
        </pre>
      ) : (
        !error && <p>Consultando servidor...</p>
      )}
    </main>
  );
}

export default App;