import { pool } from "../../database/pool.js";

export const newOrderModel = async (monto_total, usuario_id, libros, estado = false) => {
try {
    const queryPedido = `INSERT INTO pedidos (fecha_pedido, estado, monto_total, usuario_id)VALUES (NOW(), $1, $2, $3) RETURNING id_pedido;`;

    const pedidoValues = [estado, monto_total, usuario_id];
    const pedidoResult = await pool.query(queryPedido, pedidoValues);
    const pedidoId = pedidoResult.rows[0].id_pedido;

    const queryLibro = `INSERT INTO pedidos_libros (pedido_id, libro_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4);`;

    for (const libro of libros) {
    const values = [pedidoId, libro.libro_id, libro.cantidad, libro.precio_unitario];
    await pool.query(queryLibro, values);
    }

    return { id_pedido: pedidoId, mensaje: 'Pedido creado correctamente' };

} catch (error) {
    throw new Error('Error al crear el pedido: ' + error.message);
}
};