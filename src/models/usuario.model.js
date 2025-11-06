import { pool } from '../../database/pool.js';

export const checkEmailQuery = async (email) => {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
}

export const insertUserQuery = async (email, hashedPassword, nombre) => {
    const query = 
        'INSERT INTO usuarios (email, password, nombre) VALUES ($1, $2, $3) RETURNING email, nombre';
    const values = [email, hashedPassword, nombre];
    const result = await pool.query(query, values);
    return result.rows[0];
}