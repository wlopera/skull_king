const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { RoomManager } = require('./managers/RoomManager');
const { registerSocketHandlers } = require('./sockets/socketHandlers');

const app = express();
const server = http.createServer(app);

// Origen de clientes permitidos (Vercel y desarrollo local)
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000']
  : '*';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Endpoint de salud para monitorización y despliegue en Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Skull King Multiplayer Server',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('Servidor NodeJS de Skull King Multijugador activo.');
});

// Configuración de Socket.IO con optimización para WebSockets
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  },
  pingTimeout: 30000,
  pingInterval: 15000
});

// Gestor de salas y enlace de eventos
const roomManager = new RoomManager();
registerSocketHandlers(io, roomManager);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🏴‍☠️ Servidor Skull King V1 navegando en puerto ${PORT}`);
  console.log(`⚓ Estado de salud en: http://localhost:${PORT}/health`);
  console.log(`===============================================`);
});
