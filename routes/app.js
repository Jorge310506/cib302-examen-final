const express = require('express');
require('dotenv').config();
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Enrutar la API
app.use('/api/pedidos', pedidoRoutes);

// Manejo global de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});