import { pool } from '../../database/pool.js';

export const checkEmailQuery = async (email) => {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

export const insertUserQuery = async (email, hashedPassword, nombre) => {
    const query = 
        'INSERT INTO usuarios (email, password, nombre) VALUES ($1, $2, $3) RETURNING email, nombre';
    const values = [email, hashedPassword, nombre];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getUserById = async (userId) => {
    const query = 'SELECT id_usuarios, email, nombre FROM usuarios WHERE id_usuarios = $1';
    const values = [userId];
    try {
    const result = await pool.query(query, values);
    return result.rows[0];
    } catch (error) {
        throw new Error('Error al obtener los datos del usuario' + error.message);
    }
};

export const deleteUser = async(id_usuarios) => {
    const query = 'DELETE FROM usuarios WHERE id_usuarios = $1';
    const values = [id_usuarios];
    
    try {
        const result = await pool.query(query, values);
        return result.rowCount;
    } catch (error) {
        throw new Error('Error al eliminar el usuario: ' + error.message);
    }
}