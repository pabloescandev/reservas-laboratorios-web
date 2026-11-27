require("dotenv").config();
const app = require("./src/app");
const reservaService = require("./src/services/reserva.service");

const PORT = process.env.PORT || 3001;

const CINCO_MINUTOS = 5 * 60 * 1000;

async function actualizarReservasVencidas() {
  try {
    const { finalizadas, rechazadas } = await reservaService.finalizarVencidas();
    if (finalizadas || rechazadas) {
      console.log(`Reservas actualizadas: ${finalizadas} finalizadas, ${rechazadas} rechazadas por vencimiento`);
    }
  } catch (err) {
    console.error("Error al actualizar reservas vencidas:", err.message);
  }
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  actualizarReservasVencidas();
  setInterval(actualizarReservasVencidas, CINCO_MINUTOS);
});