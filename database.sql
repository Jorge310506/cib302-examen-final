CREATE DATABASE IF NOT EXISTS taller_web_db;
USE taller_web_db;

-- Entidad secundaria (Relacionada)
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Entidad principal solicitada con Llave Foránea (FK)
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL CHECK (total > 0),
    estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

-- Datos iniciales para pruebas rápidas
INSERT INTO clientes (nombre, email) VALUES 
('Juan Pérez', 'juan.perez@email.com'),
('María Jofre', 'maria.jofre@email.com');

INSERT INTO pedidos (id_cliente, total, estado) VALUES 
(1, 15500.00, 'Procesando');