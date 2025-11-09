import { newOrderModel } from "../models/pedidos.model.js";

export const newOrdenController = async (req, res) => {
const { monto_total, libros } = req.body; 
const usuario_id = req.user.id_usuarios;

try {
    const nuevoPedido = await newOrderModel(monto_total, usuario_id, libros);
    res.status(201).json({
    message: 'Pedido agregado con éxito',
    pedido: nuevoPedido
    });
} catch (error) {
    console.error('Error al crear pedido:', error.message);
    res.status(500).json({ error: 'Error al crear el pedido.' });
}
};