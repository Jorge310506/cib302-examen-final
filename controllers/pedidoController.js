const db = require('../config/db');

// CREATE - Crear Pedido (Retorna 201)
exports.createPedido = async (req, res) => {
    const { id_cliente, total, estado } = req.body;

    if (!id_cliente || total === undefined) {
        return res.status(400).json({ error: 'id_cliente y total son obligatorios.' });
    }
    if (parseFloat(total) <= 0) {
        return res.status(400).json({ error: 'El total debe ser mayor a 0.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO pedidos (id_cliente, total, estado) VALUES (?, ?, ?)',
            [id_cliente, total, estado || 'Pendiente']
        );
        res.status(201).json({
            id_pedido: result.insertId,
            message: 'Pedido creado exitosamente.'
        });
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'El id_cliente no existe en la base de datos.' });
        }
        res.status(500).json({ error: 'Error del servidor', details: error.message });
    }
};

// READ - Obtener todos los pedidos (con datos del cliente mediante JOIN)
exports.getAllPedidos = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.id_pedido, p.fecha_pedido, p.total, p.estado, 
                   c.nombre AS cliente, c.email AS email_cliente
            FROM pedidos p
            INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos', details: error.message });
    }
};

// READ - Obtener un pedido por ID
exports.getPedidoById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT p.id_pedido, p.fecha_pedido, p.total, p.estado, 
                   c.nombre AS cliente, c.email AS email_cliente
            FROM pedidos p
            INNER JOIN clientes c ON p.id_cliente = c.id_cliente
            WHERE p.id_pedido = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el pedido', details: error.message });
    }
};

// UPDATE - Modificar un pedido existente
exports.updatePedido = async (req, res) => {
    const { id } = req.params;
    const { id_cliente, total, estado } = req.body;

    if (total !== undefined && parseFloat(total) <= 0) {
        return res.status(400).json({ error: 'El total debe ser mayor a 0.' });
    }

    try {
        const [exists] = await db.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
        if (exists.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado.' });
        }

        await db.query(
            'UPDATE pedidos SET id_cliente = COALESCE(?, id_cliente), total = COALESCE(?, total), estado = COALESCE(?, estado) WHERE id_pedido = ?',
            [id_cliente, total, estado, id]
        );
        res.status(200).json({ message: 'Pedido actualizado de forma exitosa.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar', details: error.message });
    }
};

// DELETE - Eliminar un pedido (Retorna 204 sin contenido)
exports.deletePedido = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado.' });
        }
        res.status(204).send(); // Código 204 exigido por la pauta
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar', details: error.message });
    }
};
