import { checkEmailQuery, insertUserQuery } from '../models/usuario.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const addUser = async (email, password, nombre) => {

    // Validar que se proporcionen todos los campos requeridos

    if (!email || !password || !nombre) {
        throw new Error('Todos los campos son requeridos');
    }

    // Verificar si el correo electrónico ya está registrado se agrega esto por que estaba registrando usuarios con el mismo email

    try {
        const existingUser = await checkEmailQuery(email);

        // verificacion de correo
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado');
        }

        // Hasheo de contraseña

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar el nuevo usuario en la base de datos en caso de que no exista el email

        const newUser = await insertUserQuery(email, hashedPassword, nombre);

        return { message: 'Usuario agregado con exito',
            user: {
                email: newUser.email,
                nombre: newUser.nombre
            }
        };

        // console.log('Usuario agregado con éxito');

    } catch (error) {
        throw new Error('Error al agregar usuario: ' + error.message);
    }
};

export const loginUser = async (email, password) => {

    // Validar que se proporcionen email y password

    if (!email || !password) {
        throw new Error('El correo electrónico y la contraseña son requeridos');
    }

    // Buscar el usuario por email

    try {
        const searchUser = await checkEmailQuery(email);

        // Verificar si el usuario existe

        if (!searchUser) {
            throw new Error('Usuario no encontrado');
        }

        // Comparar la contraseña proporcionada con la almacenada (usando bcrypt)

        const isMatch = await bcrypt.compare(password, searchUser.password);
        if (!isMatch) {
            throw new Error('Contraseña incorrecta');
        }

        // Generar el token JWT

        const token = jwt.sign(
        { id_usuarios: searchUser.id_usuarios, 
            email: searchUser.email, 
            nombre: searchUser.nombre, 
            admin: searchUser.admin 
        },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return token; // Devuelve el token JWT generado

    } catch (error) {
        throw new Error('Error al iniciar sesión: ' + error.message);
    }
};
